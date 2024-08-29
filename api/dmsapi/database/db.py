from sqlalchemy import Engine
from sqlmodel import create_engine

from dmsapi.config import DMSAPISettings


def create_db_engine(settings: DMSAPISettings, **kwargs) -> Engine:
    return create_engine(settings.db_connection_url, **kwargs)
