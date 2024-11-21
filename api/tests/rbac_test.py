import pytest
from dmsapi.extensions.rbac.rbac_client import RBACClient
from dmsapi.database.models import User, Group, Permission, Role  # type: ignore

from httpx import AsyncClient


# test create user
@pytest.mark.asyncio
async def test_create_user(app_client: AsyncClient, rbac_client: RBACClient):
    username = "test_user"
    email = "test.test@deltares.nl"
    response = await app_client.post(
        "/users", json={"username": username, "email": email}
    )
    assert response.status_code == 200
    assert response.json()["username"] == username
    assert response.json()["email"] == email
    assert response.json()["id"] is not None
    assert rbac_client.get_user(response.json()["id"]) is not None


# test create user invalid
@pytest.mark.asyncio
async def test_create_user_invalid(app_client: AsyncClient):
    response = await app_client.post("/users", json={"username": ""})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get user
@pytest.mark.asyncio
async def test_update_user(app_client: AsyncClient, user: User):
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200
    user_obj = User(**response.json())
    assert user_obj.username == "test_user"
    update_response = await app_client.put(
        f"/users/{user.id}", json={"username": "updated_user"}
    )
    assert update_response.status_code == 200
    updated_obj = User(**update_response.json())
    assert updated_obj.username == "updated_user"


# test get user
@pytest.mark.asyncio
async def test_get_user(app_client: AsyncClient, user: User):
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200
    user_obj = User(**response.json())
    assert user_obj.username == "test_user"


# test get all users
@pytest.mark.asyncio
async def test_get_users(app_client: AsyncClient, user: User):
    response = await app_client.get(f"/users")
    assert response.status_code == 200
    assert len(response.json()) > 0
    user_obj = User(**response.json()[0])
    assert user_obj.username == "test_user"


# test get user by name
@pytest.mark.asyncio
async def test_get_user_by_email(user: User, rbac_client: RBACClient):
    # username = "test_user"
    # email = "test@deltares.nl"
    # user = rbac_client.create_user({"username": username, "email": email})

    user_obj = rbac_client.get_user_by_email(user.email)
    assert user_obj.username == "test_user"


