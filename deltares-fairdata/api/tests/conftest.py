import os

from authlib.jose import OctKey
from dmsapi.core.stacdms import StacDmsApi
from dmsapi.extensions.core.sso_auth_extension import COOKIE_NAME, SSOAuthExtension
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from dmsapi.extensions.rbac.rbac_client import RBACClient
from dmsapi.extensions.rbac.rbac_extension import RBACExtension
from dmsapi.middlewares.authorization_middleware import AuthorizationMiddleware
from dmsapi.schemas.requests import GroupRoleRequest
from fastapi import FastAPI
from fastapi_sso import MicrosoftSSO, OpenID
from sqlmodel import SQLModel
from starlette.middleware import Middleware

## This part is gross but it's the only way to get the settings to load withouth changing to much in the underlying package
if "ES_HOST" not in os.environ:
    os.environ["ES_HOST"] = "opensearch"
if "ES_PORT" not in os.environ:
    os.environ["ES_PORT"] = "9200"


import pytest
import pytest_asyncio
from dmsapi.config import DMSAPISettings
from dmsapi.database.db import create_db_engine, get_session
from dmsapi.database.models import (  # type: ignore
    GLOBAL_SCOPE,
    Facility,
    FacilityKeywordGroupLink,
    Group,
    GroupCreate,
    Keyword_Group,
    Role,
    User,
)
from dmsapi.extensions.keywords.keyword_extension import KeywordExtension
from httpx import ASGITransport, AsyncClient
from stac_fastapi.api.models import create_get_request_model, create_post_request_model
from stac_fastapi.core.core import (
    BulkTransactionsClient,
    CoreClient,
    EsAsyncBaseFiltersClient,
    TransactionsClient,
)
from stac_fastapi.core.extensions import QueryExtension
from stac_fastapi.core.session import Session
from stac_fastapi.extensions.core import (
    FieldsExtension,
    FilterExtension,
    SortExtension,
    TokenPaginationExtension,
    TransactionExtension,
)
from stac_fastapi.opensearch.database_logic import (
    DatabaseLogic,
)
from stac_fastapi.types.config import Settings

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


dms_settings = DMSAPISettings(
    azure_app_client_id="",
    azure_app_client_secret="",
    azure_tenant_id="",
    app_domain="",
    app_secret_key="",
    db_connection_url=f"sqlite:////{DATA_DIR}/test.db",
    environment="test",
)

Settings.set(dms_settings)


database = DatabaseLogic()
settings = Settings.get()


@pytest.fixture
def core_client():
    return CoreClient(database=database, session=None)


@pytest.fixture
def txn_client():
    return TransactionsClient(database=database, session=None, settings=settings)


@pytest.fixture
def bulk_txn_client():
    return BulkTransactionsClient(database=database, session=None, settings=settings)


@pytest.fixture(scope="function")
def db_engine():
    db_engine = create_db_engine()
    SQLModel.metadata.drop_all(db_engine)
    SQLModel.metadata.create_all(db_engine)
    yield db_engine
    SQLModel.metadata.drop_all(db_engine)


@pytest.fixture(scope="function")
def keyword_client(db_engine):
    return KeywordExtension(db_engine=db_engine).client


