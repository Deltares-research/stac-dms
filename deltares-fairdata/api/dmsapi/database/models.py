import uuid
from enum import Enum
from typing import List, Optional

from fastapi import Path
from pydantic import EmailStr
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlmodel import Field, Relationship, SQLModel


class Role(str, Enum):
    # object roles
    DATA_PRODUCER = "data_producer"
    COLLECTION_DATA_STEWARD = "collection_data_steward"

    # global roles
    ADMIN = "admin"
    KEYWORD_EDITOR = "keyword_editor"
    APPLICATION_DATA_STEWARD = "application_data_steward"


class Permission(str, Enum):
    # collection permissions
    ItemCreate = "item:create"
    ItemUpdate = "item:update"
    ItemDelete = "item:delete"
    CollectionUpdate = "collection:update"
    CollectionDelete = "collection:delete"
    CollectionGroupRoleAssign = "collection:group_role:assign"

    # global permissions
    KeywordAll = "keyword:all"

    CollectionCreate = "collection:create"
    GroupCreate = "group:create"
    GroupRead = "group:read"
    GroupUpdate = "group:update"
    GroupDelete = "group:delete"
    GlobalGroupRoleAssign = "global:group_role:assign"


role_permissions = {
    Role.ADMIN: [
        # Admin has all global permissions
        Permission.KeywordAll,
        Permission.CollectionCreate,
        Permission.GroupCreate,
        Permission.GroupRead,
        Permission.GroupUpdate,
        Permission.GroupDelete,
        Permission.GlobalGroupRoleAssign,
        # And permission to assign roles on collections
        Permission.CollectionGroupRoleAssign,
    ],
    Role.KEYWORD_EDITOR: [
        Permission.KeywordAll,
    ],
    Role.APPLICATION_DATA_STEWARD: [
        Permission.GroupCreate,
        Permission.GroupRead,
        Permission.GroupUpdate,
        Permission.GroupDelete,
        Permission.CollectionGroupRoleAssign,
        Permission.CollectionCreate,
    ],
    Role.COLLECTION_DATA_STEWARD: [
        # Data Steward has all collection permissions
        Permission.ItemCreate,
        Permission.ItemUpdate,
        Permission.ItemDelete,
        Permission.CollectionUpdate,
        Permission.CollectionDelete,
        Permission.CollectionGroupRoleAssign,
        Permission.CollectionCreate,
    ],
    Role.DATA_PRODUCER: [
        Permission.ItemCreate,
        Permission.ItemUpdate,
    ],
}


GLOBAL_SCOPE = "__GLOBAL__"


class FacilityKeywordGroupLink(SQLModel, table=True):
    facility_id: uuid.UUID = Field(foreign_key="facility.id", primary_key=True)
    keyword_group_id: uuid.UUID = Field(
        foreign_key="keyword_group.id", primary_key=True
    )


class Keyword_GroupBase(SQLModel, table=False):
    group_name_nl: str
    group_name_en: str


class Keyword_Group(Keyword_GroupBase, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    keywords: list["Keyword"] = Relationship(
        back_populates="group", cascade_delete=True
    )
    facilities: list["Facility"] = Relationship(
        back_populates="keyword_groups", link_model=FacilityKeywordGroupLink
    )


class Keyword_GroupCreate(Keyword_GroupBase):
    pass


class Keyword_GroupUpdate(SQLModel, table=False):
    group_name_nl: str | None = Field(min_length=1, max_length=100, default=None)
    group_name_en: str | None = Field(min_length=1, max_length=100, default=None)


class Keyword_GroupPublic(Keyword_GroupBase):
    id: uuid.UUID


class Keyword_GroupPublicWithKeywords(Keyword_GroupPublic):
    keywords: list["KeywordPublic"] = []
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "group_name_nl": "Sleutelwoord groep",
                    "group_name_en": "Keyword group",
                    "id": str(uuid.uuid4()),
                    "keywords": [
                        {
                            "nl_keyword": "Sleutelwoord",
                            "en_keyword": "Keyword",
                            "id": str(uuid.uuid4()),
                        }
                    ],
                }
            ]
        }
    }


class KeywordUpdate(SQLModel):
    nl_keyword: str | None = Field(min_length=1, max_length=100, default=None)
    en_keyword: str | None = Field(min_length=1, max_length=100, default=None)
    external_id: str | None = Field(default=None)


class KeywordBase(KeywordUpdate):
    nl_keyword: str = Field(min_length=1, max_length=100)
    en_keyword: str = Field(min_length=1, max_length=100)
    external_id: str | None = Field(default=None)
    group_id: uuid.UUID = Field(foreign_key="keyword_group.id", ondelete="CASCADE")


class Keyword(KeywordBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    group: "Keyword_Group" = Relationship(back_populates="keywords")


class KeywordPublic(KeywordUpdate):
    id: uuid.UUID


class KeywordURI:
    keyword_id: uuid.UUID = Path(..., description="Keyword ID")


class FacilityBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)


class FacilityCreate(FacilityBase):
    pass


class FacilityList(FacilityBase):
    id: uuid.UUID


class Facility(FacilityBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    keyword_groups: list["Keyword_Group"] = Relationship(
        back_populates="facilities", link_model=FacilityKeywordGroupLink
    )


class UserBase(SQLModel):
    username: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(min_length=1, max_length=100)


class User(UserBase, table=True):
    email: EmailStr = Field(primary_key=True)
    groups: List["GroupUserLink"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    pass


class UserUpdate(SQLModel):
    username: str | None = Field(min_length=1, max_length=100, default=None)
    email: EmailStr | None = Field(min_length=1, max_length=100, default=None)


class UserList(UserBase):
    pass


class Users(SQLModel):
    users: List[EmailStr]


class GroupBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=100)


class Group(GroupBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    users: List["GroupUserLink"] = Relationship(back_populates="group")
    group_roles: List["GroupRole"] = Relationship(back_populates="group")


class GroupCreate(GroupBase):
    pass


class GroupList(GroupBase):
    id: uuid.UUID


class GroupUserLink(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    group_id: uuid.UUID = Field(foreign_key="group.id")
    user_email: EmailStr = Field(foreign_key="user.email")

    group: Optional[Group] = Relationship(back_populates="users")
    user: Optional[User] = Relationship(back_populates="groups")


class GroupRole(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    object: Optional[str] = Field(default=None)  # None indicates global role
    role: "Role" = Field(
        sa_type=SQLAlchemyEnum(
            Role,
            name="role_enum",
        )
    )
    group_id: uuid.UUID = Field(foreign_key="group.id")
    group: Group = Relationship(back_populates="group_roles")


class GroupGlobalRoleResponse(SQLModel):
    id: uuid.UUID
    role: "Role"
    group_id: uuid.UUID
    group_name: str


class GroupCollectionRoleResponse(GroupGlobalRoleResponse):
    object: str


class ErrorResponse(SQLModel):
    code: str
    message: str


class OKResponse(SQLModel):
    message: str
