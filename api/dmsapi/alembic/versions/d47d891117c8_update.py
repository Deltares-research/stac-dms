"""update

Revision ID: d47d891117c8
Revises: 95133e2e83ba
Create Date: 2024-07-23 13:38:23.327649

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'd47d891117c8'
down_revision: Union[str, None] = '95133e2e83ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'keyword', 'keyword_group', ['group_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'keyword', type_='foreignkey')
    # ### end Alembic commands ###