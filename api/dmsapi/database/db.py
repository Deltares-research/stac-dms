from sqlmodel import create_engine

from dmsapi.config import settings

engine = create_engine(settings.db_connection_url)
