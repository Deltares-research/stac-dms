from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import Path, Query
from stac_fastapi.types.errors import NotFoundError, InvalidQueryParameter
from sqlalchemy.engine import Engine
from sqlalchemy.orm import selectinload, lazyload, joinedload
from sqlmodel import Session, select

from dmsapi.database.models import (  # type: ignore
    Facility,
    FacilityCreate,
    FacilityKeywordGroupLink,
    FacilityList,
    Keyword,
    Keyword_Group,
    Keyword_GroupCreate,
    Keyword_GroupPublicWithKeywords,
    Keyword_GroupUpdate,
    KeywordBase,
    KeywordUpdate,
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

    def update_facility(
        self, facility_id: str, facility_update: FacilityCreate
    ) -> Facility:
        """Update a facility by ID.

        Args:
            facility_id: ID of the facility to update.
            facility: facility to update.
        Returns:
            updated facility.
        """
        try:
            uuid = UUID(facility_id)
        except ValueError:
            raise InvalidQueryParameter(f"Facility ID {facility_id} invalid UUID")
        with Session(self.db_engine) as session:
            facility = session.get(Facility, uuid)
            if facility is None:
                raise NotFoundError(f"Facility with ID {facility_id} not found")

            for key, value in facility_update.model_dump().items():
                if value:
                    setattr(facility, key, value)
            session.add(facility)
            session.commit()
            session.refresh(facility)
            return facility

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
            result = session.exec(
                select(Facility)
                .where(Facility.id == uuid)
                .options(selectinload(Facility.keyword_groups))
            ).first()
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

    def link_keywordgroup_to_facility(
        self, facility_keywordgroup_link: FacilityKeywordGroupLink
    ) -> OKResponse:
        """Link a keyword group to a facility.

        Args:
            facility_keywrdgroup_link: link to create.

        Returns:
            OKResponse
        """
        with Session(self.db_engine) as session:
            # check if facility exists
            try:
                facility_uuid = UUID(facility_keywordgroup_link.facility_id)
            except ValueError:
                raise InvalidQueryParameter(
                    f"Facility ID {facility_keywordgroup_link.facility_id} invalid UUID"
                )
            facility = session.get(Facility, facility_uuid)
            if facility is None:
                raise NotFoundError(
                    f"Facility with ID {facility_keywordgroup_link.facility_id} not found"
                )
            # check if keyword group exists
            try:
                keyword_group_uuid = UUID(facility_keywordgroup_link.keyword_group_id)
            except ValueError:
                raise InvalidQueryParameter(
                    f"Keyword group ID {facility_keywordgroup_link.keyword_group_id} invalid UUID"
                )
            keyword_group = session.get(Keyword_Group, keyword_group_uuid)
            if keyword_group is None:
                raise NotFoundError(
                    f"Keyword group with ID {facility_keywordgroup_link.keyword_group_id} not found"
                )
            facility.keyword_groups.append(keyword_group)
            session.add(facility)
            session.commit()
            return OKResponse(message="Keyword group linked to facility")

    def unlink_keywordgroup_from_facility(
        self, facility_keywordgroup_link: FacilityKeywordGroupLink
    ) -> OKResponse:
        """Unlink a keyword group from a facility.

        Args:
            facility_keywrdgroup_link: link to delete.

        Returns:
            OKResponse
        """
        with Session(self.db_engine) as session:
            # check if facility exists
            try:
                facility_uuid = UUID(facility_keywordgroup_link.facility_id)
            except ValueError:
                raise InvalidQueryParameter(
                    f"Facility ID {facility_keywordgroup_link.facility_id} invalid UUID"
                )
            facility = session.get(Facility, facility_uuid)
            if facility is None:
                raise NotFoundError(message="Facility not found")
            # check if keyword group exists
            try:
                keyword_group_uuid = UUID(facility_keywordgroup_link.keyword_group_id)
            except ValueError:
                raise InvalidQueryParameter(
                    f"Keyword group ID {facility_keywordgroup_link.keyword_group_id} invalid UUID"
                )
            keyword_group = session.get(Keyword_Group, keyword_group_uuid)
            if keyword_group is None:
                raise NotFoundError(
                    f"Keyword group with ID {facility_keywordgroup_link.keyword_group_id} not found"
                )

            facility.keyword_groups.remove(keyword_group)
            session.add(facility)
            session.commit()
            return OKResponse(message="Keyword group unlinked from facility")

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

    def update_keywordgroup(
        self,
        keywordgroup_id: Annotated[str, Path(title="The ID of the group to update")],
        keywordgroup_update: Keyword_GroupUpdate,
    ):
        """Update an existing keyword group.

        Args:
            keywordgroup: updated keyword group.
            keywordgroup_id: ID of the keyword group to update.
        """
        try:
            uuid = UUID(keywordgroup_id)
        except ValueError:
            raise InvalidQueryParameter(
                f"Keywordgroup ID {keywordgroup_id} invalid UUID"
            )
        with Session(self.db_engine) as session:
            keywordgroup = session.get(Keyword_Group, uuid)
            if keywordgroup is None:
                raise NotFoundError(f"Keywordgroup ID {keywordgroup_id} not found")

            for key, value in keywordgroup_update.model_dump().items():
                if value:
                    setattr(keywordgroup, key, value)
            session.add(keywordgroup)
            session.commit()
            session.refresh(keywordgroup)
            return keywordgroup

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

    def get_keyword_groups(self) -> List[Keyword_Group]:
        """Retrieve all keyword groups.

        Returns:
            list of all keyword groups.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(Keyword_Group))
            return list(results.all())

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
        self, keyword_id: Annotated[str, Path(title="The ID of the keyword to get")]
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

    def update_keyword(
        self,
        keyword_id: Annotated[str, Path(title="The ID of the keyword to get")],
        keyword_update: KeywordUpdate,
    ) -> Keyword:
        """Update a keyword by ID.

        Args:
            keyword_id: ID of the keyword to update.
            keyword: keyword to update.

        Returns:
            updated keyword.
        """
        try:
            uuid = UUID(keyword_id)
        except ValueError:
            raise InvalidQueryParameter(f"Keyword ID {keyword_id} invalid UUID")
        with Session(self.db_engine) as session:
            keyword = session.get(Keyword, uuid)
            if keyword is None:
                raise NotFoundError(f"Keyword with ID {keyword_id} not found")

            for key, value in keyword_update.model_dump().items():
                if value:
                    setattr(keyword, key, value)
            session.add(keyword)
            session.commit()
            session.refresh(keyword)
            return keyword

    def delete_keyword(
        self,
        keyword_id: Annotated[str, Path(title="The ID of the keyword to delete")],
    ) -> OKResponse:
        """Delete a keyword by ID.

        Args:
            keyword_id: ID of the keyword to delete.

        Returns:
            OKResponse
        """
        try:
            uuid = UUID(keyword_id)
        except ValueError:
            raise InvalidQueryParameter(f"Keyword ID {keyword_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(Keyword, uuid)
            if result is None:
                raise NotFoundError(f"Keyword with ID {keyword_id} not found")
            session.delete(result)
            session.commit()
            return OKResponse(message="Keyword deleted")

    def get_keywords(
        self,
        facility_id: Annotated[
            Optional[str],
            Query(title="The ID of the facility to get keywords for"),
        ] = None,
        keyword_group_id: Annotated[
            Optional[str],
            Query(title="The ID of the group to get keywords for"),
        ] = None,
    ) -> list[Keyword_GroupPublicWithKeywords]:
        """Retrieve all keywords from a keyword group or facility.

        Args:
            facility_id: ID of the facility to retrieve keywords for.
            keyword_group_id: ID of the keyword group to retrieve the keywords for.

        Returns:
            filtered keyword groups with keywords.
        """
        try:
            facility_uuid = UUID(facility_id) if facility_id else None
        except ValueError:
            raise InvalidQueryParameter(f"Facility ID {facility_id} invalid UUID")
        try:
            keyword_group_uuid = UUID(keyword_group_id) if keyword_group_id else None
        except ValueError:
            raise InvalidQueryParameter(
                f"Keyword group ID {keyword_group_id} invalid UUID"
            )

        if not facility_id and not keyword_group_id:
            raise InvalidQueryParameter(
                "Either facility_id or keyword_group_id must be provided"
            )
        if facility_id and keyword_group_id:
            raise InvalidQueryParameter(
                "Only one of facility_id or keyword_group_id can be provided"
            )

        with Session(self.db_engine) as session:
            if facility_id:
                facility = session.exec(
                    select(Facility)
                    .where(Facility.id == facility_uuid)
                    .options(
                        lazyload(Facility.keyword_groups).joinedload(
                            Keyword_Group.keywords
                        )
                    )
                ).first()
                if facility is None:
                    raise NotFoundError(f"Facility with ID {facility_id} not found")
                keyword_groups = facility.keyword_groups
            else:
                keyword_group = session.exec(
                    select(Keyword_Group)
                    .where(Keyword_Group.id == keyword_group_uuid)
                    .options(joinedload(Keyword_Group.keywords))
                ).first()
                keyword_groups = [keyword_group]

            return keyword_groups
