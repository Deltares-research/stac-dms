import logging
import os
import datetime  # to calculate expiration of the JWT
from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.responses import RedirectResponse
from fastapi.routing import APIRoute
from fastapi.security import (
    APIKeyCookie,
)  # this is the part that puts the lock icon to the docs
from fastapi_sso.sso.microsoft import MicrosoftSSO
from fastapi_sso.sso.base import OpenID
from stac_fastapi.api.app import StacApi

from authlib.jose import jwt, OctKey
from authlib.integrations.starlette_client import OAuth

_LOGGER = logging.getLogger("uvicorn.default")

SECRET_KEY = os.getenv("APP_SECRET_KEY", "this-is-very-secret")
CLIENT_ID = os.getenv("AZURE_APP_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("AZURE_APP_CLIENT_SECRET", "")
TENANT_ID = os.getenv("AZURE_TENANT_ID", "")
HOST = os.getenv("APP_DOMAIN", "localhost")

COOKIE_NAME = "token"
ALGORITHM = "HS256"

sso = MicrosoftSSO(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    tenant=TENANT_ID,
    redirect_uri=f"https://{HOST}/api/auth/callback",
    allow_insecure_http=True,
)

key = OctKey.import_key(SECRET_KEY)


async def get_logged_user(
    cookie: str = Security(APIKeyCookie(name=COOKIE_NAME)),
) -> OpenID:
    """Get user's JWT stored in cookie 'token', parse it and return the user's OpenID."""
    try:
        claims = jwt.decode(cookie, key=key)
        claims.validate()
        return OpenID(**claims)
    except Exception as error:
        _LOGGER.error(f"Error decoding JWT: {error.__class__.__name__}: {error}")
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        ) from error


async def protected_endpoint(user: OpenID = Depends(get_logged_user)):
    """This endpoint will say hello to the logged user.
    If the user is not logged, it will return a 401 error from `get_logged_user`."""
    return {
        "message": f"You are very welcome, {user.email}!",
    }


async def login():
    """Redirect the user to the Google login page."""
    with sso:
        return await sso.get_login_redirect()


async def logout():
    """Forget the user's session."""
    response = RedirectResponse(url="/")
    response.delete_cookie(key="token")
    return response


async def login_callback(request: Request):
    """Process login and redirect the user to the protected endpoint."""
    with sso:
        openid = await sso.verify_and_process(request)
        if not openid:
            raise HTTPException(status_code=401, detail="Authentication failed")
    # Create a JWT with the user's OpenID
    expiration = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(
        days=1
    )
    token = jwt.encode(
        payload={
            **openid.model_dump(),
            "exp": int(expiration.strftime("%s")),
            "sub": openid.id,
        },
        header={"alg": ALGORITHM},
        key=key,
    ).decode("utf-8")
    response = RedirectResponse(url="/")
    response.set_cookie(
        key=COOKIE_NAME, value=token, expires=expiration
    )  # This cookie will make sure /protected knows the user
    return response


def configure_auth(app: FastAPI):
    app.add_api_route("/protected", protected_endpoint, methods=["GET"])
    app.add_api_route("/auth/login", login, methods=["GET"])
    app.add_api_route("/auth/logout", logout, methods=["GET"])
    app.add_api_route("/auth/callback", login_callback, methods=["GET"])


def apply_sso_auth(api: StacApi) -> None:
    """Apply SSO authentication to the provided FastAPI application \
        based on environment variables for username, password, and endpoints.

    Args:
        api (StacApi): The FastAPI application.

    Raises:
        HTTPException: If there are issues with the configuration or format
                       of the environment variables.
    """

    configure_auth(api.app)

    public_endpoints = [
        {"path": "/", "method": "GET"},
        {"path": "/auth/login", "method": "GET"},
        {"path": "/auth/logout", "method": "GET"},
        {"path": "/auth/callback", "method": "GET"},
    ]

    app = api.app
    for route in app.routes:
        if isinstance(route, APIRoute):
            for method in route.methods:
                endpoint = {"path": route.path, "method": method}
                if endpoint not in public_endpoints:
                    api.add_route_dependencies([endpoint], [Depends(get_logged_user)])

    _LOGGER.info("SSO authentication enabled.")