@pytest_asyncio.fixture(scope="function")
async def app(db_engine):
    settings = Settings.get()
    session = Session.create_from_settings(settings)
    filter_extension = FilterExtension(client=EsAsyncBaseFiltersClient())
    filter_extension.conformance_classes.append(
        "http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators"
    )
    extensions = [
        TransactionExtension(
            client=TransactionsClient(
                database=database, session=session, settings=settings
            ),
            settings=settings,
        ),
        FieldsExtension(),
        QueryExtension(),
        SortExtension(),
        TokenPaginationExtension(),
        filter_extension,
        KeywordExtension(db_engine=db_engine),
        SSOAuthExtension(
            settings=settings,
            sso_client=MicrosoftSSO(
                client_id=settings.azure_app_client_id,
                client_secret=settings.azure_app_client_secret,
            ),
        ),
        RBACExtension(db_engine=db_engine),
    ]
    SQLModel.metadata.create_all(db_engine)

    middlewares = [
        Middleware(AuthorizationMiddleware, db_engine=db_engine, settings=settings)
    ]

    post_request_model = create_post_request_model(extensions)
    stac_dms_api = StacDmsApi(
        settings=settings,
        client=CoreClient(
            database=database,
            session=None,
            extensions=extensions,
            post_request_model=post_request_model,
        ),
        extensions=extensions,
        middlewares=middlewares,
        search_get_request_model=create_get_request_model(extensions),
        search_post_request_model=post_request_model,
    )
    yield stac_dms_api.app


@pytest_asyncio.fixture(scope="function")
async def app_client(app: FastAPI):
    # await create_index_templates()
    # await create_collection_index()

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test-server"
    ) as c:
        yield c


@pytest.fixture(scope="function")
def rbac_client(db_engine):
    return RBACExtension(db_engine=db_engine).client


