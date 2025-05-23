from uuid import UUID, uuid4

import pytest
from dmsapi.database.models import (  # type: ignore
    Facility,
    FacilityKeywordGroupLink,
    Keyword_Group,
)
from dmsapi.extensions.keywords.keyword_client import KeywordClient
from httpx import AsyncClient


# test create link
@pytest.mark.asyncio
async def test_create_link(
    keyword_editor_client: AsyncClient,
    keyword_client: KeywordClient,
    facility: Facility,
    keyword_group: Keyword_Group,
):
    response = await keyword_editor_client.post(
        "/facility_keywordgroup_link",
        json={
            "facility_id": str(facility.id),
            "keyword_group_id": str(keyword_group.id),
        },
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Keyword group linked to facility"}
    facility = keyword_client.get_facility(str(facility.id))
    assert facility.keyword_groups[0].id == keyword_group.id


# test create link invalid
@pytest.mark.asyncio
async def test_create_link_invalid_facility(
    keyword_editor_client: AsyncClient,
    keyword_group: Keyword_Group,
):
    fake_facility_id = uuid4()
    response = await keyword_editor_client.post(
        "/facility_keywordgroup_link",
        json={
            "facility_id": str(fake_facility_id),
            "keyword_group_id": str(keyword_group.id),
        },
    )
    assert response.status_code == 404


# test create link invalid
@pytest.mark.asyncio
async def test_create_link_invalid_keyword_group(
    keyword_editor_client: AsyncClient,
    facility: Facility,
):
    fake_keyword_group_id = uuid4()
    response = await keyword_editor_client.post(
        "/facility_keywordgroup_link",
        json={
            "facility_id": str(facility.id),
            "keyword_group_id": str(fake_keyword_group_id),
        },
    )
    assert response.status_code == 404


# test delete link
@pytest.mark.asyncio
async def test_delete_link(
    keyword_editor_client: AsyncClient,
    keyword_client: KeywordClient,
    facility_keyword_group_link: FacilityKeywordGroupLink,
):
    facility = keyword_client.get_facility(str(facility_keyword_group_link.facility_id))
    assert facility.keyword_groups[0].id == UUID(
        facility_keyword_group_link.keyword_group_id
    )

    response_delete = await keyword_editor_client.request(
        method="DELETE",
        url="/facility_keywordgroup_link",
        json={
            "facility_id": str(facility.id),
            "keyword_group_id": str(facility_keyword_group_link.keyword_group_id),
        },
    )
    assert response_delete.status_code == 200
    assert response_delete.json() == {"message": "Keyword group unlinked from facility"}
    facility = keyword_client.get_facility(str(facility.id))
    assert len(facility.keyword_groups) == 0
