from dmsapi.extensions.rbac.rbac_client import RBACClient
from fastapi import APIRouter, FastAPI, Path
from stac_pydantic.shared import MimeTypes
from sqlalchemy.engine import Engine
from stac_fastapi.types.extension import ApiExtension

from dmsapi.database.models import (  # type: ignore
    User,
    Group,
    Role,
    Permission,
    GroupUserLink,
    ErrorResponse,
    OKResponse,
)


class RBACExtension(ApiExtension):
    """Extension for managing and retrieving permissions/users

    The keyword extension adds the ability to create, retrieve, update, and delete keywords:

    Manage users:
        GET /users
        POST /users
        PUT /users/{user_id}
        DELETE /facility/{facility_id}

    Manage groups:
        GET /groups
        POST /groups
        PUT /groups/{group_id}
        DELETE /groups/{group_id}
    
        POST /groups/user {group_id, user_id}
        DELETE /groups/user {group_id, user_id}
    
        GET /groups/{group_id}/users
        
        GET /roles (return fixed list of roles)
    
    Manage permissions:
        POST /permissions/{group_id, object, role} check role is applicable for object
        DELETE /permissions/{group_id, object, role} remove role from group
        GET /permissions?group_id={group_id}

    Args:
        ApiExtension (_type_): _description_
    """

    client: RBACClient
    router: APIRouter

    def __init__(self, db_engine: Engine):
        """Initialize the extension."""
        self.client = RBACClient(db_engine)
        self.router = APIRouter()

    def register(self, app: FastAPI) -> None:
        """Register the extension with a FastAPI application.

        Args:
            app: target FastAPI application.

        Returns:
            None
        """
        self.router.prefix = app.state.router_prefix
        self.add_create_user()
        self.add_update_user()
        self.add_get_user()
        self.add_get_users()
        self.add_delete_user()
        self.add_create_group()
        self.add_update_group()
        self.add_get_group()
        self.add_get_groups()
        self.add_delete_group()
        self.add_get_roles()
        self.add_add_users_to_group()
        self.add_delete_users_from_group()
        self.add_add_group_permission_to_object()
        self.add_delete_group_permission_to_object()
        self.add_check_group_permission_to_object()

    def add_create_user(self):
        self.router.add_api_route(
            name="Create User",
            path="/users",
            endpoint=self.client.create_user,
            response_model=User,
            methods=["POST"],
        )

    def add_update_user(self):
        self.router.add_api_route(
            name="Update User",
            path="/users/{user_id}",
            endpoint=self.client.update_user,
            response_model=User,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": User,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["PUT"],
        )

    def add_get_user(self):
        self.router.add_api_route(
            name="Get User",
            path="/users/{user_id}",
            endpoint=self.client.get_user,
            response_model=User,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": User,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["GET"],
        )
    
    def add_get_users(self):
        self.router.add_api_route(
            name="Get Users",
            path="/users",
            endpoint=self.client.get_users,
            response_model=list[User],
            methods=["GET"]
        )

    def add_delete_user(self):
        self.router.add_api_route(
            name="Delete User",
            path="/users/{user_id}",
            endpoint=self.client.delete_user,
            response_model=OKResponse,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": OKResponse,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["DELETE"]
        )

    def add_create_group(self):
        self.router.add_api_route(
            name="Create Group",
            path="/groups",
            endpoint=self.client.create_group,
            response_model=Group,
            methods=["POST"],
        )

    def add_update_group(self):
        self.router.add_api_route(
            name="Update Group",
            path="/groups/{group_id}",
            endpoint=self.client.update_group,
            response_model=Group,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": Group,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["PUT"],
        )

    def add_get_group(self):
        self.router.add_api_route(
            name="Get Group",
            path="/groups/{group_id}",
            endpoint=self.client.get_group,
            response_model=Group,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": Group,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["GET"],
        )
    
    def add_get_groups(self):
        self.router.add_api_route(
            name="Get Groups",
            path="/groups",
            endpoint=self.client.get_groups,
            response_model=list[Group],
            methods=["GET"]
        )

    def add_delete_group(self):
        self.router.add_api_route(
            name="Delete Group",
            path="/groups/{group_id}",
            endpoint=self.client.delete_group,
            response_model=OKResponse,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": OKResponse,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                404: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["DELETE"]
        )

    def add_get_roles(self):
        self.router.add_api_route(
            name="Get Roles",
            path="/roles",
            endpoint=self.client.get_roles,
            response_model=list[Role],
            methods=["GET"]
        )

    def add_add_users_to_group(self):
        self.router.add_api_route(
            name="Add users to group",
            path="/groups_users_link",
            endpoint=self.client.add_users_to_group,
            response_model=OKResponse,
            methods=["POST"]

        )

    def add_delete_users_from_group(self):
        self.router.add_api_route(
            name="Delete users from group",
            path="/groups_users_unlink",
            endpoint=self.client.remove_users_from_group,
            response_model=OKResponse,
            methods=["DELETE"]
        )

    def add_add_group_permission_to_object(self):
        self.router.add_api_route(
            name="Set group permissions on collection",
            path="/permissions",
            endpoint=self.client.assign_permission_to_collection,
            response_model=OKResponse,
            methods=["POST"]
        )

    def add_delete_group_permission_to_object(self):
        self.router.add_api_route(
            name="Delete group permissions on collection",
            path="/permissions",
            endpoint=self.client.remove_permission_from_collection,
            response_model=OKResponse,
            methods=["DELETE"]
        )

    # Review if next to add or not
    def add_check_group_permission_to_object(self):
        self.router.add_api_route(
            name="Check if group has permission to collection",
            path="/permissions/group/{group_id}/",
            endpoint=self.client.check_permission,
            response_model=Permission,
            methods=["POST"]
        )