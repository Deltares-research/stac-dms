from typing import List
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


class GroupRoleRequest(BaseModel):
    group_id: UUID
    role: Role
    object: str
