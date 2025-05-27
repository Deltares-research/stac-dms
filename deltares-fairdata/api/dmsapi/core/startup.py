import logging
from pathlib import Path

from alembic import command
from alembic.config import Config
from dmsapi.config import DMSAPISettings
from dmsapi.database.models import Group, GroupRole, Role, User
from sqlmodel import Session, create_engine, select
from stac_fastapi.types.config import Settings

_LOGGER = logging.getLogger("uvicorn.default")


def run_migrations():
    config_path = Path(__file__).parent.parent.parent / "alembic.ini"
    alembic_cfg = Config(config_path)
    settings: DMSAPISettings = Settings.get()
    if settings.environment == "local":
        _LOGGER.info(
            f"Checking for unapplied DB migrations. Not running them. using config at {config_path}"
        )
        # command.check(alembic_cfg)
    else:
        _LOGGER.info("Running DB migrations")
        command.upgrade(alembic_cfg, "head")


def create_admin_users():
    settings: DMSAPISettings = Settings.get()
    engine = create_engine(settings.db_connection_url)
    if not settings.admin_users:
        return

    with Session(engine) as session:
        # create admin users
        admin_users = settings.admin_users.split(",")
        db_users: list[User] = []
        for admin_email in admin_users:
            # check if user already exists
            existing_user = session.exec(
                select(User).where(User.email == admin_email)
            ).first()
            if existing_user:
                _LOGGER.info(f"Admin user {admin_email} already exists")
                db_users.append(existing_user)
                continue
            _LOGGER.info(f"Creating admin user {admin_email}")
            db_user = User(email=admin_email, username=admin_email)
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            db_users.append(db_user)

        # create admin group
        # check if admin group already exists
        admin_group = session.exec(select(Group).where(Group.name == "admin")).first()
        if admin_group:
            _LOGGER.info("Admin group already exists")
            admin_group_users = [user.email for user in admin_group.users]
        else:
            _LOGGER.info("Creating admin group")
            admin_group_users = []
            admin_group = Group(name="admin", description="Admin group")
            session.add(admin_group)
            session.commit()
            session.refresh(admin_group)

        # add users to admin group
        for db_user in db_users:
            if db_user.email in admin_group_users:
                _LOGGER.info(f"User {db_user.email} already in admin group")
                continue
            _LOGGER.info(f"Adding user {db_user.email} to admin group")
            admin_group.users.append(db_user)
        session.commit()
        session.refresh(admin_group)

        # Assign admin role to admin group
        admin_role = session.exec(
            select(GroupRole).where(
                GroupRole.role == Role.ADMIN, GroupRole.group_id == admin_group.id
            )
        ).first()
        if admin_role:
            _LOGGER.info("Admin role already exists")
        else:
            _LOGGER.info("Creating admin role")
            admin_role = GroupRole(
                role=Role.ADMIN, group_id=admin_group.id, object=None
            )
            session.add(admin_role)
            session.commit()
            session.refresh(admin_role)
            _LOGGER.info("Admin role created")
