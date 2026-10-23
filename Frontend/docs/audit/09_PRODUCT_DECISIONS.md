# Uni Vibe — Product & Architecture Decisions Register

> **Scope:** Separation of confirmed repository facts, technical recommendations, and open decisions requiring the founder's explicit approval.  
> **Investigation Date:** October 2026  

---

## 1. Category A: Confirmed Facts

These facts have been directly verified by inspecting the repository source code, build scripts, git status, and test commands:

1. **Frontend Stack:** The frontend application is built with React 19.2.8, Vite 8.2.0, React Router DOM 7.18.2, and Lucide React 1.28.0, with vanilla CSS colocated in component folders.
2. **Backend Codebase Absence:** The `Backend/` directory contains only an uninitialized `README.md`. No Python, FastAPI, Node.js, database schemas, or API endpoints exist anywhere in the repository.
3. **Empty Admin Directory:** The `admin_web/` directory is completely empty.
4. **Disconnected Services Layer:** Ten service modules exist in `Frontend/src/services/` (auth, post, university, ranking, profile, message, event, notification, apiClient, index). With the exception of an unused import in `FeedContext.jsx`, **no component or page in the application imports or uses these services**.
5. **Static Mock State:** All active components import directly from `Frontend/src/data/mock*.js`. All user interactions (likes, saves, reposts, comments, posts, chat messages, notifications) are stored in React component or Context memory and are **completely reset upon page refresh**.
6. **Authentication & Session:** The application stores a serialized `user` JSON object in browser `localStorage` (`univibe_current_user`). It defaults to `currentUser` (Kalab Araya), meaning first-time visitors are automatically logged in as a verified student.
7. **Overprotected Routing:** In `App.jsx`, `<ProtectedRoute>` wraps all major routes (including Home, Feed, Search, Rankings, Universities, Clubs, Events, and Opportunities). If a user logs out, they are locked out of all public content and forced to `/login`.
8. **Missing Directory Routes:** The application lacks directory listing pages for `/universities`, `/clubs`, and `/events`. Left navigation links are hardcoded to `/university/uni1` and `/club/club1`, and sidebar event links are hardcoded to `/event/ev1`.
9. **Missing Post Detail Route:** There is no single post view route (e.g. `/vibe/:id` or `/post/:id`). Clicking a vibe result in search navigates to `/feed`.
10. **Zero Video Playback:** Despite video vibes being a central feature, `VibeCard.jsx` only renders static `<img>` tags. HTML5 `<video>` tags and video player controls do not exist.
11. **Scoring Formula UI Leak:** `Rankings.jsx` renders an expandable `<pre class="formula-code">` block that exposes the mathematical formula directly in the UI, contradicting the product specification.
12. **Build & Lint Status:** `npm run build` succeeds cleanly in 1.20s, generating a ~106 kB gzipped JS bundle. However, `npm run lint` fails with **30 problems (29 errors, 1 warning)**, consisting primarily of unused imports and variables in recently edited files.
13. **Blueprint Scoring Divergence:** `MASTER_BLUEPRINT.md` (dated August 2026) specifies weekly ranking resets with simple point values (Like=1, Comment=3, Share=5, Save=4, View=0.2). In contrast, the current product specification specifies an annual UTC season with a non-linear weighted confidence formula ($\text{Like Rate} + 5 \times \text{Save Rate} + 5 \times \text{Repost Rate}$, damping by $\frac{\sqrt{V}}{\sqrt{V} + \sqrt{1000}}$).

---

## 2. Category B: Technical Recommendations

Approaches recommended to improve the project's quality, maintainability, and backend readiness:

