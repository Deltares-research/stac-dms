import pytest
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from dmsapi.database.models import Facility  # type: ignore
from httpx import AsyncClient


# test create facility
@pytest.mark.asyncio
async def test_create_facility(app_client: AsyncClient, keyword_client: KeywordClient):
    facility_name = "test_facility"
    response = await app_client.post("/facility", json={"name": facility_name})
    print(response.json())
    assert response.status_code == 200
    assert response.json()["name"] == facility_name
    assert response.json()["id"] is not None
    assert keyword_client.get_facility(response.json()["id"]) is not None


# test create facility invalid
@pytest.mark.asyncio
async def test_create_facility_invalid(app_client: AsyncClient):
    response = await app_client.post("/facility", json={"name": ""})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get facility
@pytest.mark.asyncio
async def test_get_facility(app_client: AsyncClient, facility: Facility):
    response = await app_client.get(f"/facility/{facility.id}")
    assert response.status_code == 200
    facility_obj = Facility(**response.json())
    assert facility_obj.name == "test_facility"


# test get all facilities
@pytest.mark.asyncio
async def test_get_facilities(app_client: AsyncClient, facility: Facility):
    response = await app_client.get(f"/facilities")
    assert response.status_code == 200
    assert len(response.json()) > 0
    facility_obj = Facility(**response.json()[0])
    assert facility_obj.name == "test_facility"


# test delete facility
@pytest.mark.asyncio
async def test_delete_facility(app_client: AsyncClient, keyword_client: KeywordClient):
    facility_name = "test_facility_to_delete"
    facility = keyword_client.create_facility({"name": facility_name})

    # check if facility is created
    response = await app_client.get(f"/facility/{facility.id}")
    assert response.status_code == 200

    # delete facility
    response = await app_client.delete(f"/facility/{facility.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Facility deleted"}
    facility_json = await app_client.get(f"/facility/{facility.id}")
    assert facility_json.status_code == 404
