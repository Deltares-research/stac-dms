"""use user email as primary key

Revision ID: 48a497f220a8
Revises: 398cc2890fe4
Create Date: 2025-03-27 14:17:24.350962

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "48a497f220a8"
down_revision: Union[str, None] = "398cc2890fe4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "groupuserlink", sa.Column("user_email", sqlmodel.AutoString(), nullable=False)
    )
    op.drop_constraint(
        "groupuserlink_user_id_fkey", "groupuserlink", type_="foreignkey"
    )
    op.drop_constraint("user_pkey", "user", type_="primary")
    op.create_primary_key("user_pk", "user", ["email"])
    op.create_foreign_key(None, "groupuserlink", "user", ["user_email"], ["email"])
    op.drop_column("groupuserlink", "user_id")
    op.drop_column("user", "id")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user", sa.Column("id", sa.UUID(), autoincrement=False, nullable=False)
    )
    op.drop_constraint("user_pk", "user", type_="primary")
    op.create_primary_key("user_pkey", "user", ["id"])
    op.add_column(
        "groupuserlink",
        sa.Column("user_id", sa.UUID(), autoincrement=False, nullable=False),
    )
    op.drop_constraint(None, "groupuserlink", type_="foreignkey")
    op.create_foreign_key(
        "groupuserlink_user_id_fkey", "groupuserlink", "user", ["user_id"], ["id"]
    )
    op.drop_column("groupuserlink", "user_email")
    # ### end Alembic commands ###