# test delete user
@pytest.mark.asyncio
async def test_delete_user(app_client: AsyncClient, rbac_client: RBACClient):
    username = "test_user_to_delete"
    email = "test@deltares.nl"
    user = rbac_client.create_user({"username": username, "email": email})

    # check if user is created
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200

    # delete user
    response = await app_client.delete(f"/users/{user.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "User deleted"}
    user_json = await app_client.get(f"/users/{user.id}")
    assert user_json.status_code == 404


# test create group
@pytest.mark.asyncio
async def test_create_group(app_client: AsyncClient, rbac_client: RBACClient):
    name = "test_group"
    description = "Test group"
    response = await app_client.post(
        "/groups", json={"name": name, "description": description}
    )
    assert response.status_code == 200
    assert response.json()["name"] == name
    assert response.json()["description"] == description
    assert response.json()["id"] is not None
    assert rbac_client.get_group(response.json()["id"]) is not None


# test create group invalid
@pytest.mark.asyncio
async def test_create_group_invalid(app_client: AsyncClient):
    response = await app_client.post("/groups", json={"name": "", "description": ""})
    assert response.status_code == 400
    assert response.json()["code"] == "RequestValidationError"


# test get group
@pytest.mark.asyncio
async def test_update_group(app_client: AsyncClient, group: Group):
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    update_response = await app_client.put(
        f"/groups/{group.id}",
        json={"name": "updated_group", "description": "updated_description"},
    )
    assert update_response.status_code == 200
    updated_obj = Group(**update_response.json())
    assert updated_obj.name == "updated_group"
    assert updated_obj.description == "updated_description"


# test get group
@pytest.mark.asyncio
async def test_get_group(app_client: AsyncClient, group: Group):
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200
    group_obj = Group(**response.json())
    assert group_obj.name == "test_group"
    assert group_obj.description == "test_description"


# test get all groups
@pytest.mark.asyncio
async def test_get_groups(app_client: AsyncClient, group: Group):
    response = await app_client.get(f"/groups")
    assert response.status_code == 200
    assert len(response.json()) > 0
    group_obj = Group(**response.json()[0])
    assert group_obj.name == "test_group"
    assert group_obj.description == "test_description"


# test delete group
@pytest.mark.asyncio
async def test_delete_group(app_client: AsyncClient, rbac_client: RBACClient):
    name = "test_group_to_delete"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    # delete group
    response = await app_client.delete(f"/groups/{group.id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Group deleted"}
    user_json = await app_client.get(f"/groups/{group.id}")
    assert user_json.status_code == 404


# test get all roles
@pytest.mark.asyncio
async def test_get_roles(app_client: AsyncClient):
    response = await app_client.get("/roles")
    assert response.status_code == 200
    assert len(response.json()) > 0
    # group_obj = Role(**response.json()[0])


# test add users to group
@pytest.mark.asyncio
async def test_add_users_to_group(app_client: AsyncClient, rbac_client: RBACClient):
    # create users
    username = "test_user_to_delete_1"
    email = "test_1@deltares.nl"
    user = rbac_client.create_user({"username": username, "email": email})

    username = "test_user_to_delete_2"
    email = "test_2@deltares.nl"
    user_2 = rbac_client.create_user({"username": username, "email": email})

    # check if users are created
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200

    response = await app_client.get(f"/users/{user_2.id}")
    assert response.status_code == 200

    # create group
    name = "test_group"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    # add users to group
    response = await app_client.post(
        "/groups_users_link",
        json={"user_ids": [str(user.id), str(user_2.id)], "group_id": str(group.id)},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Users added"}


# test add users to group invalid
@pytest.mark.asyncio
async def test_add_users_to_group_invalid(
    app_client: AsyncClient, rbac_client: RBACClient
):
    # create users
    username = "test_user_1"
    email = "test_1@deltares.nl"
    user = rbac_client.create_user({"username": username, "email": email})

    username = "test_user_2"
    email = "test_2@deltares.nl"
    user_2 = rbac_client.create_user({"username": username, "email": email})

    # check if users are created
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200

    response = await app_client.get(f"/users/{user_2.id}")
    assert response.status_code == 200

    # add users to group
    response = await app_client.post(
        "/groups_users_link",
        json={"user_ids": [str(user.id), str(user_2.id)], "group_id": ""},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Users not added"}


# test remove users from group
@pytest.mark.asyncio
async def test_remove_users_from_group(
    app_client: AsyncClient, rbac_client: RBACClient
):
    # create users
    username = "test_user_to_delete_1"
    email = "test_1@deltares.nl"
    user = rbac_client.create_user({"username": username, "email": email})

    username = "test_user_to_delete_2"
    email = "test_2@deltares.nl"
    user_2 = rbac_client.create_user({"username": username, "email": email})

    # check if users are created
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200

    response = await app_client.get(f"/users/{user_2.id}")
    assert response.status_code == 200

    # create group
    name = "test_group"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    # add users to group
    response = await app_client.delete(
        "/groups_users_unlink",
        json={"user_ids": [user.id, user_2.id], "group_id": group.id},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Users deleted from group"}


# test remove users from group invalid
@pytest.mark.asyncio
async def test_remove_users_from_group_invalid(
    app_client: AsyncClient, rbac_client: RBACClient
):
    # create users
    username = "test_user_1"
    email = "test_1@deltares.nl"
    user = rbac_client.create_user({"username": username, "email": email})

    username = "test_user_2"
    email = "test_2@deltares.nl"
    user_2 = rbac_client.create_user({"username": username, "email": email})

    # check if users are created
    response = await app_client.get(f"/users/{user.id}")
    assert response.status_code == 200

    response = await app_client.get(f"/users/{user_2.id}")
    assert response.status_code == 200

    # add users to group
    response = await app_client.delete(
        "/groups_users_unlink", json={"user_ids": [user.id, user_2.id], "group_id": ""}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Users not deleted from group"}


# test assign group permissions to a collection
@pytest.mark.asyncio
async def test_assign_permission_to_collection(
    app_client: AsyncClient, rbac_client: RBACClient
):
    # create group
    name = "test_group"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    obj = "test-collection"
    role_name = "admin"
    response = await app_client.get(
        f"/permissions",
        json={"object": obj, "role_name": role_name, "group_id": group.id},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Group permission added for collection"}


# test assign group permissions to a collection invalid
@pytest.mark.asyncio
async def test_assign_permission_to_collection_invalid(
    app_client: AsyncClient, rbac_client: RBACClient
):
    response = await app_client.get(
        f"/permissions", json={"object": "", "role_name": "", "group_id": ""}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Group permission not added for collection"}


# test remove group permissions to a collection
@pytest.mark.asyncio
async def test_remove_permission_to_collection(
    app_client: AsyncClient, rbac_client: RBACClient
):
    # create group
    name = "test_group"
    description = "test_description"
    group = rbac_client.create_group({"name": name, "description": description})

    # check if group is created
    response = await app_client.get(f"/groups/{group.id}")
    assert response.status_code == 200

    obj = "test-collection"
    role_name = "admin"
    response = await app_client.delete(
        f"/permissions",
        json={"object": obj, "role_name": role_name, "group_id": group.id},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Group permission added for collection"}


# test remove group permissions to a collection invalid
@pytest.mark.asyncio
async def test_remove_permission_to_collection_invalid(
    app_client: AsyncClient, rbac_client: RBACClient
):
    response = await app_client.delete(
        f"/permissions", json={"object": "", "role_name": "", "group_id": ""}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Group permission not removed for collection"}
