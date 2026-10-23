# Backend Implementation Plan

## Architecture

Build a modular monolith in the existing `Backend/` directory:

- FastAPI REST API under `/api/v1/`.
- SQLAlchemy 2.x models and unit-of-work sessions.
- PostgreSQL via Psycopg 3 in development; isolated SQLite databases for fast tests.
- Pydantic request/response models and environment-driven settings.
- Alembic migrations; application startup must never create/drop the schema.
- `uv` project and lockfile, pytest tests, local filesystem media storage outside tracked source.
- React services use one configurable API client. No API endpoint is hardcoded in page components.

Initial package layout:

```text
Backend/
  app/
    main.py
    core/         # settings, security, errors
    db/           # engine, session, base
    models/       # SQLAlchemy entities
    schemas/      # Pydantic API contracts
    api/          # versioned routers and dependencies
    services/     # auth, universities, feed, scoring
  migrations/
  tests/
  scripts/
  uploads/        # local runtime data, ignored by Git
```

## Initial domain model

- `User`: normalized email, unique username, display/profile fields, role, student status, verification status, password hash.
- `AuthSession`: hashed opaque random token, user, expiry, revocation timestamp; browser cookie is HttpOnly and SameSite Lax. Cookie `Secure` is enabled outside local development. Future mobile clients can receive an API-compatible session credential after a deliberate client policy decision.
- `University`: stable identifier, canonical name, short name, location, active/public state.
- `UniversityRequest`: request data and review status; administrative decisions require an administrator role.
- `Post`: creator, university, content/caption, media metadata, creation time, annual season.
- `PostReaction`, `Comment`, `PostView`: unique user/post reactions, persisted comments, and deduplicated valid views.

Further entities (stories, chat, notifications, moderation/audit records, historical archives) will be implemented only where needed to connect existing UI and where this task's acceptance criteria can be verified. Avoid placeholders.

## Initial API contracts

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/health` | public | Process health |
| GET | `/api/v1/ready` | public | Database readiness |
| POST | `/api/v1/auth/register` | public | Register an unverified account |
| POST | `/api/v1/auth/login` | public | Create server-side session |
| POST | `/api/v1/auth/logout` | signed in | Revoke session and clear cookie |
| GET | `/api/v1/auth/me` | signed in | Current account |
| GET | `/api/v1/universities` | public | Bounded public directory |
| POST | `/api/v1/universities/requests` | public/signed in | Submit missing university request |
| GET | `/api/v1/feed` | public | Bounded/paginated public feed |
| POST | `/api/v1/posts` | verified student | Create post using server-derived user/verification |
| GET | `/api/v1/posts/{id}` | public | Retrieve post |
| POST | `/api/v1/posts/{id}/likes` | signed in | Idempotent like toggle |
| POST | `/api/v1/posts/{id}/saves` | signed in | Idempotent save toggle |
| POST | `/api/v1/posts/{id}/reposts` | signed in | Idempotent repost toggle |
| POST | `/api/v1/posts/{id}/comments` | signed in | Add validated comment |
| POST | `/api/v1/posts/{id}/views` | public/session-aware | Record a completed four-second view under documented deduplication |
| GET | `/api/v1/rankings/universities` | public | Server-calculated seasonal standings |

Administrative review endpoints are added with explicit role checks and audit records before being described as operational.

## Security and permissions

- Passwords are hashed with a maintained Argon2 implementation; plaintext credentials are never persisted or logged.
- Session tokens are high-entropy random values; only hashes are stored in PostgreSQL.
- Authentication comes from server-side session state, never client-supplied user IDs or flags.
- New student accounts begin unverified. Only a separately authorized review operation can approve posting.
- Public origins are explicitly configured; credentialed CORS never uses `*`.
- Uploads require allowlisted MIME/extensions, size bounds, server-generated names, and storage outside version control.
- Errors use stable JSON status/code/message responses without traces or secrets.
- Rate limiting and abuse prevention must be explicit; local-only throttling is not claimed to protect horizontally scaled production deployments.

## League policy

Follow the explicit scoring rule from the current implementation brief: only views of at least four seconds count; views are denominator/confidence inputs, not points; Like=1, Save=5, Repost=5; annual UTC seasons; zero valid views yields zero Post PT. Implement one dedicated, Decimal-based backend function and deterministic tests. Do not accept client-submitted PT, view totals, or season points. Historical archives and season closure require a separately authorized, deterministic operation.

The older blueprint contains different weights and weekly ranking periods. The current brief states its formula is the provisional default; keep this conflict documented until product owners confirm the intended long-term policy.

## Phases and acceptance

1. **Audit/recovery:** inspect source/docs, establish recovery bundle, document current state and plan.
2. **Backend foundation:** settings, DB session, health/readiness, models, Alembic, packaging, API errors, initial tests.
3. **Authentication/universities:** registration, login/logout/current user, sessions, public directory/request, review permissions.
4. **Feed/League:** persistent posts/reactions/comments/views, safe local uploads, paginated feed, server scoring.
5. **Frontend integration:** replace mocked services for implemented endpoints, preserve layouts, display loading/empty/error states.
6. **Local validation:** SQLite test suite and frontend lint/build; PostgreSQL migration and end-to-end test only after authenticating to the specified development database.
7. **Handover:** actual setup, commands, tests, limitations, and next development priorities in `docs/implementation-status.md`.

The complete task includes additional existing features (chat, notifications, stories, search, events, opportunities, clubs, moderation, archives). They must not be represented as backend-integrated unless both API and client paths are implemented and tested.
