from typing import Annotated, Callable

from dmsapi.database.models import (
    GroupRole,
    GroupUserLink,
    Permission,
    User,
    role_permissions,
)
from fastapi import Depends, HTTPException, Path
from sqlalchemy import func
from sqlmodel import Session, select

from ..database.db import get_session
from ..extensions.core.sso_auth_extension import SSOAuthExtension

SessionDep = Annotated[Session, Depends(get_session)]
UserDep = Annotated[User, Depends(SSOAuthExtension.get_logged_user)]


def user_has_global_permission(
    permission: Permission,
) -> Callable[[User, Session], None]:
    """Check if a user has a specific role for a given object."""

    def permission_dependency(
        user: User = Depends(SSOAuthExtension.get_logged_user),
        session: Session = Depends(get_session),
    ) -> None:
        # Get group roles for the user in a single query using a join
        group_roles = session.exec(
            select(GroupRole)
            .join(GroupUserLink, GroupRole.group_id == GroupUserLink.group_id)
            .where(
                func.lower(GroupUserLink.user_email) == func.lower(user.email),
                GroupRole.object.is_(None),
            )
        ).all()

        for group_role in group_roles:
            if permission in role_permissions[group_role.role]:
                return
        raise HTTPException(
            status_code=403,
            detail=f"User {user.email} does not have permission '{permission.value}'",
        )

    return permission_dependency


def user_has_collection_permission(
    permission: Permission,
) -> Callable[[User, Session], None]:
    """Check if a user has a specific role for a given object."""

    def permission_dependency(
        collection_id: Annotated[str, Path()],
        user: User = Depends(SSOAuthExtension.get_logged_user),
        session: Session = Depends(get_session),
    ) -> None:
        # Get group roles for the user in a single query using a join
        group_roles = session.exec(
            select(GroupRole)
            .join(GroupUserLink, GroupRole.group_id == GroupUserLink.group_id)
            .where(func.lower(GroupUserLink.user_email) == func.lower(user.email))
            .where(GroupRole.object == collection_id)
        ).all()

        for group_role in group_roles:
            if permission in role_permissions[group_role.role]:
                return
        raise HTTPException(
            status_code=403,
            detail=f"User {user.email} does not have permission {permission.value} on collection {collection_id}",
        )

    return permission_dependency
