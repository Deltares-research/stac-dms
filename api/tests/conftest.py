import os

from dmsapi.core.stacdms import StacDmsApi
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from sqlmodel import SQLModel

## This part is gross but it's the only way to get the settings to load withouth changing to much in the underlying package
if "ES_HOST" not in os.environ:
    os.environ["ES_HOST"] = "opensearch"
if "ES_PORT" not in os.environ:
    os.environ["ES_PORT"] = "9200"


from dmsapi.config import DMSAPISettings
from dmsapi.database.db import create_db_engine
import dmsapi.database.models
from dmsapi.database.models import Facility, FacilityKeywordGroupLink, Keyword_Group  # type: ignore
from dmsapi.extensions.keywords.keyword_extension import KeywordExtension

import pytest
import pytest_asyncio
from httpx import AsyncClient
from stac_fastapi.core.session import Session

from stac_fastapi.api.models import create_get_request_model, create_post_request_model
from stac_fastapi.core.core import (
    BulkTransactionsClient,
    CoreClient,
    EsAsyncBaseFiltersClient,
    TransactionsClient,
)
from stac_fastapi.core.extensions import QueryExtension

from stac_fastapi.opensearch.database_logic import (
    DatabaseLogic,
)

from stac_fastapi.extensions.core import (
    FieldsExtension,
    FilterExtension,
    SortExtension,
    TokenPaginationExtension,
    TransactionExtension,
)
from stac_fastapi.types.config import Settings

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


settings = DMSAPISettings(
    azure_app_client_id="",
    azure_app_client_secret="",
    azure_tenant_id="",
    app_domain="",
    app_secret_key="",
    db_connection_url=f"sqlite:////{DATA_DIR}/test.db",
    environment="test",
)

Settings.set(settings)


database = DatabaseLogic()
settings = Settings.get()
db_engine = create_db_engine(settings)
SQLModel.metadata.drop_all(db_engine)
SQLModel.metadata.create_all(db_engine)


@pytest.fixture
def core_client():
    return CoreClient(database=database, session=None)


@pytest.fixture
def txn_client():
    return TransactionsClient(database=database, session=None, settings=settings)


@pytest.fixture
def bulk_txn_client():
    return BulkTransactionsClient(database=database, session=None, settings=settings)


@pytest.fixture(scope="session")
def keyword_client():
    return KeywordExtension(db_engine=db_engine).client


@pytest_asyncio.fixture(scope="session")
async def app():
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
    ]
    SQLModel.metadata.create_all(db_engine)

    post_request_model = create_post_request_model(extensions)

    return StacDmsApi(
        settings=settings,
        client=CoreClient(
            database=database,
            session=None,
            extensions=extensions,
            post_request_model=post_request_model,
        ),
        extensions=extensions,
        search_get_request_model=create_get_request_model(extensions),
        search_post_request_model=post_request_model,
    ).app


@pytest_asyncio.fixture(scope="session")
async def app_client(app):
    # await create_index_templates()
    # await create_collection_index()

    async with AsyncClient(app=app, base_url="http://test-server") as c:
        yield c


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
