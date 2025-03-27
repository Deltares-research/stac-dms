import pytest
from dmsapi.database.models import (  # type: ignore
    GLOBAL_SCOPE,
    Group,
    GroupRoleResponse,
    Permission,
    Role,
    User,
)
from dmsapi.extensions.rbac.rbac_client import RBACClient
from httpx import AsyncClient


# test create group
@pytest.mark.asyncio
async def test_create_group(authenticated_client: AsyncClient, rbac_client: RBACClient):
    name = "test_group"
    description = "Test group"
    response = await authenticated_client.post(
        "/groups", json={"name": name, "description": description}
    )
    assert response.status_code == 200
    assert response.json()["name"] == name
    assert response.json()["description"] == description
    assert response.json()["id"] is not None


# test create group invalid
@pytest.mark.asyncio
async def test_create_group_invalid(authenticated_client: AsyncClient):
    response = await authenticated_client.post(
        "/groups", json={"name": "", "description": ""}
    )
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get group
@pytest.mark.asyncio
async def test_update_group(authenticated_client: AsyncClient, group: Group):
    response = await authenticated_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    update_response = await authenticated_client.put(
        f"/groups/{group.id}",
        json={"name": "updated_group", "description": "updated_description"},
    )
    assert update_response.status_code == 200
    updated_obj = Group(**update_response.json())
    assert updated_obj.name == "updated_group"
    assert updated_obj.description == "updated_description"


# test get group
@pytest.mark.asyncio
async def test_get_group(authenticated_client: AsyncClient, group: Group):
    response = await authenticated_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    assert group_obj.description == "test_description"


# test get all groups
@pytest.mark.asyncio
async def test_get_groups(authenticated_client: AsyncClient, group: Group):
    response = await authenticated_client.get("/groups")
    assert response.status_code == 200
    assert len(response.json()) > 0
    group_obj = Group(**response.json()[0])
    assert group_obj.name == "test_group"
    assert group_obj.description == "test_description"


# test delete group
@pytest.mark.asyncio
async def test_delete_group(authenticated_client: AsyncClient, rbac_client: RBACClient):
    name = "test_group_to_delete"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await authenticated_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    # delete group
    response = await authenticated_client.delete(f"/groups/{group.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Group deleted"}
    group_json = await authenticated_client.get(f"/groups/{group.id}")
    assert group_json.status_code == 404


# test add members to group
@pytest.mark.asyncio
async def test_add_members_to_group(
    authenticated_client: AsyncClient, group: Group, user: User
):
    response = await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"users": [user.email]},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Members added"}

    # Verify member was added
    response = await authenticated_client.get(f"/groups/{group.id}/members")
    assert response.status_code == 200
    members = response.json()
    assert len(members) == 1
    assert members[0]["email"] == user.email


