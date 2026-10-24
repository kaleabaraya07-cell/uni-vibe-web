"""add profile image references

Revision ID: c4192a8b6f31
Revises: b73ec42f9a10
Create Date: 2026-10-24 22:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c4192a8b6f31"
down_revision: Union[str, Sequence[str], None] = "b73ec42f9a10"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("avatar_path", sa.String(length=80), nullable=True))
    op.add_column("users", sa.Column("cover_image_path", sa.String(length=80), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "cover_image_path")
    op.drop_column("users", "avatar_path")
