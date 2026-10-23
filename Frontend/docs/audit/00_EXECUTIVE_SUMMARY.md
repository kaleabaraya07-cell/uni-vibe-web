# Uni Vibe — Executive Summary & Technical Audit

> **Target Application:** Uni Vibe — The Digital Home of University Life  
> **Repository Root:** `/home/kal/Documents/GitHub/uni-vibe-web`  
> **Frontend Directory:** `/home/kal/Documents/GitHub/uni-vibe-web/Frontend`  
> **Audit Date:** October 2026  
> **Auditor Role:** Senior Software Architect & Full-Stack Systems Auditor  

---

## 1. Executive Snapshot

Uni Vibe is conceived as a collegiate social network and inter-university competition ecosystem. The platform aspires to connect students, university campus cultures, clubs, events, opportunities, and an annual inter-university competition called the **Uni Vibe League**.

The repository is currently structured as a **frontend-first monolithic workspace** containing three main directories:
- `Frontend/`: A Single Page Application (SPA) built with **React 19.2.8**, **Vite 8.2.0**, **React Router v7.18.2**, and **Lucide React**.
- `Backend/`: Contains only an uninitialized placeholder `README.md` (no server code, database models, or API endpoints exist).
- `admin_web/`: An empty directory.

The frontend is currently in an **advanced prototype / visual mockup phase (v0.1–v0.2)**. It features an aesthetic dark-navy glassmorphic design and rich interactive mock components. However, **zero live backend integration exists**. All data displayed across all pages originates from static JavaScript mock objects in `Frontend/src/data/`.

---

## 2. Core Implementation Status

| Capability Area | Product Requirement | Actual Code Implementation | Status |
|---|---|---|---|
| **Tech Stack** | Modern responsive SPA | React 19.2 + Vite 8 + Vanilla CSS (colocated) + React Router 7 | **Verified & Functional** |
| **Authentication** | Registration, login, session management | In-memory `AuthProvider` defaulting to hardcoded demo user; stores serialized user in `localStorage` | **Simulated / Mock Only** |
| **Route Protection** | Public discovery vs authenticated actions | Every single content route is blocked behind `<ProtectedRoute>`; unauthenticated users are forced to `/login` | **Overprotected / Architectural Defect** |
| **Student Branching** | Student vs Campus Explorer registration | Branching UI in `SignUp.jsx`; creates in-memory user object | **UI Implemented / Client-Only** |
| **Verification Gate** | Only verified university students create posts | Gate modal in `UploadModal.jsx` and client check in `postService.js`; bypassed by default demo account | **Client-Enforced Only** |
| **Vibe Feed** | Infinite scroll, cards, media, actions | In-memory array (`mockVibes`); cards render `<img>` only (no video playback); actions update memory | **Mock Only / Refresh Resets** |
| **Media Upload** | File selection, validation, object URL, storage | Local file input generating `URL.createObjectURL` without file validation or memory cleanup; no backend upload | **Simulated / Memory Leak** |
| **League & Rankings** | Annual season, PT formula, leaderboards | Rich table & widgets in `Rankings.jsx`; displays mathematical formula directly in UI; mock scores | **Mock Only / Formula UI Defect** |
| **University Directory** | Discover all universities, view campus hub | Profile page `/university/:id` exists, but **no directory/search page exists**; left sidebar hardcodes `/university/uni1` | **Partial / Missing Directory** |
| **Clubs & Events** | Club discovery, RSVP, event feeds | Detail pages `/club/:id` and `/event/:id` exist with local toggle states; **no directory pages exist** | **Partial / Missing Directory** |
| **Chat & Messaging** | Private messaging, unread counts | `Chat.jsx` and `ChatRoom.jsx` with local in-memory text append; no WebSockets, polling, or persistence | **Mock Only** |
| **Opportunities** | Campus jobs, internships, scholarships | Static "Coming Soon" waitlist page in `Opportunities.jsx`; ignores existing `mockOpportunities.js` seed data | **UI Only (Waitlist)** |
| **Backend Integration** | REST API client, service abstractions | 10 service files drafted in `Frontend/src/services/` as untracked files; **completely disconnected from UI components** | **Placeholder / Disconnected** |

---

## 3. What Actually Works

1. **Vite Production Build:** The production build completes cleanly (`vite build` produces `dist/assets/index-DiGqlASl.js` ~360 kB / 106 kB gzip and `index-7WdG-vxN.css` ~56 kB in 1.20s).
2. **Visual Design & Theming:** High-fidelity dark navy palette (`#060d18`), glassmorphic panels (`backdrop-filter: blur(20px)`), responsive breakpoints, and modern icon set (`lucide-react`).
3. **Interactive Feed Shell:** Liking, saving, reposting, and story viewer progress bars function smoothly in memory during an active browser session.
4. **Registration Flow UI:** Two-step modal/form flow collects student status, selects from approved universities, and offers a "My university isn't listed" modal.
5. **Internationalization Shell:** Dual-language toggle (English / Amharic) powered by `LocaleContext` and JSON dictionaries (`en.json`, `am.json`).
6. **SeeThrough Inspection Overlay:** Slide-over modal inspects post metadata, tags, and creator profile.

