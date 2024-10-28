from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import Path, Query
from stac_fastapi.types.errors import NotFoundError, InvalidQueryParameter
from sqlalchemy.engine import Engine
from sqlalchemy.orm import selectinload, lazyload, joinedload
from sqlmodel import Session, select

from dmsapi.database.models import (  # type: ignore
    User,
    UserCreate,
    UserList,
    Group,
    GroupCreate,
    GroupList,
    Role,
    RoleList,
    Permission,
    GroupUserLink,
    OKResponse,
)

class RBACClient:
    """Client for managing and retrieving users/permissions."""

    db_engine: Engine

    def __init__(self, db_engine: Session):
        """Initialize the client."""
        self.db_engine = db_engine

    def create_user(self, user: UserCreate) -> User:
        """Create a new user.

        Args:
            user: user to create.

        Returns:
            created user.
        """
        with Session(self.db_engine) as session:
            db_user = User.model_validate(user)
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            return db_user

    def update_user(
        self, user_id: str, user_update: UserCreate
    ) -> User:
        """Update a user by ID.

        Args:
            user_id: ID of the user to update.
            user: user to update.
        Returns:
            updated user.
        """
        try:
            uuid = UUID(user_id)
        except ValueError:
            raise InvalidQueryParameter(f"User ID {user_id} invalid UUID")
        with Session(self.db_engine) as session:
            user = session.get(User, uuid)
            if user is None:
                raise NotFoundError(f"User with ID {user_id} not found")

            for key, value in user_update.model_dump().items():
                if value:
                    setattr(user, key, value)
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    def get_user(
        self, user_id: Annotated[str, Path(title="The ID of the user to get")]
    ) -> User:
        """Retrieve a user by ID.

        Args:
            user_id: ID of the user to retrieve.

        Returns:
            retrieved user.
        """
        try:
            uuid = UUID(user_id)
        except ValueError:
            raise InvalidQueryParameter(f"User ID {user_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.exec(
                select(User)
                .where(User.id == uuid)
                .options(selectinload(User.keyword_groups))
            ).first()
            if result is None:
                raise NotFoundError(f"User with ID {user_id} not found")
            return result

    def get_users(self) -> List[UserList]:
        """Retrieve all users.

        Returns:
            list of all users.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(User))
            return list(results.all())

    def delete_user(
        self,
        user_id: Annotated[str, Path(title="The ID of the user to delete")],
    ) -> OKResponse:
        """Delete a user by ID.

        Args:
            user_id: ID of the user to delete.

        Returns:
            OKResponse
        """
        try:
            uuid = UUID(user_id)
        except ValueError:
            raise InvalidQueryParameter(f"User ID {user_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(User, uuid)
            if result is None:
                raise NotFoundError(f"User with ID {user_id} not found")
            session.delete(result)
            session.commit()
            return OKResponse(message="User deleted")
        
    def create_group(self, group: GroupCreate) -> Group:
        """Create a new group.

        Args:
            group: group to create.

        Returns:
            created group.
        """
        with Session(self.db_engine) as session:
            db_group = Group.model_validate(group)
            session.add(db_group)
            session.commit()
            session.refresh(db_group)
            return db_group

    def update_group(
        self, group_id: str, group_update: GroupCreate
    ) -> Group:
        """Update a group by ID.

        Args:
            group_id: ID of the group to update.
            group: group to update.
        Returns:
            updated group.
        """
        try:
            uuid = UUID(group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")
        with Session(self.db_engine) as session:
            group = session.get(Group, uuid)
            if group is None:
                raise NotFoundError(f"Group with ID {group_id} not found")

            for key, value in group_update.model_dump().items():
                if value:
                    setattr(group, key, value)
            session.add(group)
            session.commit()
            session.refresh(group)
            return group

    def get_group(
        self, group_id: Annotated[str, Path(title="The ID of the group to get")]
    ) -> Group:
        """Retrieve a group by ID.

        Args:
            group_id: ID of the group to retrieve.

        Returns:
            retrieved group.
        """
        try:
            uuid = UUID(group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.exec(
                select(Group)
                .where(Group.id == uuid)
                .options(selectinload(Group.keyword_groups))
            ).first()
            if result is None:
                raise NotFoundError(f"Group with ID {group_id} not found")
            return result

    def get_groups(self) -> List[GroupList]:
        """Retrieve all groups.

        Returns:
            list of all groups.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(Group))
            return list(results.all())

    def delete_group(
        self,
        group_id: Annotated[str, Path(title="The ID of the group to delete")],
    ) -> OKResponse:
        """Delete a group by ID.

        Args:
            group_id: ID of the group to delete.

        Returns:
            OKResponse
        """
        try:
            uuid = UUID(group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")
        with Session(self.db_engine) as session:
            result = session.get(Group, uuid)
            if result is None:
                raise NotFoundError(f"Group with ID {group_id} not found")
            session.delete(result)
            session.commit()
            return OKResponse(message="Group deleted")

    def add_users_to_group(self, user_ids: list[int], group_id: int) -> bool:
        """Add multiple users to a group."""
        with Session(self.db_engine) as session:
            # Check existing links to avoid duplicates
            existing_links = session.exec(
                select(GroupUserLink)
                .where(GroupUserLink.group_id == group_id, GroupUserLink.user_id.in_(user_ids))
            ).all()
            existing_user_ids = {link.user_id for link in existing_links}

            # Add users that are not already in the group
            new_links = [
                GroupUserLink(user_id=user_id, group_id=group_id)
                for user_id in user_ids if user_id not in existing_user_ids
            ]

            if new_links:
                session.add_all(new_links)
                session.commit()
                return True
            return False

    def remove_users_from_group(self, user_ids: list[int], group_id: int) -> bool:
        """Remove multiple users from a group."""
        with Session(self.db_engine) as session:
            links_to_remove = session.exec(
                select(GroupUserLink)
                .where(GroupUserLink.group_id == group_id, GroupUserLink.user_id.in_(user_ids))
            ).all()

            if links_to_remove:
                for link in links_to_remove:
                    session.delete(link)
                session.commit()
                return True
            return False
    
    def get_roles(self) -> List[RoleList]:
        """Retrieve all roles.

        Returns:
            list of all roles.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(Role))
            return list(results.all())

    def assign_permission_to_collection(self, group_id: int, role_name: str, obj: str) -> bool:
        """Assign a role to a group for a specific object."""
        with Session(self.db_engine) as session:
            role = session.exec(select(Role).where(Role.name == role_name)).first()
            if role:
                permission = Permission(group_id=group_id, role_id=role.id, object=obj)
                session.add(permission)
                session.commit()
                return True
        return False

    def remove_permission_from_collection(self, group_id: int, role_name: str, obj: str) -> bool:
        """Remove a role from a group for a specific object."""
        with Session(self.db_engine) as session:
            role = session.exec(select(Role).where(Role.name == role_name)).first()
            permission = session.exec(
                select(Permission).where(Permission.group_id == group_id, Permission.role_id == role.id, Permission.object == obj)
            ).first()

            if permission:
                session.delete(permission)
                session.commit()
                return True
        return False

    def check_permission(self, user_id: int, obj: str, role_name: str) -> bool:
        """Check if a user has a specific role for a given object."""
        with Session(self.db_engine) as session:
            user_groups = session.exec(
                select(GroupUserLink).where(GroupUserLink.user_id == user_id)
            ).all()
            group_ids = [link.group_id for link in user_groups]

            role = session.exec(select(Role).where(Role.name == role_name)).first()
            if role:
                permission = session.exec(
                    select(Permission)
                    .where(Permission.group_id.in_(group_ids), Permission.role_id == role.id, Permission.object == obj)
                ).first()
                return permission is not None
        return False