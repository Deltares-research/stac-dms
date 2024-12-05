import uuid
from sqlmodel import SQLModel, Field, Relationship
from fastapi import Path
from typing import Optional, List


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
    email: str = Field(min_length=1, max_length=100)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    groups: List["GroupUserLink"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    pass


class UserUpdate(SQLModel):
    username: str | None = Field(min_length=1, max_length=100, default=None)
    email: str | None = Field(min_length=1, max_length=100, default=None)


class UserList(UserBase):
    id: uuid.UUID


class GroupBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=100)


class Group(GroupBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    users: List["GroupUserLink"] = Relationship(back_populates="group")
    permissions: List["Permission"] = Relationship(back_populates="group")


class GroupCreate(GroupBase):
    pass


class GroupList(GroupBase):
    id: uuid.UUID


class GroupUserLink(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    group_id: uuid.UUID = Field(foreign_key="group.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

    group: Optional[Group] = Relationship(back_populates="users")
    user: Optional[User] = Relationship(back_populates="groups")


class Role(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str


class RoleList(SQLModel):
    id: uuid.UUID


class Permission(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    object: str
    role_id: uuid.UUID = Field(foreign_key="role.id")
    group_id: uuid.UUID = Field(foreign_key="group.id")

    role: Role = Relationship()
    group: Group = Relationship(back_populates="permissions")


class PermissionResponse(SQLModel):
    id: uuid.UUID
    object: str
    role_id: uuid.UUID
    role_name: str
    group_id: uuid.UUID
    group_name: str


class ErrorResponse(SQLModel):
    code: str
    description: str


class OKResponse(SQLModel):
    message: str
