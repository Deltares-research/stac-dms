from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy import Engine
from sqlmodel import Session, create_engine
from stac_fastapi.types.config import Settings


def create_db_engine() -> Engine:  # type: ignore
    settings = Settings.get()
    return create_engine(settings.db_connection_url)


def get_session() -> Generator[Session, None, None]:
    with Session(create_db_engine()) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
