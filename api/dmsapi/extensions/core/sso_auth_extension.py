from dataclasses import dataclass
import logging
import os
import datetime
from functools import partial
from typing import (
    Annotated,
    List,
    Literal,
    Optional,
)  # to calculate expiration of the JWT
from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.responses import RedirectResponse
from fastapi.routing import APIRoute
from fastapi.security import (
    APIKeyCookie,
)  # this is the part that puts the lock icon to the docs
from fastapi_sso import SSOBase, OpenID

from stac_fastapi.api.routes import add_route_dependencies, Scope
from stac_fastapi.types.extension import ApiExtension

from authlib.jose import jwt, Key

_LOGGER = logging.getLogger("uvicorn.default")


COOKIE_NAME = "DMS_TOKEN"
KEY: Key = None


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
    key: Key = None
    algorithm: str = "HS256"
    public_endpoints: List[Scope] = []

    def __init__(
        self,
        sso_client: SSOBase,
        key: Key,
        algorithm: Optional[str] = None,
        public_endpoints: Optional[List[Scope]] = None,
    ):
        self.sso_client = sso_client
        self.key = key
        global KEY
        KEY = key

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
            _LOGGER.info(f"{KEY}")
            claims = jwt.decode(cookie, key=KEY)
            claims.validate()
            return OpenID(**claims)
        except Exception as error:
            _LOGGER.error(f"Error while decoding JWT: {error}")
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
        response = RedirectResponse(url="/")
        response.delete_cookie(key=COOKIE_NAME)
        return response

    async def login_callback(self, request: Request):
        """Process login and redirect the user to the protected endpoint."""
        with self.sso_client:
            openid = await self.sso_client.verify_and_process(request)
            if not openid:
                raise HTTPException(status_code=401, detail="Authentication failed")
        # Create a JWT with the user's OpenID
        expiration = datetime.datetime.now(
            tz=datetime.timezone.utc
        ) + datetime.timedelta(days=1)
        token = jwt.encode(
            payload={
                **openid.model_dump(),
                "exp": int(expiration.strftime("%s")),
                "sub": openid.id,
            },
            header={"alg": self.algorithm},
            key=self.key,
        ).decode("utf-8")
        response = RedirectResponse(url="/")
        response.set_cookie(
            key=COOKIE_NAME, value=token, expires=expiration
        )  # This cookie will make sure /protected knows the user
        return response
