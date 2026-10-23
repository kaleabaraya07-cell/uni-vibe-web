# Uni Vibe Backend

FastAPI REST API for the Uni Vibe web client.

## Local setup

Prerequisites: Python 3.14 and [`uv`](https://docs.astral.sh/uv/).

```bash
cd Backend
uv sync
cp .env.example .env
```

Edit the ignored `Backend/.env` locally. Set `DATABASE_URL` to the supplied PostgreSQL database and replace the local password placeholder. URL-encode reserved characters in the password. Never commit or paste the file contents into chat.

Inspect the target database and current migration revision before applying schema changes:

```bash
uv run alembic current
uv run alembic history
uv run alembic upgrade head
uv run python -m scripts.seed_development
```

`seed_development` only inserts the sample university records that are absent by ID, name, and short name; it does not update or delete existing records. Review its entries in `scripts/seed_development.py` before running it.

Start the API:

```bash
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000/api/v1`; interactive OpenAPI docs are at `http://127.0.0.1:8000/docs`. `/api/v1/ready` checks database connectivity. Migrations are explicit; application startup does not create or drop tables.

To create the first administrator interactively:

```bash
uv run python -m scripts.create_admin
```

This command prompts for the account details and hides password input.

## Tests

Unit/API tests use an isolated in-memory SQLite database; they do not use the configured development PostgreSQL database:

```bash
uv run pytest
```

PostgreSQL migration and persistence checks must target a configured, verified database. Do not point destructive test setup at `uni_vibe_dev`.

## Configuration

Configuration is loaded from `Backend/.env` or process environment variables. See `.env.example` for the supported local settings. Media uploads are stored under the configured `UPLOADS_DIR` (default `Backend/uploads/`, ignored by Git).
