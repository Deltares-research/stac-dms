from pydantic import BaseModel
from typing import Annotated, List

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