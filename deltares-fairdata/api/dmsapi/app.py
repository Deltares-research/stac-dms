"""FastAPI application."""

import logging
import os
from contextlib import asynccontextmanager

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

from dmsapi.config import DMSAPISettings
from dmsapi.core.stacdms import StacDmsApi
from dmsapi.core.startup import create_admin_users, run_migrations
from dmsapi.database.db import create_db_engine
from dmsapi.extensions.core.sso_auth_extension import SSOAuthExtension
from dmsapi.extensions.keywords.keyword_extension import KeywordExtension
from dmsapi.extensions.rbac.rbac_extension import RBACExtension
from dmsapi.extensions.topics.topic_extension import TopicExtension


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
    TopicExtension(
        topic_field="properties.deltares:topics",
        index_name="*",
    )
]

auth_enabled_value = getattr(settings, 'auth_enabled', None) or ""
_LOGGER.info(f"Checking auth_enabled: value='{auth_enabled_value}', lower='{auth_enabled_value.lower()}', condition result={auth_enabled_value.lower() != 'false'}")

if auth_enabled_value.lower() != "false":
    _LOGGER.info("Auth is enabled - adding RBACExtension and SSOAuthExtension")
    extensions.append(RBACExtension())
    extensions.append(
        SSOAuthExtension(
            settings=settings, 
            sso_client=sso_client, 
            public_endpoints=[]
        )
    )
else:
    _LOGGER.info("Auth is disabled - NOT adding authentication extensions")

middlewares = []

database_logic.extensions = [type(ext).__name__ for ext in extensions]

post_request_model = create_post_request_model(extensions)


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    create_admin_users()
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


# def create_handler(app):
#     """Create a handler to use with AWS Lambda if mangum available."""
#     try:
#         from mangum import Mangum

#         return Mangum(app)
#     except ImportError:
#         return None


# handler = create_handler(app)
