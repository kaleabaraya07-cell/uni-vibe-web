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
# Review the pending migration scripts and confirm DATABASE_URL points to the intended local database.
uv run alembic upgrade head
uv run python -m scripts.seed_development
```

`seed_development` only inserts the sample university records that are absent by ID, name, and short name; it does not update or delete existing records. Review its entries in `scripts/seed_development.py` before running it.

Start the API:

```bash
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000/api/v1`; interactive OpenAPI docs are at `http://127.0.0.1:8000/docs`. `/api/v1/ready` checks database connectivity. Migrations are explicit; application startup does not create or drop tables.

After starting the API, verify readiness without creating or modifying records:

```bash
curl --fail http://127.0.0.1:8000/api/v1/health
curl --fail http://127.0.0.1:8000/api/v1/ready
```

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

These tests do not verify PostgreSQL connectivity, migrations, or PostgreSQL persistence. PostgreSQL checks must use a separately provisioned test database, not `uni_vibe_dev`, and the test database must be confirmed before running any migration or write test.

## View tracking contract

Starting a view creates an authenticated view session. Completion must include `{"watched_seconds": 4}` or greater, representing accumulated playback reported by the video player; the server also checks that at least four seconds elapsed and rejects a reported playback duration greater than elapsed time. A request that only waits and omits playback telemetry is rejected. Browser-reported playback is not cryptographic proof against a modified client.

## Configuration

Configuration is loaded from `Backend/.env` or process environment variables. See `.env.example` for the supported local settings. Media uploads are stored under the configured `UPLOADS_DIR` (default `Backend/uploads/`, ignored by Git); relative paths are resolved from `Backend/` regardless of the process working directory.

Profile pictures and banners are uploaded by an authenticated user with
`POST /api/v1/auth/me/images/avatar` or `POST /api/v1/auth/me/images/cover`
using a multipart `image` field. JPEG, PNG, and WebP files up to 5 MiB are
accepted. User profile responses expose the stored images as `avatar_url` and
`cover_image_url`; those URLs use the existing safe `GET /api/v1/media/{filename}`
endpoint. Keep `UPLOADS_DIR` on persistent storage for the images to survive
backend restarts.
