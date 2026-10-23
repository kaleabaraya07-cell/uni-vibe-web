# Uni Vibe Implementation Status

## Current implementation

- The backend is FastAPI + SQLAlchemy + Alembic with PostgreSQL configuration loaded from `Backend/.env` or process environment variables. Application startup does not create or drop schema; migrations are explicit.
- The API covers account registration/login/logout and cookie session restoration, student verification requests and admin decisions, university lookup, profile reads/updates, media uploads, feed/posts, comments, reactions, saved/liked lists, view sessions, search, and annual League rankings.
- Post creation is authorized in the backend and requires a verified student. The League scorer and annual UTC season behavior use the existing project formula and coefficients.
- The React client uses the API for the features above. Vite proxies `/api/v1` to the local API to keep session cookies same-origin. Search, profile, university, rankings, feed, and sign-up flows no longer use mock data as their authoritative source.
- An additive migration adds persisted post category and hashtags. A development directory seed helper is available, but has not been run against the target database; review `Backend/scripts/seed_development.py` before using it.
- The separate administration frontend remains out of scope.

## Local commands

1. Configure the backend:

   ```bash
   cd Backend
   uv sync
   cp .env.example .env
   ```

   Edit the ignored `.env` locally and set `DATABASE_URL` with the real local database password. URL-encode reserved characters. Never commit the file or paste the password into chat.
2. Inspect migration state and start the backend:

   ```bash
   uv run alembic current
   uv run alembic history
   uv run alembic upgrade head
   uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   The API is at `http://127.0.0.1:8000/api/v1`; `http://127.0.0.1:8000/api/v1/ready` checks database connectivity. `uv run python -m scripts.seed_development` is optional; review the seed entries first.
3. In another terminal, start the frontend:

   ```bash
   cd Frontend
   npm ci
   npm run dev
   ```

   Open the local Vite URL, normally `http://localhost:5173`. See [Backend/README.md](../Backend/README.md) and [Frontend/README.md](../Frontend/README.md) for configuration and optional local commands.

## Validation completed

- `cd Backend && uv run pytest -q`: **20 passed**. Tests use isolated in-memory SQLite, not the PostgreSQL development database.
- `cd Backend && uv run alembic upgrade head --sql`: **passed**; Alembic generated PostgreSQL SQL for the migration chain without connecting to a database. Current Alembic head is `b73ec42f9a10`.
- `cd Frontend && npm run lint`: **passed**.
- `cd Frontend && npm run build`: **passed**.

The backend test run reports a Starlette/httpx deprecation warning; it does not fail the suite.

## PostgreSQL acceptance status and remaining work

The local PostgreSQL server was reachable at `127.0.0.1:5432`, but this process has no configured database password or usable local password file. Password-based connection was therefore unavailable. No schema inspection, migration application, seed, or database write was performed on `uni_vibe_dev`. Do not declare PostgreSQL connectivity or persistence verified until configured credentials are available and readiness and read/write smoke checks succeed.

Chat, persistent notifications, stories, events/clubs, opportunities, moderation reporting, block/mute/follow workflows, and some other secondary mock-driven screens still need backend-backed implementation. No frontend test runner is configured; frontend validation so far is lint and production build.
