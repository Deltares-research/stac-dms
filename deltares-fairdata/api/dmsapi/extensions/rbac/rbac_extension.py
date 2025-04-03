import copy
from dataclasses import dataclass
from typing import Any, Dict, List

from dmsapi.core.dependencies import (
    user_has_collection_permission,
    user_has_global_permission,
)
from dmsapi.database.models import (  # type: ignore
    ErrorResponse,
    Group,
    GroupCollectionRoleResponse,
    GroupGlobalRoleResponse,
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
from starlette.routing import BaseRoute, Match


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
        self.add_delete_user_from_group()
        self.add_assign_group_role()
        self.add_get_my_global_permissions()
        self.add_assign_collection_group_role()
        self.add_get_permissions_on_collection()
        self.add_remove_group_global_role()
        self.add_remove_collection_group_role()
        self.add_get_group_global_roles()
        self.add_get_group_collection_roles()
        app.include_router(self.router, tags=["RBAC Extension"])

        # A list of the collection endpoints and the permissions required to access them
        collection_route_dependencies: Dict[ScopeKey, Permission] = {
            ScopeKey(
                path="/collections/{collection_id}/items/{item_id}",
                method="PUT",
            ): Permission.ItemUpdate,
            ScopeKey(
                path="/collections/{collection_id}/items/{item_id}",
                method="DELETE",
            ): Permission.ItemDelete,
            ScopeKey(
                path="/collections/{collection_id}/items",
                method="POST",
            ): Permission.ItemCreate,
            ScopeKey(
                path="/collections/{collection_id}/bulk_items",
                method="POST",
            ): Permission.ItemCreate,
            ScopeKey(
                path="/collections/{collection_id}",
                method="PUT",
            ): Permission.CollectionUpdate,
            ScopeKey(
                path="/collections/{collection_id}",
                method="DELETE",
            ): Permission.CollectionDelete,
        }

        global_route_dependencies: Dict[ScopeKey, Permission] = {
            ScopeKey(
                path="/facility",
                method="POST",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/facility/{facility_id}",
                method="PUT",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/facility/{facility_id}",
                method="DELETE",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/facility_keywordgroup_link",
                method="POST",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/facility_keywordgroup_link",
                method="DELETE",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keywordgroup",
                method="POST",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keywordgroup/{keywordgroup_id}",
                method="PUT",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keywordgroup/{keywordgroup_id}",
                method="DELETE",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keyword",
                method="POST",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keyword/{keyword_id}",
                method="PUT",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/keyword/{keyword_id}",
                method="DELETE",
            ): Permission.KeywordAll,
            ScopeKey(
                path="/collections",
                method="POST",
            ): Permission.CollectionCreate,
        }

        forbidden_response = {
            403: {
                "content": {
                    MimeTypes.json.value: {
                        "schema": ErrorResponse.model_json_schema(),
                    },
                },
                "model": ErrorResponse,
            }
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
                        add_route_responses(
                            app.router.routes,
                            [endpoint.to_scope()],
                            forbidden_response,
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

                        add_route_responses(
                            app.router.routes,
                            [endpoint.to_scope()],
                            forbidden_response,
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
            methods=["POST"],
        )

    def add_delete_user_from_group(self):
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
                403: {
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

    def add_get_users_from_group(self):
        self.router.add_api_route(
            name="Get users from group",
            path="/groups/{group_id}/members",
            endpoint=self.client.get_users_from_group,
            response_model=list[User],
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": list[User],
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

    def add_assign_group_role(self):
        self.router.add_api_route(
            name="Assign global group role",
            path="/group-role",
            endpoint=self.client.assign_group_global_role,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.GlobalGroupRoleAssign,
                    )
                )
            ],
            response_model=GroupGlobalRoleResponse,
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": GroupGlobalRoleResponse,
                },
                400: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
                403: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": ErrorResponse,
                },
            },
            methods=["POST"],
        )

    def add_get_group_global_roles(self):
        """Add endpoint to get all global roles of a group."""
        self.router.add_api_route(
            name="Get group global roles",
            path="/group-role",
            endpoint=self.client.get_group_global_roles,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.GroupRead,
                    )
                )
            ],
            response_model=list[GroupGlobalRoleResponse],
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": list[GroupGlobalRoleResponse],
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

    def add_remove_group_global_role(self):
        """Add endpoint to remove a global role from a group."""
        self.router.add_api_route(
            name="Remove global group role",
            path="/group-role",
            endpoint=self.client.remove_group_global_role,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.GlobalGroupRoleAssign,
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
                403: {
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

    def add_get_my_global_permissions(self):
        self.router.add_api_route(
            name="Get my global permissions",
            path="/permissions",
            endpoint=self.client.get_my_global_permissions,
            response_model=list[Permission],
            methods=["GET"],
        )

    def add_assign_collection_group_role(self):
        self.router.add_api_route(
            name="Assign collection group role",
            path="/group-role/{collection_id}",
            endpoint=self.client.assign_collection_group_role,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.CollectionGroupRoleAssign,
                    )
                )
            ],
            response_model=GroupCollectionRoleResponse,
            methods=["POST"],
        )

    def add_get_group_collection_roles(self):
        """Add endpoint to get all roles of a group on a collection."""
        self.router.add_api_route(
            name="Get group collection roles",
            path="/group-role/{collection_id}",
            endpoint=self.client.get_group_collection_roles,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.GroupRead,
                    )
                )
            ],
            response_model=list[GroupCollectionRoleResponse],
            responses={
                200: {
                    "content": {
                        MimeTypes.json.value: {},
                    },
                    "model": list[GroupCollectionRoleResponse],
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

    def add_remove_collection_group_role(self):
        """Add endpoint to remove a collection role from a group."""
        self.router.add_api_route(
            name="Remove collection group role",
            path="/group-role/{collection_id}",
            endpoint=self.client.remove_collection_group_role,
            dependencies=[
                Depends(
                    user_has_global_permission(
                        permission=Permission.CollectionGroupRoleAssign,
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
                403: {
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

    def add_get_permissions_on_collection(self):
        self.router.add_api_route(
            name="Get permissions on collection",
            path="/collection-permissions/{collection_id}",
            endpoint=self.client.get_permissions_on_collection,
            response_model=list[Permission],
            methods=["GET"],
        )


def add_route_responses(
    routes: List[BaseRoute], scopes: List[Scope], responses=dict[int, Any]
) -> None:
    """Add dependencies to routes.

    Allows a developer to add dependencies to a route after the route has been
    defined.

    "*" can be used for path or method to match all allowed routes.

    Returns:
        None
    """
    for scope in scopes:
        _scope = copy.deepcopy(scope)
        for route in routes:
            if scope["path"] == "*":
                _scope["path"] = route.path

            if scope["method"] == "*":
                _scope["method"] = list(route.methods)[0]

            match, _ = route.matches({"type": "http", **_scope})
            if match != Match.FULL:
                continue

            # Ignore paths without dependants, e.g. /api, /api.html, /docs/oauth2-redirect
            if not hasattr(route, "dependant"):
                continue

            # Register responses directly on route so that they aren't ignored if
            route.responses.update(responses)
