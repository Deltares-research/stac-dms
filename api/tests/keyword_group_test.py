import pytest
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from dmsapi.database.models import Keyword_Group
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_keywordgroup(
    app_client: AsyncClient, keyword_client: KeywordClient
):
    response = await app_client.post(
        "/keywordgroup", json={"group_name_nl": "test", "group_name_en": "engelse_test"}
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json()["group_name_nl"] == "test"
    assert response.json()["id"] is not None
    assert keyword_client.get_keyword_group(response.json()["id"]) is not None


@pytest.mark.asyncio
async def test_create_keywordgroup_invalid(
    app_client: AsyncClient, keyword_client: KeywordClient
):
    response = await app_client.post("/keywordgroup", json={"group_name": "test"})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


@pytest.mark.asyncio
async def test_get_keywordgroup(app_client: AsyncClient, keyword_group: Keyword_Group):
    keyword_group_json = await app_client.get(f"/keywordgroup/{keyword_group.id}")
    assert keyword_group is not None
    keyword_group_obj = Keyword_Group(**keyword_group_json.json())
    assert keyword_group_obj.group_name_nl == "test"
    assert keyword_group_obj.group_name_en == "engelse_test"


@pytest.mark.asyncio
async def test_delete_keywordgroup(
    app_client: AsyncClient, keyword_group: Keyword_Group
):
    response = await app_client.get(f"/keywordgroup/{keyword_group.id}")
    assert response.status_code == 200
    assert Keyword_Group(**response.json()).group_name_nl == "test"

    response = await app_client.delete(f"/keywordgroup/{keyword_group.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Keyword group deleted"}
    keyword_group_json = await app_client.get(f"/keywordgroup/{keyword_group.id}")
    assert keyword_group_json.status_code == 404