# test remove members from group
@pytest.mark.asyncio
async def test_remove_members_from_group(
    authenticated_client: AsyncClient, group: Group, user: User
):
    # First add the member
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"users": [user.email]},
    )

    # Then remove
    response = await authenticated_client.delete(
        f"/groups/{group.id}/members",
        params={"user_email": user.email},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User removed from group"}

    # Verify member was removed
    response = await authenticated_client.get(f"/groups/{group.id}/members")
    assert response.status_code == 200
    members = response.json()
    assert len(members) == 0


# test assign group role to collection
@pytest.mark.asyncio
async def test_assign_group_role(authenticated_client: AsyncClient, group: Group):
    obj = "test-collection"
    role = Role.DATA_PRODUCER
    response = await authenticated_client.post(
        "/group-role",
        json={"object": obj, "role": role.value, "group_id": str(group.id)},
    )
    assert response.status_code == 200
    result = GroupRoleResponse(**response.json())
    assert result.group_id == group.id
    assert result.object_id == obj
    assert result.role == role


# test assign global group role
@pytest.mark.asyncio
async def test_assign_global_group_role(
    authenticated_client: AsyncClient, group: Group
):
    response = await authenticated_client.post(
        "/group-role",
        json={
            "object_id": GLOBAL_SCOPE,
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Group role assigned"}


# test get group roles for object
@pytest.mark.asyncio
async def test_get_group_roles(authenticated_client: AsyncClient, group: Group):
    obj = "test-collection"
    # First assign a role
    await authenticated_client.post(
        "/group-role",
        json={"object_id": obj, "role": Role.EDITOR.value, "group_id": str(group.id)},
    )

    # Then get roles
    response = await authenticated_client.get(f"/group-role/{obj}")
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) > 0
    assert roles[0]["role"] == Role.EDITOR.value
    assert roles[0]["group_id"] == str(group.id)


# test check permissions
@pytest.mark.asyncio
async def test_check_permissions(
    authenticated_client: AsyncClient, group: Group, user: User
):
    # First assign role and add user to group
    obj = "test-collection"
    await authenticated_client.post(
        "/group-role",
        json={"object_id": obj, "role": Role.EDITOR.value, "group_id": str(group.id)},
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Check permissions
    response = await authenticated_client.get(
        "/group-role/check",
        params={
            "object_id": obj,
            "permission": Permission.UPDATE.value,
            "user_email": user.email,
        },
    )
    assert response.status_code == 200
    assert response.json()["has_permission"] is True


# test check global permissions
@pytest.mark.asyncio
async def test_check_global_permissions(
    authenticated_client: AsyncClient, group: Group, user: User
):
    # First assign global role and add user to group
    await authenticated_client.post(
        "/group-role",
        json={
            "object_id": "__global__",
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Check permissions
    response = await authenticated_client.get(
        "/group-role/check",
        params={
            "object_id": "any-collection",
            "permission": Permission.MANAGE_GROUPS.value,
            "user_email": user.email,
        },
    )
    assert response.status_code == 200
    assert response.json()["has_permission"] is True


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
    assert response.json()["detail"] == "Not authenticated"

    # Try to modify group roles without authorization
    response = await authenticated_client.post(
        "/group-role",
        json={
            "object_id": "test-collection",
            "role": Role.EDITOR.value,
            "group_id": "some-id",
        },
        headers={"Cookie": "DMS_TOKEN=invalid_token"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


# test global admin access
@pytest.mark.asyncio
async def test_global_admin_access(
    authenticated_client: AsyncClient, group: Group, user: User, token: str
):
    # Setup: Give user global admin role
    await authenticated_client.post(
        "/group-role",
        json={
            "object_id": GLOBAL_SCOPE,
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Test: Admin should be able to perform any action

    # Create group
    response = await authenticated_client.post(
        "/groups",
        json={"name": "admin_test_group", "description": "Test group"},
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 200

    # Assign roles
    response = await authenticated_client.post(
        "/group-role",
        json={
            "object_id": "test-collection",
            "role": Role.EDITOR.value,
            "group_id": str(group.id),
        },
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 200

    # Manage members
    response = await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 200


# test editor role permissions
@pytest.mark.asyncio
async def test_editor_role_permissions(
    authenticated_client: AsyncClient, group: Group, user: User, token: str
):
    # Setup: Give user editor role for specific collection
    collection_id = "test-collection"
    await authenticated_client.post(
        "/group-role",
        json={
            "object_id": collection_id,
            "role": Role.EDITOR.value,
            "group_id": str(group.id),
        },
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Test: Editor should be able to update the collection
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
        },
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 200

    # Test: Editor should NOT be able to manage groups
    response = await authenticated_client.post(
        "/groups",
        json={"name": "test_group", "description": "Test group"},
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"


# test viewer role permissions
@pytest.mark.asyncio
async def test_viewer_role_permissions(
    authenticated_client: AsyncClient, group: Group, user: User, token: str
):
    # Setup: Give user viewer role for specific collection
    collection_id = "test-collection"
    await authenticated_client.post(
        "/group-role",
        json={
            "object_id": collection_id,
            "role": Role.VIEWER.value,
            "group_id": str(group.id),
        },
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Test: Viewer should be able to read the collection
    response = await authenticated_client.get(
        f"/collections/{collection_id}", headers={"Cookie": f"DMS_TOKEN={token}"}
    )
    assert response.status_code == 200

    # Test: Viewer should NOT be able to update the collection
    response = await authenticated_client.put(
        f"/collections/{collection_id}",
        json={
            "id": collection_id,
            "type": "Collection",
            "stac_version": "1.0.0",
            "description": "Updated by viewer",
            "license": "MIT",
            "extent": {
                "spatial": {"bbox": [[-180, -90, 180, 90]]},
                "temporal": {"interval": [["2020-01-01T00:00:00Z", None]]},
            },
        },
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"


# test role hierarchy
@pytest.mark.asyncio
async def test_role_hierarchy(
    authenticated_client: AsyncClient, group: Group, user: User, token: str
):
    collection_id = "test-collection"

    # Setup: Give user owner role
    await authenticated_client.post(
        "/group-role",
        json={
            "object_id": collection_id,
            "role": Role.OWNER.value,
            "group_id": str(group.id),
        },
    )
    await authenticated_client.post(
        f"/groups/{group.id}/members",
        json={"user_ids": [str(user.id)]},
    )

    # Test: Owner should have all collection-level permissions

    # Can read
    response = await authenticated_client.get(
        f"/collections/{collection_id}", headers={"Cookie": f"DMS_TOKEN={token}"}
    )
    assert response.status_code == 200

    # Can update
    response = await authenticated_client.put(
        f"/collections/{collection_id}",
        json={
            "id": collection_id,
            "type": "Collection",
            "stac_version": "1.0.0",
            "description": "Updated by owner",
            "license": "MIT",
            "extent": {
                "spatial": {"bbox": [[-180, -90, 180, 90]]},
                "temporal": {"interval": [["2020-01-01T00:00:00Z", None]]},
            },
        },
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 200

    # Can delete
    response = await authenticated_client.delete(
        f"/collections/{collection_id}", headers={"Cookie": f"DMS_TOKEN={token}"}
    )
    assert response.status_code == 200

    # But cannot manage groups (system-level permission)
    response = await authenticated_client.post(
        "/groups",
        json={"name": "test_group", "description": "Test group"},
        headers={"Cookie": f"DMS_TOKEN={token}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"