@pytest_asyncio.fixture(scope="function")
async def keyword_group(keyword_client: KeywordClient):
    keyword_group = keyword_client.create_keywordgroup(
        {"group_name_nl": "test", "group_name_en": "engelse_test"}
    )
    yield keyword_group
    try:
        keyword_client.delete_keyword_group(str(keyword_group.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def facility(keyword_client: KeywordClient):
    facility = keyword_client.create_facility({"name": "test_facility"})
    yield facility
    try:
        keyword_client.delete_facility(str(facility.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def facility_keyword_group_link(
    keyword_client: KeywordClient, facility: Facility, keyword_group: Keyword_Group
):
    link = FacilityKeywordGroupLink(
        facility_id=str(facility.id), keyword_group_id=str(keyword_group.id)
    )
    result = keyword_client.link_keywordgroup_to_facility(link)
    yield link
    try:
        keyword_client.unlink_keywordgroup_from_facility(link)
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def keyword(keyword_client: KeywordClient, keyword_group: Keyword_Group):
    return keyword_client.create_keyword(
        {
            "group_id": keyword_group.id,
            "nl_keyword": "testwoord",
            "en_keyword": "english_testword",
        }
    )


@pytest_asyncio.fixture(scope="function")
async def filled_db(keyword_client: KeywordClient):
    # create facilities
    facility1 = keyword_client.create_facility({"name": "test_facility"})
    facility2 = keyword_client.create_facility({"name": "test_facility2"})

    # create keyword group
    keyword_group1 = keyword_client.create_keywordgroup(
        {"group_name_nl": "testgroup1", "group_name_en": "engelse_testgroup1"}
    )
    keyword_group2 = keyword_client.create_keywordgroup(
        {"group_name_nl": "testgroup2", "group_name_en": "engelse_testgroup2"}
    )

    # link facility1 to both keyword groups, facility2 to the second keyword group
    keyword_client.link_keywordgroup_to_facility(
        FacilityKeywordGroupLink(
            facility_id=str(facility1.id), keyword_group_id=str(keyword_group1.id)
        )
    )
    keyword_client.link_keywordgroup_to_facility(
        FacilityKeywordGroupLink(
            facility_id=str(facility1.id), keyword_group_id=str(keyword_group2.id)
        )
    )
    keyword_client.link_keywordgroup_to_facility(
        FacilityKeywordGroupLink(
            facility_id=str(facility2.id), keyword_group_id=str(keyword_group2.id)
        )
    )

    # fill keywordgroups with keywords
    keyword_client.create_keyword(
        {
            "group_id": keyword_group1.id,
            "nl_keyword": "testwoord1group1",
            "en_keyword": "english_testword",
        }
    )
    keyword_client.create_keyword(
        {
            "group_id": keyword_group1.id,
            "nl_keyword": "testwoord2group1",
            "en_keyword": "english_testword",
        }
    )
    keyword_client.create_keyword(
        {
            "group_id": keyword_group2.id,
            "nl_keyword": "testwoord1group2",
            "en_keyword": "english_testword",
        }
    )
    keyword_client.create_keyword(
        {
            "group_id": keyword_group2.id,
            "nl_keyword": "testwoord2group2",
            "en_keyword": "english_testword",
        }
    )
    return [facility1, facility2], [keyword_group1, keyword_group2]


@pytest_asyncio.fixture(scope="function")
async def user(rbac_client: RBACClient):
    session = next(get_session())
    user = rbac_client.create_user(
        {
            "username": "test_user",
            "email": "test.test@deltares.nl",
        },
        session,
    )
    yield user
    try:
        rbac_client.delete_user(str(user.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def group(rbac_client: RBACClient):
    group = rbac_client.create_group(
        {
            "name": "test_group",
            "description": "test_description",
        }
    )
    yield group
    try:
        rbac_client.delete_group(str(group.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def data_producer_group(rbac_client: RBACClient):
    session = next(get_session())
    group = rbac_client.create_group(
        GroupCreate(
            name="data_producer_group",
            description="data_producer_group",
        )
    )
    rbac_client.assign_group_role(
        GroupRoleRequest(
            group_id=group.id,
            role=Role.DATA_PRODUCER,
            object="test_object",
        ),
        session,
    )
    yield group
    try:
        rbac_client.delete_group(str(group.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def admin_group(rbac_client: RBACClient):
    session = next(get_session())
    group = rbac_client.create_group(
        GroupCreate(
            name="admin_group",
            description="admin_group",
        )
    )
    rbac_client.assign_group_role(
        GroupRoleRequest(
            group_id=group.id,
            role=Role.ADMIN,
            object=GLOBAL_SCOPE,
        ),
        session,
    )
    yield group
    try:
        rbac_client.delete_group(str(group.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def data_producer_user(rbac_client: RBACClient, data_producer_group: Group):
    session = next(get_session())
    user = rbac_client.create_user(
        {
            "username": "data_producer_user",
            "email": "data_producer_user@deltares.nl",
        },
        session,
    )
    rbac_client.add_users_to_group(data_producer_group.id, [user])
    yield user
    try:
        rbac_client.delete_user(str(user.id))
    except Exception:
        pass


@pytest_asyncio.fixture(scope="function")
async def admin_user(rbac_client: RBACClient, admin_group: Group):
    session = next(get_session())
    user = rbac_client.create_user(
        {
            "username": "admin_user",
            "email": "admin_user@deltares.nl",
        },
        session,
    )
    rbac_client.add_users_to_group(admin_group.id, [user])
    yield user
    try:
        rbac_client.delete_user(str(user.id))
    except Exception:
        pass


def _token(user: User):
    """Create a test JWT token for the given user."""
    user_openid = OpenID(
        email=user.email,
        name=user.username,
    )
    date, token = SSOAuthExtension.create_token(
        user_openid, OctKey.import_key(settings.app_secret_key)
    )
    return token


@pytest_asyncio.fixture(scope="function")
async def authenticated_client(app_client: AsyncClient, user: User):
    token = _token(user)
    app_client.headers["Cookie"] = f"{COOKIE_NAME}={token}"
    return app_client


@pytest_asyncio.fixture(scope="function")
async def data_producer_client(app_client: AsyncClient, data_producer_user: User):
    token = _token(data_producer_user)
    app_client.headers["Cookie"] = f"{COOKIE_NAME}={token}"
    return app_client


@pytest_asyncio.fixture(scope="function")
async def admin_client(app_client: AsyncClient, admin_user: User):
    token = _token(admin_user)
    app_client.headers["Cookie"] = f"{COOKIE_NAME}={token}"
    return app_client
