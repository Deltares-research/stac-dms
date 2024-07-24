from typing import Annotated
from uuid import UUID
from fastapi import Path
from stac_fastapi.types.errors import NotFoundError, InvalidQueryParameter
from sqlalchemy.engine import Engine
from sqlmodel import Session

from dmsapi.database.models import (
    Keyword,
    Keyword_Group,
    Keyword_GroupCreate,
    KeywordBase,
)


class KeywordClient:
    """Cleint for managing and retrieving keywords."""

    db_engine: Engine

    def __init__(self, db_engine: Engine):
        """Initialize the client."""
        self.db_engine = db_engine

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
        self, keywordgroup_id: Annotated[str, Path(title="The ID of the item to get")]
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
