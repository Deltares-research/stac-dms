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
