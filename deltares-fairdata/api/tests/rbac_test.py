import pytest
from dmsapi.database.models import (  # type: ignore
    GLOBAL_SCOPE,
    Group,
    GroupRoleResponse,
    Role,
    User,
    UserUpdate,
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
        json=[UserUpdate(email=user.email).model_dump()],
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
        json=[UserUpdate(email=user.email).model_dump()],
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
async def test_assign_global_group_role(admin_client: AsyncClient, group: Group):
    response = await admin_client.post(
        "/group-role",
        json={
            "object": GLOBAL_SCOPE,
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    result = GroupRoleResponse(**response.json())
    assert result.group_id == group.id
    assert result.object_id == GLOBAL_SCOPE
    assert result.role == Role.ADMIN


# test get group roles for object
@pytest.mark.asyncio
async def test_get_group_roles(admin_client: AsyncClient, group: Group):
    obj = "test-collection"
    # First assign a role
    response = await admin_client.post(
        "/group-role",
        json={
            "object": obj,
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    # Then get roles
    response = await admin_client.get(f"/group-role/{obj}")
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) > 0
    assert roles[0]["role"] == Role.DATA_PRODUCER.value
    assert roles[0]["group_id"] == str(group.id)


# # test check global permissions
# @pytest.mark.asyncio
# async def test_check_global_permissions(
#     admin_client: AsyncClient, group: Group, user: User
# ):
#     # First assign global role and add user to group
#     await admin_client.post(
#         "/group-role",
#         json={
#             "object": GLOBAL_SCOPE,
#             "role": Role.ADMIN.value,
#             "group_id": str(group.id),
#         },
#     )
#     await admin_client.post(
#         f"/groups/{group.id}/members",
#         json=[{"email": user.email}],
#     )

#     # Check permissions
#     response = await admin_client.get(
#         "/group-role/{GLOBAL_SCOPE}",
#         params={
#             "object_id": "any-collection",
#             "permission": Permission.GroupDelete.value,
#             "user_email": user.email,
#         },
#     )
#     assert response.status_code == 200
#     assert response.json()["has_permission"] is True


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
            "object": GLOBAL_SCOPE,
            "role": Role.ADMIN.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200

    # Add user to group
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[UserUpdate(email=user.email).model_dump()],
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
    response = await authenticated_client.post(
        "/group-role",
        json={
            "object": "test-collection",
            "role": Role.DATA_PRODUCER.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200

    # Manage members
    response = await authenticated_client.post(
        f"/groups/{group.id}/members",
        json=[UserUpdate(email=user.email).model_dump()],
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
        "/group-role",
        json={
            "object": collection_id,
            "role": Role.DATA_STEWARD.value,
            "group_id": str(group.id),
        },
    )
    assert response.status_code == 200
    response = await admin_client.post(
        f"/groups/{group.id}/members",
        json=[{"email": user.email}],
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
        == f"User {user.email} does not have permission Permission.GroupCreate"
    )
