import pytest
from dmsapi.database.models import Facility  # type: ignore
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from httpx import AsyncClient


# test create facility
@pytest.mark.asyncio
async def test_create_facility(
    keyword_editor_client: AsyncClient, keyword_client: KeywordClient
):
    facility_name = "test_facility"
    response = await keyword_editor_client.post(
        "/facility", json={"name": facility_name}
    )
    assert response.status_code == 200
    assert response.json()["name"] == facility_name
    assert response.json()["id"] is not None
    assert keyword_client.get_facility(response.json()["id"]) is not None


# test create facility invalid
@pytest.mark.asyncio
async def test_create_facility_invalid(keyword_editor_client: AsyncClient):
    response = await keyword_editor_client.post("/facility", json={"name": ""})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get facility
@pytest.mark.asyncio
async def test_update_facility(keyword_editor_client: AsyncClient, facility: Facility):
    response = await keyword_editor_client.get(f"/facility/{facility.id}")
    assert response.status_code == 200
    facility_obj = Facility(**response.json())
    assert facility_obj.name == "test_facility"
    update_response = await keyword_editor_client.put(
        f"/facility/{facility.id}", json={"name": "updated_facility"}
    )
    assert update_response.status_code == 200
    updated_facility_obj = Facility(**update_response.json())
    assert updated_facility_obj.name == "updated_facility"


# test get facility
@pytest.mark.asyncio
async def test_get_facility(keyword_editor_client: AsyncClient, facility: Facility):
    response = await keyword_editor_client.get(f"/facility/{facility.id}")
    assert response.status_code == 200
    facility_obj = Facility(**response.json())
    assert facility_obj.name == "test_facility"


# test get all facilities
@pytest.mark.asyncio
async def test_get_facilities(keyword_editor_client: AsyncClient, facility: Facility):
    response = await keyword_editor_client.get("/facilities")
    assert response.status_code == 200
    assert len(response.json()) > 0
    facility_obj = Facility(**response.json()[0])
    assert facility_obj.name == "test_facility"


# test delete facility
@pytest.mark.asyncio
async def test_delete_facility(
    keyword_editor_client: AsyncClient, keyword_client: KeywordClient
):
    facility_name = "test_facility_to_delete"
    facility = keyword_client.create_facility({"name": facility_name})

    # check if facility is created
    response = await keyword_editor_client.get(f"/facility/{facility.id}")
    assert response.status_code == 200

    # delete facility
    response = await keyword_editor_client.delete(f"/facility/{facility.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Facility deleted"}
    facility_json = await keyword_editor_client.get(f"/facility/{facility.id}")
    assert facility_json.status_code == 404
