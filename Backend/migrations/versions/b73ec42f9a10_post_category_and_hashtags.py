"""persist post category and hashtags

Revision ID: b73ec42f9a10
Revises: 11d7162020ea
Create Date: 2026-10-24 01:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b73ec42f9a10"
down_revision: Union[str, Sequence[str], None] = "11d7162020ea"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "posts",
        sa.Column("category", sa.String(length=64), server_default="Campus life", nullable=False),
    )
    op.add_column(
        "posts",
        sa.Column("hashtags", sa.JSON(), server_default="[]", nullable=False),
    )
    op.alter_column("posts", "category", server_default=None)
    op.alter_column("posts", "hashtags", server_default=None)


def downgrade() -> None:
    op.drop_column("posts", "hashtags")
    op.drop_column("posts", "category")
