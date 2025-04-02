from typing import List, Literal
from uuid import UUID

from dmsapi.database.models import Role
from pydantic import BaseModel


class GroupUserRequest(BaseModel):
    user_ids: List[str]
    group_id: str


class PermissionRequest(BaseModel):
    group_id: str
    object: str
    role_name: str


class PermissionCheckRequest(BaseModel):
    email: str
    object: str
    role_name: str


class GroupCollectionRoleRequest(BaseModel):
    group_id: UUID
    role: Literal[Role.COLLECTION_DATA_STEWARD, Role.DATA_PRODUCER]


class GroupGlobalRoleRequest(BaseModel):
    group_id: UUID
    role: Literal[
        Role.ADMIN,
        Role.KEYWORD_EDITOR,
        Role.APPLICATION_DATA_STEWARD,
    ]
