from fastapi import HTTPException, Request
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from authlib.jose import jwt
from sqlalchemy.engine import Engine

from dmsapi.extensions.rbac.rbac_client import RBACClient


class AuthorizationMiddleware(BaseHTTPMiddleware):

    def __init__(self, app, db_engine: Engine):
        super().__init__(app)
        self.db_engine = db_engine

    async def dispatch(self, request: Request, call_next):
        cookie = request.headers.get("Cookie").split('DMS_TOKEN=')[-1]
        claims = jwt.decode(cookie, key="secretstuff")
        path = request['path']

        if path != '/collections':
            if path.startswith('/collections'):
                collection = path.split('/')[2]

                if not RBACClient.check_permission(self.db_engine, claims["email"].lower(), 'admin', collection):
                    raise HTTPException(status_code=403, detail="Unauthorized")
        
        response = await call_next(request)
        return response