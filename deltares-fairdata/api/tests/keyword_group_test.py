import pytest
from dmsapi.database.models import Keyword_Group  # type: ignore
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_keywordgroup(
    keyword_editor_client: AsyncClient, keyword_client: KeywordClient
):
    response = await keyword_editor_client.post(
        "/keywordgroup", json={"group_name_nl": "test", "group_name_en": "engelse_test"}
    )
    assert response.status_code == 200
    assert response.json()["group_name_nl"] == "test"
    assert response.json()["id"] is not None
    assert keyword_client.get_keyword_group(response.json()["id"]) is not None


@pytest.mark.asyncio
async def test_create_keywordgroup_invalid(
    keyword_editor_client: AsyncClient, keyword_client: KeywordClient
):
    response = await keyword_editor_client.post(
        "/keywordgroup", json={"group_name": "test"}
    )
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


@pytest.mark.asyncio
async def test_update_keywordgroup(
    keyword_editor_client: AsyncClient, keyword_group: Keyword_Group
):
    keyword_group_json = await keyword_editor_client.get(
        f"/keywordgroup/{keyword_group.id}"
    )
    assert keyword_group is not None
    keyword_group_obj = Keyword_Group(**keyword_group_json.json())
    assert keyword_group_obj.group_name_nl == "test"
    assert keyword_group_obj.group_name_en == "engelse_test"

    response = await keyword_editor_client.put(
        f"/keywordgroup/{keyword_group.id}",
        json={"group_name_nl": "updated_test", "group_name_en": "updated_engelse_test"},
    )
    assert response.status_code == 200
    assert response.json()["group_name_nl"] == "updated_test"
    assert response.json()["group_name_en"] == "updated_engelse_test"


@pytest.mark.asyncio
async def test_get_keywordgroup(
    keyword_editor_client: AsyncClient, keyword_group: Keyword_Group
):
    keyword_group_json = await keyword_editor_client.get(
        f"/keywordgroup/{keyword_group.id}"
    )
    assert keyword_group is not None
    keyword_group_obj = Keyword_Group(**keyword_group_json.json())
    assert keyword_group_obj.group_name_nl == "test"
    assert keyword_group_obj.group_name_en == "engelse_test"


# test get all keyword groups
@pytest.mark.asyncio
async def test_get_keywordgroups(
    keyword_editor_client: AsyncClient, keyword_group: Keyword_Group
):
    response = await keyword_editor_client.get("/keywordgroups")
    assert response.status_code == 200
    assert len(response.json()) > 0
    keyword_group_obj = Keyword_Group(**response.json()[0])
    assert keyword_group_obj.group_name_nl == keyword_group.group_name_nl


@pytest.mark.asyncio
async def test_delete_keywordgroup(
    keyword_editor_client: AsyncClient, keyword_group: Keyword_Group
):
    response = await keyword_editor_client.get(f"/keywordgroup/{keyword_group.id}")
    assert response.status_code == 200
    assert Keyword_Group(**response.json()).group_name_nl == "test"

    response = await keyword_editor_client.delete(f"/keywordgroup/{keyword_group.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Keyword group deleted"}
    keyword_group_json = await keyword_editor_client.get(
        f"/keywordgroup/{keyword_group.id}"
    )
    assert keyword_group_json.status_code == 404
