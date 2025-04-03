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
    # First assign a global role
    response = await admin_client.post(
        "/group-role",
        json={
            "role": Role.KEYWORD_EDITOR.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200

    # Get the group and verify roles are included
    response = await admin_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_data = response.json()
    assert group_data["name"] == "test_group"
    assert group_data["description"] == "test_description"
    assert "roles" in group_data
    assert len(group_data["roles"]) == 1
    assert group_data["roles"][0]["role"] == Role.KEYWORD_EDITOR.value
    assert group_data["roles"][0]["group_id"] == str(group.id)


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


# test remove collection group role
@pytest.mark.asyncio
async def test_remove_collection_group_role(
    admin_client: AsyncClient, group_with_user: Group, authenticated_client: AsyncClient
):
    collection_id = "test-collection"
    role = Role.DATA_PRODUCER

    # First assign a role
    response = await admin_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": role.value,
            "group_id": str(group_with_user.id),
        },
    )
    assert response.status_code == 200

    # Get collection roles and verify the role is present
    response = await admin_client.get(
        f"/group-role/{collection_id}",
        params={"group_id": str(group_with_user.id)},
    )
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) == 1
    assert roles[0]["role"] == role.value
    assert roles[0]["group_id"] == str(group_with_user.id)
    assert roles[0]["object"] == collection_id

    # Verify role was added by checking permissions
    response = await authenticated_client.get(
        f"/collection-permissions/{collection_id}"
    )
    assert response.status_code == 200
    permissions = response.json()
    assert Permission.ItemCreate.value in permissions

    # Then remove the role
    response = await admin_client.delete(
        f"/group-role/{collection_id}",
        params={
            "group_id": str(group_with_user.id),
            "role": role.value,
        },
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Role removed from group"}

    # Verify role was removed by checking permissions
    response = await authenticated_client.get(
        f"/collection-permissions/{collection_id}"
    )
    assert response.status_code == 200
    permissions = response.json()
    assert Permission.ItemCreate.value not in permissions


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
    response = await authenticated_client.get(f"/collection-permissions/{obj}")
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
    response = await admin_client.get("/permissions")
    assert response.status_code == 200
    permissions = response.json()

    # Verify all admin permissions are present
    expected_permissions = role_permissions[Role.ADMIN]
    assert len(permissions) == len(expected_permissions)
    for permission in expected_permissions:
        assert permission in permissions


# test remove global group role
@pytest.mark.asyncio
async def test_remove_global_group_role(
    admin_client: AsyncClient,
    authenticated_client: AsyncClient,
    group: Group,
    user: User,
):
    # First add user to group
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[user.email],
    )
    assert response.status_code == 200

    # Assign a global role
    response = await admin_client.post(
        "/group-role",
        json={
            "role": Role.KEYWORD_EDITOR.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    result = GroupGlobalRoleResponse(**response.json())
    assert result.group_id == group.id
    assert result.role == Role.KEYWORD_EDITOR

    # Get global roles and verify the role is present
    response = await admin_client.get(
        f"/groups/{group.id}",
    )
    assert response.status_code == 200
    group_data = response.json()
    assert len(group_data["roles"]) == 1
    assert group_data["roles"][0]["role"] == Role.KEYWORD_EDITOR.value
    assert group_data["roles"][0]["group_id"] == str(group.id)

    # Verify user has keyword permissions through the role
    response = await authenticated_client.get("/permissions")
    assert response.status_code == 200
    permissions = response.json()
    assert Permission.KeywordAll.value in permissions

    # Remove the role
    response = await admin_client.delete(
        "/group-role",
        params={"group_id": str(group.id), "role": Role.KEYWORD_EDITOR.value},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Role removed from group"}

    # Verify role was removed by checking permissions
    response = await authenticated_client.get("/permissions")
    assert response.status_code == 200
    permissions = response.json()
    assert Permission.KeywordAll.value not in permissions

    # Try to remove non-existent role
    response = await admin_client.delete(
        "/group-role",
        params={"group_id": str(group.id), "role": Role.KEYWORD_EDITOR.value},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Role not found on group"}

    # Try to remove role from non-existent group
    response = await admin_client.delete(
        "/group-role",
        params={
            "group_id": "00000000-0000-0000-0000-000000000000",
            "role": Role.KEYWORD_EDITOR.value,
        },
    )
    assert response.status_code == 404
    assert "not found" in response.json()["description"]


# test get group only returns global roles
@pytest.mark.asyncio
async def test_get_group_only_returns_global_roles(
    admin_client: AsyncClient, group_with_user: Group, user: User
):
    # First assign a global role
    response = await admin_client.post(
        "/group-role",
        json={
            "role": Role.KEYWORD_EDITOR.value,
            "group_id": str(group_with_user.id),
        },
    )
    assert response.status_code == 200

    # Then assign a collection-specific role
    collection_id = "test-collection"
    response = await admin_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group_with_user.id),
        },
    )
    assert response.status_code == 200

    # Get the group and verify only global roles are included
    response = await admin_client.get(f"/groups/{group_with_user.id}")
    assert response.status_code == 200
    group_data = response.json()

    # Verify roles are present
    assert "roles" in group_data
    assert len(group_data["roles"]) == 1  # Should only have the global role

    # Verify it's the global role
    role = group_data["roles"][0]
    assert role["role"] == Role.KEYWORD_EDITOR.value
    assert role["group_id"] == str(group_with_user.id)
    assert role["object"] is None

    # verify users are present
    assert "users" in group_data
    assert len(group_data["users"]) == 1
    assert group_data["users"][0]["email"] == user.email


# test get group roles for object without group_id
@pytest.mark.asyncio
async def test_get_collection_roles_without_group_id(
    admin_client: AsyncClient,
    group: Group,
    rbac_client: RBACClient,
    db_session: Session,
):
    collection_id = "test-collection"

    # Create a second group
    second_group = rbac_client.create_group(
        {"name": "second_group", "description": "Second test group"}, db_session
    )

    # Assign different roles to both groups
    await admin_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group.id),
        },
    )
    await admin_client.post(
        f"/group-role/{collection_id}",
        json={
            "role": Role.COLLECTION_DATA_STEWARD.value,
            "group_id": str(second_group.id),
        },
    )

    # Get roles without specifying group_id
    response = await admin_client.get(f"/group-role/{collection_id}")
    assert response.status_code == 200
    roles = response.json()

    # Verify all roles from both groups are returned
    assert len(roles) == 2
    role_data = {(role["group_id"], role["role"]) for role in roles}
    assert (str(group.id), Role.DATA_PRODUCER.value) in role_data
    assert (str(second_group.id), Role.COLLECTION_DATA_STEWARD.value) in role_data


