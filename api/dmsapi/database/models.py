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
    keywords: list["Keyword"] = Relationship(
        back_populates="group", cascade_delete=True
    )
    facilities: list["Facility"] = Relationship(
        back_populates="keyword_groups", link_model=FacilityKeywordGroupLink
    )


class Keyword_GroupCreate(Keyword_GroupBase):
    pass


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


class ErrorResponse(SQLModel):
    code: str
    description: str


class OKResponse(SQLModel):
    message: str
