# Current State Audit

Audit date: 2026-10-24

## Repository and recovery

- Repository: `kaleabaraya07-cell/uni-vibe-web`, branch `main`.
- The checkout was clean before this implementation began. `main` is two commits ahead of `origin/main`; no remote operations were performed.
- A full Git recovery bundle for the existing refs was created outside the repository at `/tmp/uni-vibe-web-pre-backend-20261024.bundle`.
- `Backend/` contained only `README.md`, describing a planned Node.js/PostgreSQL/JWT API. No backend code, migrations, tests, Python manifest, or `.gitignore` was present at audit time.
- `Frontend/` is a React 19/Vite 8 application with routes, contexts, reusable components, service modules, and mock data.
- `admin_web/` is not part of this implementation.

## Frontend behavior and current state

- The React app has pages for feed, profile, universities, departments, clubs, events, League/rankings, saved posts, authentication, upload, stories, chat, notifications, opportunities, and settings.
- The existing design is a dark navy/blue glassmorphism UI with responsive navigation and layouts; preserve it.
- Service modules exist for auth, posts, profiles, rankings, universities, notifications, events, and messages, but the inspected services use hardcoded arrays and simulated delays rather than HTTP calls.
- `FeedContext`, auth context, page state, and mock data are the sources of truth for the currently implemented interactions; they do not persist application data to a server.
- The signup and profile/post UI includes student and verification concepts, but client state is not an authority for permissions.
- The League mock data contains a client-side point calculation. The product brief in the current task supplies the default scoring policy; public UI must not expose the raw equation.
- No frontend test files or test script were found during the initial scan. Existing `npm run lint` and `npm run build` were used during the preceding frontend work.
- A backend connection was not configured in the frontend service layer at audit time. Its API client defaulted to `http://localhost:3000/api/v1`.

## Requirements and conflicts

- `Backend/README.md` and `MASTER_BLUEPRINT.md` describe Node.js as a possible/planned API. The current task explicitly requires FastAPI, SQLAlchemy 2, Alembic, PostgreSQL, Pydantic, Psycopg 3, and `uv`; this audit adopts the explicit current task.
- The older blueprint describes alternative ranking point weights and periods. This task explicitly specifies a four-second valid view and the Like=1, Save=5, Repost=5 annual-season formula; treat that as provisional current behavior, record the conflict, and do not make the older scheme authoritative.
- The exact production/session policy, university verification evidence fields, and administrative review workflow need to follow the actual existing product rules and remain a review item rather than being inferred from mock UI.

## Environment observations

- `uv`, Python 3.14.8, Node 22.23.1, npm 10.9.8, `psql`, and PostgreSQL client utilities are installed.
- PostgreSQL responds on `127.0.0.1:5432`.
- A passwordless connection attempt for `uni_vibe_app` to `uni_vibe_dev` failed with “no password supplied.” The database identity and schema were therefore not inspected or changed. No credential was printed or guessed.
- PostgreSQL migrations/integration checks remain blocked until a real local credential is supplied through a protected local configuration.

## Initial backend implementation scope

Start with a secure, testable modular API foundation, health/readiness checks, persistent account/session handling, university directory/request APIs, post/feed/engagement operations, media validation/storage, and backend League calculation. Use isolated SQLite tests for unit/API behavior until PostgreSQL credentials become available. Extend feature coverage incrementally and record unimplemented screens honestly.
