import pytest
from dmsapi.database.models import (  # type: ignore
    Group,
    GroupCollectionRoleResponse,
    GroupGlobalRoleResponse,
    Permission,
    Role,
    User,
    role_permissions,
)
from dmsapi.extensions.rbac.rbac_client import RBACClient
from httpx import AsyncClient
from sqlmodel import Session


# test create group
@pytest.mark.asyncio
async def test_create_group(admin_client: AsyncClient, rbac_client: RBACClient):
    name = "test_group"
    description = "Test group"
    response = await admin_client.post(
        "/groups", json={"name": name, "description": description}
    )
    assert response.status_code == 200
    assert response.json()["name"] == name
    assert response.json()["description"] == description
    assert response.json()["id"] is not None


# test create group invalid
@pytest.mark.asyncio
async def test_create_group_invalid(admin_client: AsyncClient):
    response = await admin_client.post("/groups", json={"name": "", "description": ""})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get group
@pytest.mark.asyncio
async def test_update_group(admin_client: AsyncClient, group: Group):
    response = await admin_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    update_response = await admin_client.put(
        f"/groups/{group.id}",
        json={"name": "updated_group", "description": "updated_description"},
    )
    assert update_response.status_code == 200
    updated_obj = Group(**update_response.json())
    assert updated_obj.name == "updated_group"
    assert updated_obj.description == "updated_description"


# test get group
@pytest.mark.asyncio
async def test_get_group(admin_client: AsyncClient, group: Group):
    response = await admin_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    assert group_obj.description == "test_description"


# test get all groups
@pytest.mark.asyncio
async def test_get_groups(admin_client: AsyncClient, group: Group):
    response = await admin_client.get("/groups")
    assert response.status_code == 200
    assert len(response.json()) > 0
    group_names = [group["name"] for group in response.json()]
    assert "test_group" in group_names
    assert "admin_group" in group_names


# test delete group
@pytest.mark.asyncio
async def test_delete_group(
    admin_client: AsyncClient, rbac_client: RBACClient, db_session: Session
):
    name = "test_group_to_delete"
    description = "test_description"
    group = rbac_client.create_group(
        {"name": name, "description": description}, db_session
    )

    # check if group is created
    response = await admin_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    # delete group
    response = await admin_client.delete(f"/groups/{group.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Group deleted"}
    group_json = await admin_client.get(f"/groups/{group.id}")
    assert group_json.status_code == 404


# test add members to group
@pytest.mark.asyncio
async def test_add_members_to_group(
    admin_client: AsyncClient, group: Group, user: User
):
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Members added"}

    # Verify member was added
    response = await admin_client.get(f"/groups/{group.id}/members")
    assert response.status_code == 200
    members = response.json()
    assert len(members) == 1
    assert members[0]["email"] == user.email


