from typing import Annotated, List
from uuid import UUID

from dmsapi.core.dependencies import UserDep
from dmsapi.database.db import SessionDep
from dmsapi.database.models import (  # type: ignore
    ErrorResponse,
    Group,
    GroupCollectionRoleResponse,
    GroupCreate,
    GroupGlobalRoleResponse,
    GroupList,
    GroupRole,
    GroupUserLink,
    OKResponse,
    Permission,
    Role,
    User,
    UserCreate,
    UserList,
    UserUpdate,
    role_permissions,
)
from dmsapi.schemas.requests import GroupCollectionRoleRequest, GroupGlobalRoleRequest
from fastapi import Path
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from stac_fastapi.types.errors import InvalidQueryParameter, NotFoundError


class RBACClient:
    """Client for managing and retrieving users/permissions."""

    def create_user(self, user: UserCreate, session: SessionDep) -> User:
        """Create a new user.

        Args:
            user: user to create.

        Returns:
            created user.
        """

        db_user = User.model_validate(user)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user

    def update_user(
        self, user_id: str, user_update: UserUpdate, session: SessionDep
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
        self,
        user_id: Annotated[str, Path(title="The ID of the user to get")],
        session: SessionDep,
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
        result = session.exec(select(User).where(User.id == uuid)).first()
        if result is None:
            raise NotFoundError(f"User with ID {user_id} not found")
            return result

    def get_user_by_email(
        self,
        user_email: Annotated[str, Path(title="The Name of the user to get")],
        session: SessionDep,
    ) -> User:
        """Retrieve a user by ID.

        Args:
            user_id: ID of the user to retrieve.

        Returns:
            retrieved user.
        """
        result = session.exec(select(User).where(User.email == user_email)).first()
        if result is None:
            raise NotFoundError(f"User with ID {user_email} not found")
        return result

    def get_users(self, session: SessionDep) -> List[UserList]:
        """Retrieve all users.

        Returns:
            list of all users.
        """
        results = session.exec(select(User))
        return list(results.all())

    def delete_user(
        self,
        user_id: Annotated[str, Path(title="The ID of the user to delete")],
        session: SessionDep,
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
        result = session.get(User, uuid)
        if result is None:
            raise NotFoundError(f"User with ID {user_id} not found")
        session.delete(result)
        session.commit()
        return OKResponse(message="User deleted")

    def create_group(self, group: GroupCreate, session: SessionDep) -> Group:
        """Create a new group.

        Args:
            group: group to create.

        Returns:
            created group.
        """
        db_group = Group.model_validate(group)
        session.add(db_group)
        session.commit()
        session.refresh(db_group)
        return db_group

    def update_group(
        self, group_id: str, group_update: GroupCreate, session: SessionDep
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
        self,
        group_id: Annotated[str, Path(title="The ID of the group to get")],
        session: SessionDep,
    ) -> Group:
        """Retrieve a group by ID, including users and permissions.

        Args:
            group_id: ID of the group to retrieve.

        Returns:
            retrieved group with users and permissions.
        """
        try:
            uuid = UUID(group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")

        statement = (
            select(Group).where(Group.id == uuid).options(selectinload(Group.users))
        )

        result = session.exec(statement).first()

        print(jsonable_encoder(result))
        if result is None:
            raise NotFoundError(f"Group with ID {group_id} not found")

        return result

    def get_groups(self, session: SessionDep) -> List[GroupList]:
        """Retrieve all groups.

        Returns:
            list of all groups.
        """
        results = session.exec(select(Group))
        return list(results.all())

    def delete_group(
        self,
        group_id: Annotated[UUID, Path(title="The ID of the group to delete")],
        session: SessionDep,
    ) -> OKResponse:
        """Delete a group by ID.

        Args:
            group_id: ID of the group to delete.

        Returns:
            OKResponse
        """
        result = session.get(Group, group_id)
        if result is None:
            raise NotFoundError(f"Group with ID {group_id} not found")
        session.delete(result)
        session.commit()
        return OKResponse(message="Group deleted")

    def add_users_to_group(
        self, group_id: UUID, users: list[UserUpdate], session: SessionDep
    ) -> OKResponse:
        """Add multiple users to a group.

        Args:
            group_id: ID of the group to add users to
            users: List of user Emails to add to the group

        Returns:
            OKResponse
        """
        email_list = [user.email for user in users]
        # Check existing links to avoid duplicates
        existing_links = session.exec(
            select(GroupUserLink).where(
                GroupUserLink.group_id == group_id,
                GroupUserLink.user_email.in_(email_list),
            )
        ).all()
        existing_user_emails = {link.user_email for link in existing_links}

        try:
            # Add users that are not already in the group
            new_links = [
                GroupUserLink(user_email=user.email, group_id=group_id)
                for user in users
                if user.email not in existing_user_emails
            ]

            if len(new_links) != 0:
                session.add_all(new_links)
                session.commit()
                return OKResponse(message="Members added")
            return OKResponse(message="Members not added")
        except Exception as err:
            print(err)
            return ErrorResponse(code="500", message="Internal server error")

    def remove_user_from_group(
        self, group_id: UUID, user_email: EmailStr, session: SessionDep
    ) -> bool:
        """Remove multiple users from a group.

        Args:
            group: group to create.
            user_email: user email to remove.

        Returns:
            OKResponse
        """
        links_to_remove = session.exec(
            select(GroupUserLink).where(
                GroupUserLink.group_id == group_id,
                GroupUserLink.user_email == user_email,
            )
        ).first()

        if links_to_remove:
            session.delete(links_to_remove)
            session.commit()
            return OKResponse(message="User removed from group")
        return OKResponse(message="User not removed from group")

    def get_users_from_group(self, group_id: UUID, session: SessionDep) -> List[User]:
        """Get all users in a group.

        Args:
            group_id: ID of the group to get users from

        Returns:
            List of users in the group
        """
        users = session.exec(
            select(GroupUserLink.user_email).where(GroupUserLink.group_id == group_id)
        ).all()

        result = session.exec(select(User).where(User.email.in_(users)))

        return result.all()

    def get_roles(self) -> List[Role]:
        """Retrieve all roles.

        Returns:
            list of all roles.
        """
        return Role.__members__.values()

    @staticmethod
    def assign_group_global_role(
        request: GroupGlobalRoleRequest, session: SessionDep
    ) -> GroupGlobalRoleResponse:
        """Assign a role to a group.

        Args:
            request: GroupGlobalRoleRequest

        Returns:
            GroupGlobalRoleResponse"""
        group = session.exec(select(Group).where(Group.id == request.group_id)).first()
        if group is None:
            raise NotFoundError(f"Group with ID {request.group_id} not found")

        group_role = GroupRole(
            group_id=request.group_id,
            role=request.role,
            object=None,
        )
        session.add(group_role)
        session.commit()
        session.refresh(group_role)
        return GroupGlobalRoleResponse(
            id=group_role.id,
            group_id=group_role.group_id,
            group_name=group.name,
            role=group_role.role,
        )

    def get_my_global_permissions(
        self, user: UserDep, session: SessionDep
    ) -> List[Permission]:
        """Get all global permissions for a given user.

        Args:
            user: UserDep

        Returns:
            List of GroupRole objects
        """

        global_roles: list[GroupRole] = session.exec(
            select(GroupRole)
            .join(Group, Group.id == GroupRole.group_id)
            .join(GroupUserLink, GroupUserLink.group_id == Group.id)
            .where(
                GroupRole.object.is_(None),
                GroupUserLink.user_email == user.email,
            )
        ).all()

        # Create a flat list of distinct permissions from all roles
        permissions = set()
        for role in global_roles:
            # Add all permissions from this role to our set
            permissions.update(role_permissions[role.role])
        return list(permissions)

    def assign_collection_group_role(
        self,
        collection_id: str,
        request: GroupCollectionRoleRequest,
        session: SessionDep,
    ) -> GroupCollectionRoleResponse:
        """Assign a role to a group on a collection.

        Args:
            object_id: ID of the object to assign the role to
            request: GroupCollectionRoleRequest

        Returns:
            GroupCollectionRoleResponse
        """
        group = session.exec(select(Group).where(Group.id == request.group_id)).first()
        if group is None:
            raise NotFoundError(f"Group with ID {request.group_id} not found")
        # TODO: check if collection exists
        group_role = GroupRole(
            group_id=request.group_id,
            role=request.role,
            object=collection_id,
        )
        session.add(group_role)
        session.commit()
        session.refresh(group_role)
        return GroupCollectionRoleResponse(
            id=group_role.id,
            group_id=group_role.group_id,
            group_name=group.name,
            role=group_role.role,
            object=collection_id,
        )

    def get_permissions_on_collection(
        self, collection_id: str, user: UserDep, session: SessionDep
    ) -> List[Permission]:
        """Get all permissions for the current user on a given collection.

        Args:
            collection_id: ID of the collection to get permissions for
            user: Current authenticated user
            session: Database session

        Returns:
            List of Permission objects that the current user has on the collection
        """
        collection_roles: list[GroupRole] = session.exec(
            select(GroupRole)
            .join(GroupUserLink, GroupRole.group_id == GroupUserLink.group_id)
            .where(
                GroupRole.object == collection_id,
                func.lower(GroupUserLink.user_email) == func.lower(user.email),
            )
        ).all()

        # Create a flat list of distinct permissions from all roles
        permissions = set()
        for role in collection_roles:
            # Add all permissions from this role to our set
            permissions.update(role_permissions[role.role])
        return list(permissions)
