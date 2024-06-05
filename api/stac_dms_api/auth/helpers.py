"""Various helpers for auth. Mainly about tokens blocklisting.

Heavily inspired by
https://github.com/vimalloc/flask-jwt-extended/blob/master/examples/blocklist_database.py
"""

from werkzeug.exceptions import HTTPException
from typing import List

from stac_dms_api.schemas import HTTPAuthExceptionSchema
from stac_dms_api import aadtoken

from flask import Response, request
from functools import wraps
from sqlalchemy.orm.exc import NoResultFound

import os
import jwt


# Error handler
class HTTPAuthException(HTTPException):
    def __init__(self, description: str, status_code: int, code: str) -> None:
        super().__init__(description)
        schema = HTTPAuthExceptionSchema()
        self.response = Response(
            status=status_code,
            mimetype="application/json",
            response=schema.dumps(
                {
                    "code": code,
                    "description": description,
                }
            ),
        )


def requires_jwt_authorization(f):
    """Determine if the Access Token is valid."""

    @wraps(f)
    def auth_check(*args, **kwargs):
        user = get_current_user()

        return f(*args, **kwargs, user=user)

    return auth_check


def get_current_user() -> User:
    try:
        token_parts = get_token_auth_header()
        token = token_parts[1]

    except Exception as exc:
        raise HTTPAuthException(
            description="Unable to parse authorization token.",
            status_code=401,
            code="invalid_header",
        ) from exc

    if token_parts[0] == "Bearer":
        user = get_user_from_bearer_token(token)

    elif token_parts[0] == "ApiKey":
        user = get_user_from_api_key(api_key=token)

    return user


def get_user_from_api_key(api_key: str) -> User:
    try:
        token = Token.query.filter_by(token=api_key).one()
    except NoResultFound as e:
        raise HTTPAuthException(
            description="Apikey doesnt exist", status_code=401, code="apikey_unknown"
        ) from e

    if token.revoked:
        print(token.to_dict())
        raise HTTPAuthException(
            description="Apikey has been revoked",
            status_code=401,
            code="apikey_revoked",
        )

    return token.user


def get_user_from_bearer_token(token):
    try:
        public_key = aadtoken.get_public_key(token)
        issuer = "https://login.microsoftonline.com/{tenant_id}/v2.0".format(
            tenant_id=os.getenv("TENANT_ID")
        )

        token_object = jwt.decode(
            token,
            public_key,
            verify=True,
            algorithms=["RS256"],
            audience=[os.getenv("CLIENT_ID")],
            issuer=issuer,
        )

    except jwt.ExpiredSignatureError as jwt_expired_exc:
        raise HTTPAuthException(
            description="token is expired", status_code=401, code="token_expired"
        ) from jwt_expired_exc
    except Exception as exc:
        raise HTTPAuthException(
            description=f"Unable to parse authorization token. {str(exc.__class__)}",
            status_code=401,
            code="invalid_header",
        ) from exc

    # fetch user from database based on token object
    try:
        email = str.lower(token_object.get("preferred_username"))
        user = db.session.query(User).filter_by(email=email).one()

    except NoResultFound:
        user = User(
            username=token_object.get("name"),
            email=str.lower(token_object.get("preferred_username")),
            active=True,
        )
        db.session.add(user)
        db.session.commit()
    return user


def get_token_auth_header() -> List[str]:
    """Obtain the Access Token from the Authorization Header."""
    auth = request.headers.get("Authorization", None)

    if not auth:
        raise HTTPAuthException(
            description="Authorization header is expected",
            status_code=401,
            code="authorization_header_missing",
        )

    parts = auth.split()

    print(f"header type: '{parts[0].lower()}'")

    if parts[0].lower() != "bearer" and parts[0].lower() != "apikey":
        raise HTTPAuthException(
            description="Authorization header must start with Bearer or ApiKey",
            status_code=401,
            code="invalid_header",
        )
    elif len(parts) == 1:
        raise HTTPAuthException(
            description="Token not found", status_code=401, code="invalid_header"
        )
    elif len(parts) > 2:
        raise HTTPAuthException(
            description="Authorization header must be Bearer token",
            status_code=401,
            code="invalid_header",
        )

    return parts