# test remove members from group
@pytest.mark.asyncio
async def test_remove_members_from_group(
    admin_client: AsyncClient, group: Group, user: User
):
    # First add the member
    await admin_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )

    # Then remove
    response = await admin_client.delete(
        f"/groups/{group.id}/members",
        params={"user_email": user.email},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User removed from group"}

    # Verify member was removed
    response = await admin_client.get(f"/groups/{group.id}/members")
    assert response.status_code == 200
    members = response.json()
    assert len(members) == 0


# test assign group role to collection
@pytest.mark.asyncio
async def test_assign_group_role(admin_client: AsyncClient, group: Group):
    obj = "test-collection"
    role = Role.DATA_PRODUCER
    response = await admin_client.post(
        f"/group-role/{obj}",
        json={"object": obj, "role": role.value, "group_id": str(group.id)},
    )
    assert response.status_code == 200
    result = GroupCollectionRoleResponse(**response.json())
    assert result.group_id == group.id
    assert result.object == obj
    assert result.role == role


# test assign global group role
@pytest.mark.asyncio
async def test_assign_global_group_role(admin_client: AsyncClient, group: Group):
    response = await admin_client.post(
        "/group-role",
        json={
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    result = GroupGlobalRoleResponse(**response.json())
    assert result.group_id == group.id
    assert result.role == Role.ADMIN


# test get group roles for object
@pytest.mark.asyncio
async def test_get_group_roles(
    admin_client: AsyncClient, authenticated_client: AsyncClient, group_with_user: Group
):
    obj = "test-collection"
    # First assign a role
    response = await admin_client.post(
        f"/group-role/{obj}",
        json={
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group_with_user.id),
        },
    )
    assert response.status_code == 200
    # Then get permissions
    response = await authenticated_client.get(f"/group-role/{obj}")
    assert response.status_code == 200
    permissions = response.json()
    assert len(permissions) > 0
    assert Permission.ItemCreate.value in permissions


# Authorization Tests


# test unauthorized access to protected routes
@pytest.mark.asyncio
async def test_unauthorized_access(authenticated_client: AsyncClient):
    # Try to create a group without authorization
    response = await authenticated_client.post(
        "/groups",
        json={"name": "test_group", "description": "Test group"},
        headers={"Cookie": "DMS_TOKEN=invalid_token"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid authentication credentials"

    # Try to modify group roles without authorization
    response = await authenticated_client.post(
        "/group-role",
        json={
            "object_id": "test-collection",
            "role": Role.DATA_PRODUCER.value,
            "group_id": "some-id",
        },
        headers={"Cookie": "DMS_TOKEN=invalid_token"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid authentication credentials"


# test global admin access
@pytest.mark.asyncio
async def test_global_admin_access(
    admin_client: AsyncClient,
    authenticated_client: AsyncClient,
    group: Group,
    user: User,
):
    # Setup: Give user global admin role
    response = await admin_client.post(
        "/group-role",
        json={
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200

    # Add user to group
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )
    assert response.status_code == 200

    # Test: Admin should be able to perform any action

    # Create group
    response = await authenticated_client.post(
        "/groups",
        json={"name": "admin_test_group", "description": "Test group"},
    )
    assert response.status_code == 200

    # Assign roles
    collection_id = "test-collection"
    response = await authenticated_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200

    # Manage members
    response = await authenticated_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )
    assert response.status_code == 200


# test editor role permissions
@pytest.mark.asyncio
async def test_editor_role_permissions(
    authenticated_client: AsyncClient,
    admin_client: AsyncClient,
    group: Group,
    user: User,
):
    collection_id = "test-collection"

    # Test: user should NOT be able to update the collection
    response = await authenticated_client.put(
        f"/collections/{collection_id}",
        json={
            "id": collection_id,
            "type": "Collection",
            "stac_version": "1.0.0",
            "description": "Updated by editor",
            "license": "MIT",
            "extent": {
                "spatial": {"bbox": [[-180, -90, 180, 90]]},
                "temporal": {"interval": [["2020-01-01T00:00:00Z", None]]},
            },
            "links": [],
        },
    )
    assert response.status_code == 403

    # Setup: Give user editor role for specific collection
    response = await admin_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": Role.COLLECTION_DATA_STEWARD.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )
    assert response.status_code == 200

    # Test: Data steward should be able to update the collection
    response = await authenticated_client.put(
        f"/collections/{collection_id}",
        json={
            "id": collection_id,
            "type": "Collection",
            "stac_version": "1.0.0",
            "description": "Updated by editor",
            "license": "MIT",
            "extent": {
                "spatial": {"bbox": [[-180, -90, 180, 90]]},
                "temporal": {"interval": [["2020-01-01T00:00:00Z", None]]},
            },
            "links": [],
        },
    )
    assert response.status_code == 200

    # Test: Data steward should NOT be able to manage groups
    response = await authenticated_client.post(
        "/groups",
        json={"name": "test_group", "description": "Test group"},
    )
    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == f"User {user.email} does not have permission 'group:create'"
    )


# test global admin permissions endpoint
@pytest.mark.asyncio
async def test_get_global_permissions(
    admin_client: AsyncClient,
):
    # Get global permissions
    response = await admin_client.get("/global-role")
    assert response.status_code == 200
    permissions = response.json()

    # Verify all admin permissions are present
    expected_permissions = role_permissions[Role.ADMIN]
    assert len(permissions) == len(expected_permissions)
    for permission in expected_permissions:
        assert permission in permissions
