"""add keywords models

Revision ID: 95133e2e83ba
Revises: cb3574ed126b
Create Date: 2024-07-23 11:50:44.778863

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '95133e2e83ba'
down_revision: Union[str, None] = 'cb3574ed126b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('facility',
    sa.Column('id', sqlmodel.UUID(), nullable=False),
    sa.Column('name', sqlmodel.AutoString(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('keyword',
    sa.Column('nl_keyword', sqlmodel.AutoString(), nullable=True),
    sa.Column('en_keyword', sqlmodel.AutoString(), nullable=True),
    sa.Column('external_id', sqlmodel.AutoString(), nullable=True),
    sa.Column('group_id', sqlmodel.UUID(), nullable=True),
    sa.Column('id', sqlmodel.UUID(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('keyword_group',
    sa.Column('id', sqlmodel.UUID(), nullable=False),
    sa.Column('group_name_nl', sqlmodel.AutoString(), nullable=False),
    sa.Column('group_name_en', sqlmodel.AutoString(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('facilitykeywordgrouplink',
    sa.Column('facility_id', sqlmodel.UUID(), nullable=False),
    sa.Column('keyword_group_id', sqlmodel.UUID(), nullable=False),
    sa.ForeignKeyConstraint(['facility_id'], ['facility.id'], ),
    sa.ForeignKeyConstraint(['keyword_group_id'], ['keyword_group.id'], ),
    sa.PrimaryKeyConstraint('facility_id', 'keyword_group_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('facilitykeywordgrouplink')
    op.drop_table('keyword_group')
    op.drop_table('keyword')
    op.drop_table('facility')
    # ### end Alembic commands ###
