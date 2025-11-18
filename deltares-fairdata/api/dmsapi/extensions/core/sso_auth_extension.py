import datetime
import logging
from typing import (
    Annotated,
    List,
    Optional,
)  # to calculate expiration of the JWT

from authlib.jose import Key, OctKey, jwt
from dmsapi.config import DMSAPISettings
from dmsapi.database.db import get_session
from dmsapi.database.models import User
from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request, Security
from fastapi.responses import RedirectResponse
from fastapi.routing import APIRoute
from fastapi.security import (
    APIKeyCookie,
)  # this is the part that puts the lock icon to the docs
from fastapi_sso import OpenID, SSOBase
from sqlmodel import Session
from stac_fastapi.api.routes import Scope, add_route_dependencies
from stac_fastapi.types.extension import ApiExtension

_LOGGER = logging.getLogger("uvicorn.default")

COOKIE_NAME = "DMS_TOKEN"
APP_SECRET_KEY: Optional[Key] = None


class SSOAuthExtension(ApiExtension):
    """SSO Auth Extension.

    The SSO Auth extension adds several endpoints which allow user login and logout:
        GET /auth/login
        GET /auth/logout
        GET /auth/callback
        GET /auth/me

    Attributes:
        SSOclient: fastapi_sso client

    """

    sso_client: SSOBase
    settings: DMSAPISettings
    algorithm: str = "HS256"
    public_endpoints: List[Scope] = []

    def __init__(
        self,
        settings: DMSAPISettings,
        sso_client: SSOBase,
        algorithm: Optional[str] = None,
        public_endpoints: Optional[List[Scope]] = None,
    ):
        self.sso_client = sso_client
        self.settings = settings
        global APP_SECRET_KEY
        APP_SECRET_KEY = OctKey.import_key(settings.app_secret_key)
        if algorithm:
            self.algorithm = algorithm
        if public_endpoints:
            self.public_endpoints = public_endpoints

    def register(self, app: FastAPI) -> None:
        """Apply SSO authentication to the provided FastAPI application \
            based on environment variables for username, password, and endpoints.

        Args:
            api (StacApi): The FastAPI application.

        Raises:
            HTTPException: If there are issues with the configuration or format
                        of the environment variables.
        """

        self.configure_auth(app)

        extension_public_endpoints: List[Scope] = [
            {"path": "/", "method": "GET"},
            {"path": "/auth/login", "method": "GET"},
            {"path": "/auth/logout", "method": "GET"},
            {"path": "/auth/callback", "method": "GET"},
            {"path": "/auth/me", "method": "GET"},
            {"path": "/config", "method": "GET"},
        ]

        all_public_endpoints = self.public_endpoints + extension_public_endpoints

        for route in app.routes:
            if isinstance(route, APIRoute):
                for method in route.methods:
                    endpoint = Scope(path=route.path, method=method)
                    if endpoint not in all_public_endpoints:
                        add_route_dependencies(
                            app.router.routes,
                            [endpoint],
                            [Depends(self.get_logged_user)],
                        )

        _LOGGER.info("SSO authentication enabled.")

    @staticmethod
    def get_logged_user(
        cookie: str = Security(APIKeyCookie(name=COOKIE_NAME, auto_error=False)),
    ) -> OpenID:
        """Get user's JWT stored in cookie 'token', parse it and return the user's OpenID."""
        try:
            if not cookie:
                raise HTTPException(
                    status_code=401, detail="No authentication credentials provided"
                )
            claims = jwt.decode(cookie, key=APP_SECRET_KEY)
            claims.validate()
            return OpenID(**claims)
        except Exception as error:
            _LOGGER.debug(f"Error while decoding JWT: {error}")
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            ) from error

    def configure_auth(self, app: FastAPI):
        app.add_api_route("/auth/login", self.login, methods=["GET"])
        app.add_api_route("/auth/logout", self.logout, methods=["GET"])
        app.add_api_route("/auth/callback", self.login_callback, methods=["GET"])
        app.add_api_route("/auth/me", self.user_me, methods=["GET"])  # type: ignore

    @staticmethod
    async def user_me(user: OpenID = Depends(get_logged_user)) -> OpenID:
        """This endpoint will say return the validated claims of the logged in user."""
        return user

    async def login(self):
        """Redirect the user to the Microsoft login page."""
        with self.sso_client:
            return await self.sso_client.get_login_redirect()

    async def logout(self):
        """Forget the user's session."""
        frontend_url = self.settings.frontend_url.strip().rstrip('/')
        # Ensure URL is absolute (starts with http:// or https://)
        if not frontend_url.startswith(('http://', 'https://')):
            _LOGGER.warning(f"frontend_url '{frontend_url}' is not absolute, redirect may fail")
        response = RedirectResponse(url=f"{frontend_url}/")
        response.delete_cookie(key=COOKIE_NAME)
        return response

    async def login_callback(self, request: Request, background_tasks: BackgroundTasks):
        """Process login and redirect the user to the protected endpoint."""
        with self.sso_client:
            openid = await self.sso_client.verify_and_process(request)
            if not openid:
                raise HTTPException(status_code=401, detail="Authentication failed")
        frontend_url = self.settings.frontend_url.strip().rstrip('/')
        # Ensure URL is absolute (starts with http:// or https://)
        if not frontend_url.startswith(('http://', 'https://')):
            _LOGGER.warning(f"frontend_url '{frontend_url}' is not absolute, redirect may fail")
        response = RedirectResponse(url=f"{frontend_url}/")
        expiration, token = self.create_token(openid, APP_SECRET_KEY)
        response.set_cookie(
            key=COOKIE_NAME, value=token, expires=expiration
        )  # This cookie will make sure /protected knows the user
        background_tasks.add_task(add_user, openid)
        return response

    @staticmethod
    def create_token(openid: OpenID, key: Key) -> tuple[datetime.datetime, str]:
        """Create a JWT token for the given OpenID.

        Args:
            openid: The OpenID to create a token for
            algorithm: The algorithm to use for signing

        Returns:
            Tuple of expiration datetime and encoded token string
        """
        expiration = datetime.datetime.now(
            tz=datetime.timezone.utc
        ) + datetime.timedelta(days=1)
        token = jwt.encode(
            payload={
                **openid.model_dump(),
                "exp": int(expiration.strftime("%s")),
                "sub": openid.id,
            },
            header={"alg": SSOAuthExtension.algorithm},
            key=key,
        ).decode("utf-8")
        return expiration, token


def add_user(
    user: OpenID,
):
    """Add user to database."""
    _LOGGER.info(f"Adding user {user.email} to database")
    session: Session = next(get_session())
    db_user = session.get(entity=User, ident=user.email)
    if not db_user:
        db_user = User(email=user.email, username=user.display_name)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    else:
        _LOGGER.debug(f"User {user.email} already exists in database")


UserDep = Annotated[User, Depends(SSOAuthExtension.get_logged_user)]
