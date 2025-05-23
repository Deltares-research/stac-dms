"""improve user group link

Revision ID: ced79c82eaee
Revises: b138775c00dd
Create Date: 2025-04-03 08:12:15.474883

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ced79c82eaee"
down_revision: Union[str, None] = "b138775c00dd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("groupuserlink_pkey", "groupuserlink", type_="primary")
    op.create_primary_key(
        "groupuserlink_pkey", "groupuserlink", ["group_id", "user_email"]
    )
    op.drop_column("groupuserlink", "id")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "groupuserlink", sa.Column("id", sa.UUID(), autoincrement=False, nullable=False)
    )
    op.drop_constraint("groupuserlink_pkey", "groupuserlink", type_="primary")
    op.create_primary_key("groupuserlink_pkey", "groupuserlink", ["id"])
    # ### end Alembic commands ###