# test get collection permissions
@pytest.mark.asyncio
async def test_get_collection_permissions(
    authenticated_client: AsyncClient,
    admin_client: AsyncClient,
    group_with_user: Group,
):
    # Create test data - assign roles to the group on different collections
    collection1_id = "test-collection-1"
    collection2_id = "test-collection-2"

    # Assign DATA_PRODUCER role on collection1
    await admin_client.post(
        f"/group-role/{collection1_id}",
        json={
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group_with_user.id),
        },
    )

    # Assign COLLECTION_DATA_STEWARD role on collection2
    await admin_client.post(
        f"/group-role/{collection2_id}",
        json={
            "role": Role.COLLECTION_DATA_STEWARD.value,
            "group_id": str(group_with_user.id),
        },
    )

    # Get all collection permissions for the authenticated user
    response = await authenticated_client.get("/collection-permissions")
    assert response.status_code == 200
    permissions = response.json()

    # Verify we got permissions for both collections
    assert len(permissions) == 2

    # Convert response to a dict for easier testing
    permissions_by_collection = {
        perm["collection_id"]: set(perm["permissions"]) for perm in permissions
    }

    # Verify permissions for collection1
    assert collection1_id in permissions_by_collection
    assert (
        set(role_permissions[Role.DATA_PRODUCER])
        == permissions_by_collection[collection1_id]
    )

    # Verify permissions for collection2
    assert collection2_id in permissions_by_collection
    assert (
        set(role_permissions[Role.COLLECTION_DATA_STEWARD])
        == permissions_by_collection[collection2_id]
    )
