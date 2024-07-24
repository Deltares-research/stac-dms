import uuid
from sqlmodel import SQLModel, Field, Relationship
from fastapi import Path


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
    keywords: list["Keyword"] = Relationship(back_populates="group")
    facilities: list["Facility"] = Relationship(
        back_populates="keyword_groups", link_model=FacilityKeywordGroupLink
    )


class Keyword_GroupCreate(Keyword_GroupBase):
    pass


class Keyword_GroupPublic(Keyword_GroupBase):
    id: uuid.UUID
    keywords: list["Keyword"] = Relationship(back_populates="group")


class KeywordBase(SQLModel):
    nl_keyword: str | None
    en_keyword: str | None
    external_id: str | None
    group_id: uuid.UUID = Field(foreign_key="keyword_group.id")


class Keyword(KeywordBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    group: "Keyword_Group" = Relationship(back_populates="keywords")


class KeywordURI:
    keyword_id: uuid.UUID = Path(..., description="Keyword ID")


class Facility(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    name: str
    keyword_groups: list["Keyword_Group"] = Relationship(
        back_populates="facilities", link_model=FacilityKeywordGroupLink
    )


class ErrorResponse(SQLModel):
    code: str
    description: str