---

## 4. What Is Broken, Incomplete, or Mocked

1. **Zero Data Persistence:** All user interactions (likes, saves, reposts, comments, chat messages, newly created vibes, story uploads, university requests) are stored exclusively in React component state or Context memory. **Refreshing the browser immediately obliterates all user actions.**
2. **Overprotected Routing:** `<ProtectedRoute>` wraps all major routes (Home, Feed, Search, University, Department, Club, Event, Rankings, Opportunities). Unauthenticated prospective students cannot browse or evaluate campus culture without logging in.
3. **Hardcoded Navigation Links:** Clicking "Universities" in the main navigation routes to `/university/uni1` (EPSU); clicking "Clubs" routes to `/club/club1`. There are no university or club directory pages. Clicking "View all events" in the right sidebar routes to `/event/ev1`.
4. **Services Layer Disconnection:** The repository contains a set of service files (`authService.js`, `postService.js`, `rankingService.js`, etc.) in `Frontend/src/services/`. However, **not a single UI page or component consumes these services**. UI components directly import mock data arrays from `Frontend/src/data/mock*.js`.
5. **Lint Failures:** `npm run lint` fails with **30 problems (29 errors, 1 warning)**, caused by unused imports and variables in recently edited files.
6. **No Video Playback:** Despite video vibes and stories being a core product feature, `VibeCard.jsx` exclusively renders an `<img>` element (`<img src={media} />`). Video files cannot be played, and the required 4-second watch-time rule is not tracked.
7. **Scoring Formula UI Leak:** `Rankings.jsx` exposes an "Inspect Formula" accordion that renders the raw algorithmic equation in a `<pre class="formula-code">` block, contradicting the product rule that the formula must remain internal.
8. **Media Upload Leak:** `UploadModal.jsx` and `Stories.jsx` use `URL.createObjectURL(file)` without `URL.revokeObjectURL()`, creating browser memory leaks, and accept files without file size or MIME validation.
9. **Blank Page on Direct `/upload` Route:** `Upload.jsx` renders `null` and triggers `openUpload()` in an effect. If a user navigates to `/upload` and closes the modal, a blank canvas remains.

---

## 5. Backend Readiness Assessment

**Rating: 1.5 / 5 (Not Ready for Immediate Integration)**

- **No HTTP Layer:** `apiClient.js` is an unconfigured 14-line fetch wrapper with hardcoded JSON headers, no Bearer token injection, no error body parsing, no retry logic, and no support for `multipart/form-data`.
- **No Token/Session Handling:** `AuthProvider.jsx` stores a serialized user JSON object in `localStorage` without JWTs, refresh tokens, cookie storage, or expiration checks.
- **Architectural Disconnection:** Before connecting to a Python/FastAPI backend, the frontend components must first be refactored to consume the service layer (`Frontend/src/services/`) rather than importing static arrays directly from `Frontend/src/data/`.

---

## 6. Critical Security & Data Integrity Gaps

1. **Client-Side Permission Enforcement:** Student-only posting restrictions and student verification badges exist solely in client JSX conditionals (`if (!isVerifiedStudent)`). A user modifying client state or sending an HTTP request directly to a future backend could bypass all restrictions unless the FastAPI backend rigorously enforces verification.
2. **Client-Side League PT Calculation:** `mockRankings.js` contains the client-side formula for calculating Post PT. If the frontend ever computes or submits PT to the server, bad actors could manipulate season standings. The backend must be the sole authority calculating PT asynchronously.
3. **Default Demo Impersonation:** `AuthProvider.jsx` defaults unauthenticated sessions to `currentUser` (Kalab Araya, verified student). Anyone loading the application automatically acts as this user.

---

## 7. Recommended Next Steps

1. **Phase 1: Frontend Hardening:** Fix the 30 ESLint errors to restore CI/build health; decouple `<ProtectedRoute>` so public pages (Home, Feed, Rankings, Universities, Search) are openly accessible to visitors; add proper directory routes (`/universities`, `/clubs`, `/events`).
2. **Phase 2: Service Layer Refactoring:** Migrate all UI components from direct `mockData` imports to asynchronous calls through `Frontend/src/services/`.
3. **Phase 3: Python/FastAPI Backend Scaffold:** Initialize the `Backend/` directory with FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL, and Pydantic v2 schemas mirroring the audited models.
4. **Phase 4: Authentication & Media Storage:** Implement JWT/HTTP-only cookie authentication, student verification workflows with document upload, and S3/R2 presigned URL uploads.
5. **Phase 5: League Engine:** Build the background ranking worker in Python/FastAPI to calculate season PT, record valid 4-second views, and update university standings.
