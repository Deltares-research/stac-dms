from dataclasses import dataclass
from typing import Dict

from dmsapi.core.dependencies import (
    user_has_collection_permission,
    user_has_global_permission,
)
from dmsapi.database.models import (  # type: ignore
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
from fastapi.routing import APIRoute
from stac_fastapi.api.routes import Scope, add_route_dependencies
from stac_fastapi.types.extension import ApiExtension
from stac_pydantic.shared import MimeTypes


@dataclass(frozen=True)
class ScopeKey:
    """A hashable version of Scope for use as dictionary keys."""

    path: str
    method: str

    @classmethod
    def from_scope(cls, scope: Scope) -> "ScopeKey":
        return cls(path=scope["path"], method=scope["method"])

    def to_scope(self) -> Scope:
        return {"path": self.path, "method": self.method}


class RBACExtension(ApiExtension):
    """Extension for managing and retrieving permissions/users

    The keyword extension adds the ability to create, retrieve, update, and delete keywords:

    Manage users:
        GET /users

    Manage groups:
        GET /groups
        POST /groups
        PUT /groups/{group_id}
        DELETE /groups/{group_id}

        POST /groups/{group_id}/members
        DELETE /groups/{group_id}/members
        GET /groups/{group_id}/members

        GET /roles (return fixed list of roles)

    Manage group roles:
        POST /group-role assign role to group
        GET /group-role/{object} get roles for object
        DELETE /group-role/{object} remove role from group

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
        app.include_router(self.router, tags=["RBAC Extension"])

        collection_route_dependencies: Dict[ScopeKey, Permission] = {
            ScopeKey(
                path="/collections/{collection_id}/items/{item_id}",
                method="PUT",
            ): Permission.CollectionUpdate,
            ScopeKey(
                path="/collections/{collection_id}/items/{item_id}",
                method="DELETE",
            ): Permission.CollectionDelete,
            ScopeKey(
                path="/collections/{collection_id}/items",
                method="POST",
            ): Permission.CollectionCreate,
            ScopeKey(
                path="/collections/{collection_id}",
                method="PUT",
            ): Permission.CollectionUpdate,
            ScopeKey(
                path="/collections/{collection_id}",
                method="DELETE",
            ): Permission.CollectionDelete,
            ScopeKey(
                path="/collections",
                method="POST",
            ): Permission.CollectionCreate,
        }

        global_route_dependencies: Dict[ScopeKey, Permission] = {
            ScopeKey(
                path="/keyword",
                method="POST",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keyword",
                method="DELETE",
            ): Permission.KeywordAll,
        }

        for route in app.routes:
            if isinstance(route, APIRoute):
                for method in route.methods:
                    endpoint = ScopeKey(path=route.path, method=method)

                    # Add dependencies for collection routes
                    if endpoint in collection_route_dependencies:
                        add_route_dependencies(
                            app.router.routes,
                            [endpoint.to_scope()],
                            [
                                Depends(
                                    user_has_collection_permission(
                                        permission=collection_route_dependencies[
                                            endpoint
                                        ]
                                    )
                                )
                            ],
                        )

                    # Add dependencies for global routes
                    if endpoint in global_route_dependencies:
                        add_route_dependencies(
                            app.router.routes,
                            [endpoint.to_scope()],
                            [
                                Depends(
                                    user_has_global_permission(
                                        permission=global_route_dependencies[endpoint]
                                    )
                                )
                            ],
                        )

    def add_get_users(self):
        self.router.add_api_route(
            name="Get Users",
            path="/users",
            endpoint=self.client.get_users,
            response_model=list[User],
            methods=["GET"],
        )

    def add_create_group(self):
        self.router.add_api_route(
            name="Create Group",
            path="/groups",
            endpoint=self.client.create_group,
            dependencies=[
                Depends(
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
                    user_has_global_permission(
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