1. **Clean Up Lint Errors Immediately:** Remove the 29 unused variables/imports across the 12 affected files so `npm run lint` passes cleanly in CI.
2. **Decouple Public & Protected Routes in `App.jsx`:** Allow unauthenticated users to view Home, Feed, Search, Rankings, Universities, Clubs, Events, and Opportunities. Restrict `<ProtectedRoute>` strictly to private actions: `/settings`, `/chat`, `/saved`, and post creation actions.
3. **Unify Design Tokens in CSS Variables:** Create a `:root` block in `Frontend/src/index.css` defining palette colors, glass panel styles, border radii, and spacing tokens to eliminate duplicated hardcoded hex values across 30+ stylesheets.
4. **Remove Raw Formula UI in `Rankings.jsx`:** Delete the `<pre class="formula-code">` block in `Rankings.jsx` and replace it with natural-language explainers describing valid views and seasonal community participation.
5. **Connect UI Components to Services Layer:** Refactor `FeedContext`, `AuthProvider`, `Rankings`, `University`, etc., to invoke methods from `Frontend/src/services/` rather than importing directly from `mockData.js`. This will allow switching from mock data to real FastAPI endpoints without modifying UI components.
6. **Implement Video Player Component:** Replace the static `<img>` tag in `VibeCard.jsx` with a responsive video player that tracks watch duration and triggers a 4.0-second valid view event.
7. **Adopt Presigned S3/R2 Direct Uploads:** Implement direct client-to-storage uploads for images and videos to prevent large media payloads from overwhelming Python/FastAPI worker threads.
8. **Adopt Automated Testing Tooling:** Add `vitest` and `@testing-library/react` to test critical student permission gates and state transitions.

---

## 3. Category C: Open Product & Architecture Decisions

These questions require the founder's explicit business and product decision before implementation begins:

### Priority 1: High-Impact Architecture Decisions (Blocking Development)

#### Decision 1: Authentication & Session Strategy
- **Context:** The frontend currently stores a user object in `localStorage`.
- **Options:**
  - **Option A (Recommended):** HTTP-only, Secure, SameSite=Lax cookie-based sessions with short-lived JWT access tokens. (Maximizes security against XSS; seamless browser UX).
  - **Option B:** OAuth2 Bearer tokens returned in response bodies and stored in memory by the client, with refresh tokens in `localStorage`.
- **Founder Decision Required:** Confirm preferred authentication session model for the FastAPI backend.

#### Decision 2: Student Verification Evidence & Workflow
- **Context:** The product requires that only verified university students can publish vibes. The frontend currently has no upload mechanism for student proof.
- **Options:**
  - **Option A (Recommended):** Multi-modal verification: Allow institutional `.edu.et` email verification for instant approval, OR photo upload of physical Student ID Card for manual administrative review.
  - **Option B:** Physical Student ID card photo upload only (requires manual review for 100% of students).
  - **Option C:** Institutional university email verification only (fastest, but many Ethiopian universities do not issue student email addresses reliably).
- **Founder Decision Required:** Which verification evidence is required, and should unverified students remain in `pending` status indefinitely?

#### Decision 3: Public vs. Gated Browsing Model
- **Context:** Currently, `<ProtectedRoute>` blocks all routes if not logged in.
- **Options:**
  - **Option A (Recommended):** Open public discovery. Anyone can view the home feed, campus profiles, rankings, and events without an account. Only posting, commenting, saving, chatting, and RSVPing require an account.
  - **Option B:** Semi-gated. Allow viewing the landing page and rankings, but require registration to view the full feed.
  - **Option C:** Walled garden. Require account registration and login before viewing any campus content.
- **Founder Decision Required:** Confirm whether Uni Vibe should be an open discovery network or a closed network.

---

### Priority 2: Medium-Impact Product Decisions

#### Decision 4: League Season Calibration & Archiving
- **Context:** The product specification defines an annual UTC season with non-linear formula damping. `MASTER_BLUEPRINT.md` specifies weekly resets.
- **Questions:**
  - Will there be weekly/monthly awards alongside the global annual championship?
  - What exact UTC timestamp marks the start and end of the season?
  - When a season ends, are previous season posts still browsable on student profiles with their historic PT displayed?
  - Does engagement (likes/comments) on an archived post after a season closes contribute to any score? (Product rule states: *Engagement from a previous season must not contribute to a later season*).

#### Decision 5: Missing-University Workflow & Directory Expansion
- **Context:** `SignUp.jsx` provides a form to request an unlisted university.
- **Questions:**
  - When a student registers with a requested university, can their account be created immediately in an unverified state, or is account creation blocked until the university is approved?
  - What criteria does the campus team require to approve a university (official website, ministry accreditation, minimum student petition count)?

#### Decision 6: Opportunities & Live Streaming Scope for MVP
- **Context:** `Opportunities.jsx` is currently a coming-soon waitlist page, and `Live.jsx` has static cards with non-functional "Join" buttons.
- **Questions:**
  - Should student job/internship listings be part of the initial MVP release, or deferred to Version 0.2?
  - Should Live Streams be deferred until after the core text/photo/video feed and League engine are stable?
