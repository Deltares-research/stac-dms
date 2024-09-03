import pytest
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from dmsapi.database.models import Keyword, Keyword_Group  # type: ignore
from httpx import AsyncClient


# test get keywords by facility
@pytest.mark.asyncio
async def test_get_keywords_by_facility(
    app_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    facility1, facility2 = facilities
    keywordgroup1, keywordgroup2 = keywordgroups

    response = await app_client.get(f"/keywords?facility_id={facility1.id}")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    keywordgroup_ids = [group["id"] for group in response_data]
    assert str(keywordgroup1.id) in keywordgroup_ids
    assert str(keywordgroup2.id) in keywordgroup_ids


# test get keywords by keyword group
@pytest.mark.asyncio
async def test_get_keywords_by_keywordgroup(
    app_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    keywordgroup1, keywordgroup2 = keywordgroups

    response = await app_client.get(f"/keywords?keyword_group_id={keywordgroup1.id}")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 1
    assert response_data[0]["id"] == str(keywordgroup1.id)


# test get keywords by facility and keyword group invalid
@pytest.mark.asyncio
async def test_get_keywords_by_facility_and_keywordgroup_invalid(
    app_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    facility1, facility2 = facilities
    keywordgroup1, keywordgroup2 = keywordgroups

    response = await app_client.get(
        f"/keywords?facility_id={facility1.id}&keyword_group_id={keywordgroup2.id}"
    )
    assert response.status_code == 400
    response_data = response.json()
    assert response_data["code"] == "InvalidQueryParameter"
    assert (
        response_data["description"]
        == "Only one of facility_id or keyword_group_id can be provided"
    )


# test get keywords invalid no parameters
@pytest.mark.asyncio
async def test_get_keywords_no_parameters_invalid(
    app_client: AsyncClient,
):
    response = await app_client.get(f"/keywords")
    assert response.status_code == 400
    response_data = response.json()
    assert response_data["code"] == "InvalidQueryParameter"
    assert (
        response_data["description"]
        == "Either facility_id or keyword_group_id must be provided"
    )
