from authlib.jose import OctKey, jwt
from dmsapi.config import DMSAPISettings
from dmsapi.database.db import create_db_engine
from dmsapi.database.models import ErrorResponse, UserCreate
from dmsapi.extensions.core.sso_auth_extension import COOKIE_NAME
from dmsapi.extensions.rbac.rbac_client import RBACClient
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyCookie
from fastapi_sso import OpenID
from sqlmodel import Session
from stac_fastapi.types.errors import NotFoundError
from starlette import status
from starlette.middleware.base import BaseHTTPMiddleware


class AuthorizationMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        settings: DMSAPISettings,
    ):
        super().__init__(app)
        self.settings = settings
        self.app_secret_key = OctKey.import_key(settings.app_secret_key)
        self.api_key_cookie = APIKeyCookie(name=COOKIE_NAME, auto_error=False)
        self.rbac_client = RBACClient()
        self.db_engine = create_db_engine()

    async def dispatch(self, request: Request, call_next):
        cookie = await self.api_key_cookie(request)
        if cookie:
            claims = jwt.decode(cookie, key=self.app_secret_key)
        else:
            claims = {}
        user = OpenID(**claims)
        path = request["path"]
        method = request["method"]
        if path.startswith("/api"):
            path = path[4:]
        # Create user if not exists
        if user.email:
            with Session(self.db_engine) as session:
                try:
                    self.rbac_client.get_user_by_email(user.email, session)
                except NotFoundError as _:
                    self.rbac_client.create_user(
                        UserCreate(
                            username=f"{user.first_name} {user.last_name}",
                            email=user.email,
                        ),
                        session,
                    )
        ## Permission model
        # Admins can
        #   - create and delete collections
        #   - create and delete roles
        #   - create and delete groups
        #   - create and delete users
        # Editors can
        #   - update collections
        #   - add, update delete items in specific collection

        if path == "/collections" and method in ["POST"]:
            # TODO: check if user is admin
            pass
        elif path.startswith("/collections") and method != "GET":
            collection = self.get_collection_from_path(path)
            if not collection:
                return JSONResponse(
                    content=ErrorResponse(
                        code="NotFoundError", message="Collection not found"
                    ).model_dump(),
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            # These are requests that edit collections or items in that collection
            if not self.rbac_client.has_permission(
                self.session, claims.get("email", "").lower(), "editor", collection
            ):
                return JSONResponse(
                    content=ErrorResponse(
                        code="UnauthorizedError", message="Unauthorized"
                    ).model_dump(),
                    status_code=status.HTTP_403_FORBIDDEN,
                )

        response = await call_next(request)
        return response

    def get_collection_from_path(self, path: str) -> str:
        if not path.startswith("/collections"):
            return ""

        path_parts = path.split("/")
        if len(path_parts) < 2:
            return ""
        return path_parts[2]
