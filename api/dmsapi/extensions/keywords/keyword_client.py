from typing import Annotated, List
from uuid import UUID
from fastapi import Path
from stac_fastapi.types.errors import NotFoundError, InvalidQueryParameter
from sqlalchemy.engine import Engine
from sqlmodel import Session, select

from dmsapi.database.models import (  # type: ignore
    Facility,
    FacilityBase,
    FacilityCreate,
    FacilityList,
    Keyword,
    Keyword_Group,
    Keyword_GroupCreate,
    KeywordBase,
    OKResponse,
)


class KeywordClient:
    """Client for managing and retrieving keywords."""

    db_engine: Engine

    def __init__(self, db_engine: Engine):
        """Initialize the client."""
        self.db_engine = db_engine

    def create_facility(self, facility: FacilityCreate) -> Facility:
        """Create a new facility.

        Args:
            facility: facility to create.

        Returns:
            created facility.
        """
        with Session(self.db_engine) as session:
            db_facility = Facility.model_validate(facility)
            session.add(db_facility)
            session.commit()
            session.refresh(db_facility)
            return db_facility

    def get_facility(
        self, facility_id: Annotated[str, Path(title="The ID of the facility to get")]
    ) -> Facility:
        """Retrieve a facility by ID.

        Args:
            facility_id: ID of the facility to retrieve.

        Returns:
            retrieved facility.
        """
        try:
            uuid = UUID(facility_id)
        except ValueError:
            raise InvalidQueryParameter(f"Facility ID {facility_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(Facility, uuid)
            if result is None:
                raise NotFoundError(f"Facility with ID {facility_id} not found")
            return result

    def get_facilities(self) -> List[FacilityList]:
        """Retrieve all facilities.

        Returns:
            list of all facilities.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(Facility))
            return list(results.all())

    # def update_facility(self, facility_id: Annotated[str, Path(title="The ID of the facility to update")], facility: FacilityUpdate) -> Facility:
    def delete_facility(
        self,
        facility_id: Annotated[str, Path(title="The ID of the facility to delete")],
    ) -> OKResponse:
        """Delete a facility by ID.

        Args:
            facility_id: ID of the facility to delete.

        Returns:
            OKResponse
        """
        try:
            uuid = UUID(facility_id)
        except ValueError:
            raise InvalidQueryParameter(f"Facility ID {facility_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(Facility, uuid)
            if result is None:
                raise NotFoundError(f"Facility with ID {facility_id} not found")
            session.delete(result)
            session.commit()
            return OKResponse(message="Facility deleted")

    def create_keywordgroup(self, keywordgroup: Keyword_GroupCreate):
        """Create a new keyword group.

        Args:
            keywordgroup: keyword group to create.

        Returns:
            created keyword group.
        """
        with Session(self.db_engine) as session:
            db_keywordgroup = Keyword_Group.model_validate(keywordgroup)
            session.add(db_keywordgroup)
            session.commit()
            session.refresh(db_keywordgroup)
            return db_keywordgroup

    def get_keyword_group(
        self, keywordgroup_id: Annotated[str, Path(title="The ID of the group to get")]
    ) -> Keyword_Group:
        """Retrieve a keyword group by ID.

        Args:
            keywordgroup_id: ID of the keyword group to retrieve.

        Returns:
            retrieved keyword group.
        """
        try:
            uuid = UUID(keywordgroup_id)
        except ValueError:
            raise InvalidQueryParameter(
                f"Keyword group ID {keywordgroup_id} invalid UUID"
            )
        with Session(self.db_engine) as session:
            result = session.get(Keyword_Group, uuid)
            if result is None:
                raise NotFoundError(
                    f"Keyword group with ID {keywordgroup_id} not found"
                )
            return result

    def delete_keyword_group(
        self,
        keywordgroup_id: Annotated[str, Path(title="The ID of the group to delete")],
    ) -> OKResponse:
        """Delete a keyword group by ID.

        Args:
            keywordgroup_id: ID of the keyword group to delete.

        Returns:
            None
        """
        try:
            uuid = UUID(keywordgroup_id)
        except ValueError:
            raise InvalidQueryParameter(
                f"Keyword group ID {keywordgroup_id} invalid UUID"
            )
        with Session(self.db_engine) as session:
            result = session.get(Keyword_Group, uuid)
            if result is None:
                raise NotFoundError(
                    f"Keyword group with ID {keywordgroup_id} not found"
                )
            session.delete(result)
            session.commit()
            return OKResponse(message="Keyword group deleted")

    def create_keyword(self, keyword_input: KeywordBase) -> Keyword:
        """Create a new keyword.

        Args:
            keyword: keyword to create.

        Returns:
            created keyword.
        """
        with Session(self.db_engine) as session:
            db_keyword = Keyword.model_validate(keyword_input)
            session.add(db_keyword)
            session.commit()
            session.refresh(db_keyword)
            return db_keyword

    def get_keyword(
        self, keyword_id: Annotated[str, Path(title="The ID of the item to get")]
    ) -> Keyword:
        """Retrieve a keyword by ID.

        Args:
            keyword_id: ID of the keyword to retrieve.

        Returns:
            retrieved keyword.
        """
        try:
            uuid = UUID(keyword_id)
        except ValueError:
            raise InvalidQueryParameter(f"Keyword ID {keyword_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(Keyword, uuid)
            if result is None:
                raise NotFoundError(f"Keyword with ID {keyword_id} not found")
            return result
