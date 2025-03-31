"""FastAPI application."""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi_sso.sso.microsoft import MicrosoftSSO
from stac_fastapi.api.models import create_get_request_model, create_post_request_model
from stac_fastapi.core.core import (
    BulkTransactionsClient,
    CoreClient,
    EsAsyncBaseFiltersClient,
    TransactionsClient,
)
from stac_fastapi.core.extensions import QueryExtension
from stac_fastapi.core.extensions.fields import FieldsExtension
from stac_fastapi.core.session import Session
from stac_fastapi.extensions.core import (
    FilterExtension,
    SortExtension,
    TokenPaginationExtension,
    TransactionExtension,
)
from stac_fastapi.extensions.third_party import BulkTransactionExtension
from stac_fastapi.opensearch.database_logic import (
    DatabaseLogic,
    create_collection_index,
    create_index_templates,
)
from stac_fastapi.types.config import Settings
from starlette.middleware import Middleware

from dmsapi.config import DMSAPISettings
from dmsapi.core.stacdms import StacDmsApi
from dmsapi.database.db import create_db_engine
from dmsapi.extensions.core.sso_auth_extension import SSOAuthExtension
from dmsapi.extensions.keywords.keyword_extension import KeywordExtension
from dmsapi.extensions.rbac.rbac_extension import RBACExtension
from dmsapi.middlewares.authorization_middleware import AuthorizationMiddleware

Settings.set(DMSAPISettings())
settings: DMSAPISettings = Settings.get()
_LOGGER = logging.getLogger("uvicorn.default")
session = Session.create_from_settings(settings)
db_engine = create_db_engine()

sso_client = MicrosoftSSO(
    client_id=settings.azure_app_client_id,
    client_secret=settings.azure_app_client_secret,
    tenant=settings.azure_tenant_id,
    redirect_uri=f"https://{settings.app_domain}/api/auth/callback",
    allow_insecure_http=True,
)

filter_extension = FilterExtension(client=EsAsyncBaseFiltersClient())
filter_extension.conformance_classes.append(
    "http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators"
)


database_logic = DatabaseLogic()

extensions = [
    TransactionExtension(
        client=TransactionsClient(
            database=database_logic, session=session, settings=settings
        ),
        settings=settings,
    ),
    BulkTransactionExtension(
        client=BulkTransactionsClient(
            database=database_logic,
            session=session,
            settings=settings,
        )
    ),
    FieldsExtension(),
    QueryExtension(),
    SortExtension(),
    TokenPaginationExtension(),
    filter_extension,
    KeywordExtension(db_engine=db_engine),
    RBACExtension(),
    SSOAuthExtension(settings=settings, sso_client=sso_client, public_endpoints=[]),
]

middlewares = [Middleware(AuthorizationMiddleware, settings=settings)]

database_logic.extensions = [type(ext).__name__ for ext in extensions]

post_request_model = create_post_request_model(extensions)


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    _LOGGER.info("Creating collection index")
    await create_index_templates()
    await create_collection_index()
    _LOGGER.info("Collection index created")
    yield


app = FastAPI(
    lifespan=lifespan,
    openapi_url=settings.openapi_url,
    docs_url=settings.docs_url,
    redoc_url=None,
)
app.root_path = os.getenv("STAC_FASTAPI_ROOT_PATH", "/api")

api = StacDmsApi(
    app=app,
    title=os.getenv("STAC_FASTAPI_TITLE", "stac-fastapi-opensearch"),
    description=os.getenv("STAC_FASTAPI_DESCRIPTION", "stac-fastapi-opensearch"),
    api_version=os.getenv("STAC_FASTAPI_VERSION", "2.1"),
    settings=settings,
    extensions=extensions,
    middlewares=middlewares,
    client=CoreClient(
        database=database_logic, session=session, post_request_model=post_request_model
    ),
    search_get_request_model=create_get_request_model(extensions),
    search_post_request_model=post_request_model,
)


def run_migrations():
    from alembic import command
    from alembic.config import Config

    config_path = Path(__file__).parent.parent / "alembic.ini"
    alembic_cfg = Config(config_path)
    if settings.environment == "local":
        _LOGGER.info(
            f"Checking for unapplied DB migrations. Not running them. using config at {config_path}"
        )
        # command.check(alembic_cfg)
    else:
        _LOGGER.info("Running DB migrations")
        command.upgrade(alembic_cfg, "head")


# def create_handler(app):
#     """Create a handler to use with AWS Lambda if mangum available."""
#     try:
#         from mangum import Mangum

#         return Mangum(app)
#     except ImportError:
#         return None


# handler = create_handler(app)
