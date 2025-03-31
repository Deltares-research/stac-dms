from dmsapi.core.dependencies import user_has_permission_on_object
from dmsapi.database.models import (  # type: ignore
    GLOBAL_SCOPE,
    ErrorResponse,
    Group,
    GroupRole,
    GroupRoleResponse,
    OKResponse,
    Permission,
    Role,
    User,
)
from dmsapi.extensions.rbac.rbac_client import RBACClient
from fastapi import APIRouter, Depends, FastAPI
from stac_fastapi.types.extension import ApiExtension
from stac_pydantic.shared import MimeTypes


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

    def __init__(self):
        """Initialize the extension."""
        self.client = RBACClient()
        self.router = APIRouter()

    def register(self, app: FastAPI) -> None:
        """Register the extension with a FastAPI application.

        Args:
            app: target FastAPI application.

        Returns:
            None
        """
        self.router.prefix = app.state.router_prefix
        self.add_get_users()
        self.add_create_group()
        self.add_update_group()
        self.add_get_group()
        self.add_get_groups()
        self.add_delete_group()
        self.add_get_roles()
        self.add_add_users_to_group()
        self.add_get_users_from_group()
        self.add_delete_users_from_group()
        self.add_assign_group_role()
        self.add_get_group_roles()
        # self.add_add_group_permission_to_object()
        # self.add_delete_group_permission_to_object()
        # self.add_check_group_permission_to_object()
        app.include_router(self.router, tags=["RBAC Extension"])

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
            methods=["GET"],
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
            methods=["DELETE"],
        )

    def add_create_group(self):
        self.router.add_api_route(
            name="Create Group",
            path="/groups",
            endpoint=self.client.create_group,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GroupCreate,
                    )
                )
            ],
            response_model=Group,
            methods=["POST"],
        )

    def add_update_group(self):
        self.router.add_api_route(
            name="Update Group",
            path="/groups/{group_id}",
            endpoint=self.client.update_group,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GroupUpdate,
                    )
                )
            ],
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
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GroupRead,
                    )
                )
            ],
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
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GroupRead,
                    )
                )
            ],
            response_model=list[Group],
            methods=["GET"],
        )

    def add_delete_group(self):
        self.router.add_api_route(
            name="Delete Group",
            path="/groups/{group_id}",
            endpoint=self.client.delete_group,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GroupDelete,
                    )
                )
            ],
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
            methods=["DELETE"],
        )

    def add_get_roles(self):
        self.router.add_api_route(
            name="Get Roles",
            path="/roles",
            endpoint=self.client.get_roles,
            response_model=list[Role],
            methods=["GET"],
        )

    def add_add_users_to_group(self):
        self.router.add_api_route(
            name="Add users to group",
            path="/groups/{group_id}/members",
            endpoint=self.client.add_users_to_group,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GlobalGroupRoleAssign,
                    )
                )
            ],
            response_model=OKResponse,
            methods=["POST"],
        )

    def add_delete_users_from_group(self):
        self.router.add_api_route(
            name="Delete users from group",
            path="/groups/{group_id}/members",
            endpoint=self.client.remove_user_from_group,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GlobalGroupRoleAssign,
                    )
                )
            ],
            response_model=OKResponse,
            methods=["DELETE"],
        )

    def add_get_users_from_group(self):
        self.router.add_api_route(
            name="Get users from group",
            path="/groups/{group_id}/members",
            endpoint=self.client.get_users_from_group,
            response_model=list[User],
            methods=["GET"],
        )

    def add_assign_group_role(self):
        self.router.add_api_route(
            name="Assign group role",
            path="/group-role",
            endpoint=self.client.assign_group_role,
            dependencies=[
                Depends(
                    user_has_permission_on_object(
                        object=GLOBAL_SCOPE,
                        permission=Permission.GlobalGroupRoleAssign,
                    )
                )
            ],
            response_model=GroupRoleResponse,
            methods=["POST"],
        )

    def add_get_group_roles(self):
        self.router.add_api_route(
            name="Get group roles",
            path="/group-role/{object_id}",
            endpoint=self.client.get_group_roles,
            response_model=list[GroupRole],
            methods=["GET"],
        )

    # def add_add_group_permission_to_object(self):
    #     self.router.add_api_route(
    #         name="Set group permissions on collection",
    #         path="/permissions",
    #         endpoint=self.client.assign_permission_to_collection,
    #         response_model=OKResponse,
    #         methods=["POST"],
    #     )

    # def add_delete_group_permission_to_object(self):
    #     self.router.add_api_route(
    #         name="Delete group permissions on collection",
    #         path="/permissions",
    #         endpoint=self.client.remove_permission_from_collection,
    #         response_model=OKResponse,
    #         methods=["DELETE"],
    #     )

    # # Review if next to add or not
    # def add_check_group_permission_to_object(self):
    #     self.router.add_api_route(
    #         name="Check if group has permission to collection",
    #         path="/permissions_check",
    #         endpoint=self.client.has_permission,
    #         response_model=bool,
    #         methods=["POST"],
    #     )
