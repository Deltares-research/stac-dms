import pytest
from dmsapi.database.models import Keyword_GroupPublicWithKeywords  # type: ignore
from httpx import AsyncClient
from pydantic import TypeAdapter


# test get keywords by facility
@pytest.mark.asyncio
async def test_get_keywords_by_facility(
    authenticated_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    facility1, facility2 = facilities
    keywordgroup1, keywordgroup2 = keywordgroups

    response = await authenticated_client.get(f"/keywords?facility_id={facility1.id}")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    keywordgroup_ids = [group["id"] for group in response_data]
    assert str(keywordgroup1.id) in keywordgroup_ids
    assert str(keywordgroup2.id) in keywordgroup_ids


# test get keywords by keyword group
@pytest.mark.asyncio
async def test_get_keywords_by_keywordgroup(
    authenticated_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    keywordgroup1, keywordgroup2 = keywordgroups

    response = await authenticated_client.get(
        f"/keywords?keyword_group_id={keywordgroup1.id}"
    )
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 1
    assert response_data[0]["id"] == str(keywordgroup1.id)


# test get keywords by facility and keyword group invalid
@pytest.mark.asyncio
async def test_get_keywords_by_facility_and_keywordgroup_invalid(
    authenticated_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    facility1, facility2 = facilities
    keywordgroup1, keywordgroup2 = keywordgroups
    response = await authenticated_client.get(
        f"/keywords?facility_id={facility1.id}&keyword_group_id={keywordgroup2.id}"
    )
    assert response.status_code == 400
    response_data = response.json()
    assert response_data["code"] == "InvalidQueryParameter"
    assert (
        response_data["description"]
        == "Only one of facility_id or keyword_group_id can be provided"
    )


# test get keywords without filters
@pytest.mark.asyncio
async def test_get_keywords_unfiltered(
    authenticated_client: AsyncClient,
    filled_db,
):
    facilities, keywordgroups = filled_db
    keywordgroup1, keywordgroup2 = keywordgroups
    KeywordGroupList = TypeAdapter(list[Keyword_GroupPublicWithKeywords])

    response = await authenticated_client.get("/keywords")
    assert response.status_code == 200

    result = KeywordGroupList.validate_json(response.content)
    assert len(result) == 2
    assert keywordgroup1.id in [group.id for group in result]
    assert keywordgroup2.id in [group.id for group in result]
