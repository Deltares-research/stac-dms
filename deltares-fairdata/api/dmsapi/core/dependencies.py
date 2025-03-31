from typing import Annotated, Callable

from dmsapi.database.models import (
    GroupRole,
    GroupUserLink,
    Permission,
    User,
    role_permissions,
)
from fastapi import Depends, HTTPException
from sqlmodel import Session, select

from ..database.db import get_session
from ..extensions.core.sso_auth_extension import SSOAuthExtension

SessionDep = Annotated[Session, Depends(get_session)]
UserDep = Annotated[User, Depends(SSOAuthExtension.get_logged_user)]


def user_has_permission_on_object(
    object: str, permission: Permission
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
            .where(GroupUserLink.user_email == user.email)
        ).all()

        for group_role in group_roles:
            if (group_role.object_id == object) and (
                permission in role_permissions[group_role.role]
            ):
                return
        raise HTTPException(
            status_code=403,
            detail=f"User {user.email} does not have permission {permission} on object {object}",
        )

    return permission_dependency
