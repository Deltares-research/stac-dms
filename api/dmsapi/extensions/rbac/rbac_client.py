from typing import Annotated, List
from uuid import UUID
from fastapi import Path, Query
from stac_fastapi.types.errors import NotFoundError, InvalidQueryParameter
from sqlalchemy.engine import Engine
from sqlalchemy.orm import selectinload, lazyload, joinedload
from sqlmodel import Session, select
from fastapi.encoders import jsonable_encoder
from dmsapi.schemas.requests import (
    GroupUserRequest,
    PermissionRequest,
    PermissionCheckRequest,
)

from dmsapi.database.models import (  # type: ignore
    ErrorResponse,
    PermissionResponse,
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
    UserUpdate,
)


class RBACClient:
    """Client for managing and retrieving users/permissions."""

    db_engine: Engine

    def __init__(self, db_engine: Engine):
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

    def update_user(self, user_id: str, user_update: UserUpdate) -> User:
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
            result = session.exec(select(User).where(User.id == uuid)).first()
            if result is None:
                raise NotFoundError(f"User with ID {user_id} not found")
            return result

    def get_user_by_email(
        self, user_email: Annotated[str, Path(title="The Name of the user to get")]
    ) -> User:
        """Retrieve a user by ID.

        Args:
            user_id: ID of the user to retrieve.

        Returns:
            retrieved user.
        """
        with Session(self.db_engine) as session:
            result = session.exec(select(User).where(User.email == user_email)).first()
            if result is None:
                raise NotFoundError(f"User with ID {user_email} not found")
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

    def update_group(self, group_id: str, group_update: GroupCreate) -> Group:
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

        with Session(self.db_engine) as session:
            statement = (
                select(Group)
                .where(Group.id == uuid)
                .options(selectinload(Group.users), selectinload(Group.permissions))
            )

            result = session.exec(statement).first()

            print(jsonable_encoder(result))
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

    def add_users_to_group(self, request: GroupUserRequest) -> OKResponse:
        """Add multiple users to a group.

        Args:
            group: group to create.
            user_ids: user ids to add.

        Returns:
            OKResponse
        """
        try:
            group_id = UUID(request.group_id)
            user_ids = [UUID(user_id) for user_id in request.user_ids]
        except ValueError:
            raise InvalidQueryParameter(f"Group ID or User IDs {group_id} invalid UUID")

        with Session(self.db_engine) as session:
            # Check existing links to avoid duplicates
            existing_links = session.exec(
                select(GroupUserLink).where(
                    GroupUserLink.group_id == group_id,
                    GroupUserLink.user_id.in_(user_ids),
                )
            ).all()
            existing_user_ids = {link.user_id for link in existing_links}

            try:
                # Add users that are not already in the group
                new_links = [
                    GroupUserLink(user_id=user_id, group_id=group_id)
                    for user_id in user_ids
                    if user_id not in existing_user_ids
                ]

                if len(new_links) != 0:
                    session.add_all(new_links)
                    session.commit()
                    return OKResponse(message="Users added")
                return OKResponse(message="Users not added")
            except Exception as err:
                print(err)
                return ErrorResponse(code="500", description="Internal server error")

    def remove_users_from_group(self, request: GroupUserRequest) -> bool:
        """Remove multiple users from a group.

        Args:
            group: group to create.
            user_ids: user ids to remove.

        Returns:
            OKResponse
        """

        try:
            group_id = UUID(request.group_id)
            user_ids = [UUID(user_id) for user_id in request.user_ids]
        except ValueError:
            raise InvalidQueryParameter(f"Group ID or User IDs {group_id} invalid UUID")

        with Session(self.db_engine) as session:
            links_to_remove = session.exec(
                select(GroupUserLink).where(
                    GroupUserLink.group_id == group_id,
                    GroupUserLink.user_id.in_(user_ids),
                )
            ).all()

            if links_to_remove:
                for link in links_to_remove:
                    session.delete(link)
                session.commit()
                return OKResponse(message="Users deleted from group")
            return OKResponse(message="Users not deleted from group")

    def get_users_from_group(self, group_id: str) -> List[User]:

        try:
            group_id = UUID(group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID or User IDs {group_id} invalid UUID")

        with Session(self.db_engine) as session:
            users = session.exec(
                select(GroupUserLink.user_id).where(GroupUserLink.group_id == group_id)
            ).all()

            result = session.exec(select(User).where(User.id.in_(users)))

            return result.all()

    def get_roles(self) -> List[RoleList]:
        """Retrieve all roles.

        Returns:
            list of all roles.
        """
        with Session(self.db_engine) as session:
            results = session.exec(select(Role))
            return list(results.all())

    def assign_permission_to_collection(self, request: PermissionRequest) -> bool:
        """Assign a role to a group for a specific object."""
        try:
            group_id = UUID(request.group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")

        with Session(self.db_engine) as session:
            role = session.exec(
                select(Role).where(Role.name == request.role_name)
            ).first()

            if role:
                existing_permission = session.exec(
                    select(Permission).where(
                        Permission.group_id == group_id,
                        Permission.role_id == role.id,
                        Permission.object == request.object.lower(),
                    )
                ).first()

                if existing_permission:
                    return OKResponse(
                        message="Permission already exists for this group, role, and object combination."
                    )

                permission = Permission(
                    group_id=group_id, role_id=role.id, object=request.object.lower()
                )
                session.add(permission)
                session.commit()
                return OKResponse(message="Group permission added for collection")
        return OKResponse(message="Group permission not added for collection")

    def remove_permission_from_collection(self, request: PermissionRequest) -> bool:
        """Remove a role from a group for a specific object."""
        try:
            group_id = UUID(request.group_id)
        except ValueError:
            raise InvalidQueryParameter(f"Group ID {group_id} invalid UUID")

        with Session(self.db_engine) as session:
            role = session.exec(
                select(Role).where(Role.name == request.role_name)
            ).first()
            permission = session.exec(
                select(Permission).where(
                    Permission.group_id == group_id,
                    Permission.role_id == role.id,
                    Permission.object == request.object.lower(),
                )
            ).first()

            if permission:
                session.delete(permission)
                session.commit()
                return OKResponse(message="Group permission removed for collection")
        return OKResponse(message="Group permission not removed for collection")

    def get_permissions(self, obj: str) -> List[PermissionResponse]:
        with Session(self.db_engine) as session:
            permissions = session.exec(
                select(Permission).where(Permission.object == obj.lower())
            )
            # add group name to the permission response as separate field
            return [
                PermissionResponse(
                    **permission.model_dump(),
                    role_name=permission.role.name,
                    group_name=permission.group.name,
                )
                for permission in permissions.all()
            ]

    @staticmethod
    def check_permission(db_engine, email: str, role_name: str, obj: str) -> bool:
        """Check if a user has a specific role for a given object."""

        with Session(db_engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            user_groups = session.exec(
                select(GroupUserLink).where(GroupUserLink.user_id == user.id)
            ).all()
            group_ids = [link.group_id for link in user_groups]

            role = session.exec(select(Role).where(Role.name == role_name)).first()
            if role:
                permission = session.exec(
                    select(Permission).where(
                        Permission.group_id.in_(group_ids),
                        Permission.role_id == role.id,
                        Permission.object == obj,
                    )
                ).first()

                return permission is not None
        return False
