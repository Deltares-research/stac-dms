import pytest
from dmsapi.database.models import Keyword, Keyword_Group  # type: ignore
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from httpx import AsyncClient


# test add keyword
@pytest.mark.asyncio
async def test_add_keyword(
    keyword_editor_client: AsyncClient,
    keyword_client: KeywordClient,
    keyword_group: Keyword_Group,
):
    response = await keyword_editor_client.post(
        "/keyword",
        json={
            "group_id": str(keyword_group.id),
            "nl_keyword": "testwoord",
            "en_keyword": "english_testword",
        },
    )
    assert response.status_code == 200
    assert response.json()["nl_keyword"] == "testwoord"
    assert response.json()["en_keyword"] == "english_testword"
    assert response.json()["id"] is not None
    assert keyword_client.get_keyword(response.json()["id"]) is not None


# test add keyword invalid
@pytest.mark.asyncio
async def test_add_keyword_invalid(
    keyword_editor_client: AsyncClient,
    keyword_group: Keyword_Group,
):
    response = await keyword_editor_client.post(
        "/keyword",
        json={
            "group_id": str(keyword_group.id),
            "nl_keyword": "",
            "en_keyword": "english_testword",
        },
    )
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test update keyword
@pytest.mark.asyncio
async def test_update_keyword(
    keyword_editor_client: AsyncClient,
    keyword_client: KeywordClient,
    keyword: Keyword,
):
    response = await keyword_editor_client.put(
        f"/keyword/{keyword.id}",
        json={
            "nl_keyword": "testwoord_updated",
            "en_keyword": "english_testword_updated",
        },
    )
    assert response.status_code == 200
    assert response.json()["nl_keyword"] == "testwoord_updated"
    assert response.json()["en_keyword"] == "english_testword_updated"
    assert response.json()["id"] == str(keyword.id)
    assert keyword_client.get_keyword(str(keyword.id)).nl_keyword == "testwoord_updated"


# test delete keyword
@pytest.mark.asyncio
async def test_delete_keyword(
    keyword_editor_client: AsyncClient,
    keyword_client: KeywordClient,
    keyword: Keyword,
):
    response = await keyword_editor_client.delete(f"/keyword/{keyword.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Keyword deleted"}
    keyword_json = await keyword_editor_client.get(f"/keyword/{keyword.id}")
    assert keyword_json.status_code == 404
