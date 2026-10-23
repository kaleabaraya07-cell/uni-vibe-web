# Uni Vibe — Codebase Architecture & File Inventory Map

> **Audit Target:** Full Repository Structure  
> **Workspace Root:** `/home/kal/Documents/GitHub/uni-vibe-web`  
> **Investigation Date:** October 2026  

---

## 1. High-Level Workspace Architecture

The workspace contains four primary top-level folders and three root documentation files:

```text
uni-vibe-web/
├── MASTER_BLUEPRINT.md          ← Foundational product vision & architecture spec (v1.0, Aug 2026)
├── PROJECT.md                   ← AI development guidelines, conventions, and design system rules
├── README.md                    ← Minimal repository greeting
├── Backend/                     ← Intended Python/FastAPI REST API (Currently empty placeholder README)
├── admin_web/                   ← Intended back-office admin dashboard (Currently empty directory)
└── Frontend/                    ← Active React 19 + Vite 8 Single Page Web Application
    ├── package.json             ← Dependencies: react, react-dom, react-router-dom, lucide-react
    ├── vite.config.js           ← Vite configuration with @vitejs/plugin-react
    ├── eslint.config.js         ← Flat ESLint 10 configuration
    ├── vercel.json              ← SPA rewrites rule for Vercel deployment
    ├── .env.example             ← Backend URL template (`VITE_API_URL=...`)
    ├── public/                  ← Static web assets (favicon.svg, icons.svg, logo.png)
    └── src/
        ├── main.jsx             ← React DOM root render
        ├── App.jsx              ← Context provider tree and client-side routing table
        ├── index.css            ← Global reset, radial gradients, typography, overflow rules
        ├── App.css              ← Empty app-level styling stub
        ├── assets/              ← Static media (`hero.png`)
        ├── components/          ← 25 reusable UI & domain components
        ├── pages/               ← 17 route-level page components
        ├── context/             ← 8 React Context providers & hooks
        ├── hooks/               ← 2 custom utilities (`useMediaQuery`, `useInfiniteScroll`)
        ├── services/            ← 10 API & async mock abstraction modules (Untracked)
        ├── data/                ← 9 mock data seed files & helper functions
        └── i18n/                ← Dual language JSON dictionaries (`en.json`, `am.json`)
```

---

## 2. Directory & File Inventory

### 2.1 Application Root & Entry Points

| File Path | Role & Responsibility | Key Exports | Dependents | Active / Unused | Backend Readiness / Action |
|---|---|---|---|---|---|
| `Frontend/src/main.jsx` | Mounts React tree to DOM element `#root` | None (side-effect) | `index.html` | **Active** | Keep as-is. StrictMode is enabled. |
| `Frontend/src/App.jsx` | Orchestrates 8 Context Providers and registers `<Routes>` | `default App` | `main.jsx` | **Active** | Needs route decoupling: public pages should not be wrapped in `<ProtectedRoute>`. |
| `Frontend/src/index.css` | Defines dark-navy radial gradient background and sets `overflow: hidden` on body | None | `main.jsx` | **Active** | Needs design tokens (`:root` CSS variables) to replace hardcoded values. |
| `Frontend/src/App.css` | Placeholder stylesheet | None | `App.jsx` | **Active** | Currently 2 lines of comments. Safe to retain or delete. |

---

### 2.2 Routing & Layout Components

| File Path | Role & Responsibility | Key Exports | Dependents | Active / Unused | Backend Readiness / Action |
|---|---|---|---|---|---|
| `Frontend/src/components/AppLayout/AppLayout.jsx` | 3-column responsive desktop/mobile shell (`Navbar`, `LeftSidebar`, `RightSidebar`, `BottomNav`, `SeeThrough`, `UploadModal`) | `default AppLayout` | `App.jsx` | **Active** | Highly reusable shell. Preserves layout across routes. |
| `Frontend/src/components/AuthLayout/AuthLayout.jsx` | Centered glass panel shell for authentication routes | `default AuthLayout` | `App.jsx` | **Active** | Clean layout for Login/SignUp. Keep as-is. |
| `Frontend/src/components/ProtectedRoute/ProtectedRoute.jsx` | Redirects unauthenticated visitors to `/login` | `default ProtectedRoute` | `App.jsx` | **Active** | Overused in `App.jsx`. Must only protect actions (e.g. `/settings`, `/chat`, `/saved`), not public views. |
| `Frontend/src/components/Navbar/Navbar.jsx` | Top bar containing Logo, Live/For You tabs, Search button, Notification bell, and user avatar | `default Navbar` | `AppLayout.jsx` | **Active** | Ready for backend unread notification count. |
| `Frontend/src/components/LeftSidebar/LeftSidebar.jsx` | Left navigation containing user profile summary, navigation links, and "Uni Vibe of the Week" card | `default LeftSidebar` | `AppLayout.jsx` | **Active** | Links to hardcoded `/university/uni1` and `/club/club1` must be updated to directory routes. |
| `Frontend/src/components/RightSidebar/RightSidebar.jsx` | Right widget rail containing "More from Your Uni", `RankingWidget`, and "Upcoming Events" card | `default RightSidebar` | `AppLayout.jsx` | **Active** | Contains hardcoded links to `/university/uni1` and `/event/ev1`. Needs dynamic data. |
| `Frontend/src/components/BottomNav/BottomNav.jsx` | Mobile bottom bar with Home, League, Create (+), Chat, and Profile tabs | `default BottomNav` | `AppLayout.jsx` | **Active** | Responsive mobile nav. Triggers `openUpload()` via `useUpload()`. |

---

### 2.3 Page Components (`Frontend/src/pages/`)

| File Path | Route | Current Data Source | User Actions | Status | Audit Findings |
|---|---|---|---|---|---|
| `Home/Home.jsx` | `/` | Composes `Stories` and `VibeFeed` | Browsing, viewing stories, liking/saving vibes | **Complete (UI)** | Core landing feed. Works well in-memory. |
| `Feed/Feed.jsx` | `/feed` | Composes `VibeFeed` | Same as Home minus stories header | **Complete (UI)** | Secondary feed route. Redundant with Home. |
| `Live/Live.jsx` | `/live` | `mockOpportunities.js` (`mockLiveStreams`) | "Join" button has no handler | **UI Only** | Mock live event cards; no stream playback. |
| `Search/Search.jsx` | `/search` | In-memory filtering across `mockVibes`, `mockUsers`, `mockUniversities`, `mockClubs`, `mockEvents` | Keyword input, tab switching | **Partial** | Client filter only; links to `/feed` rather than vibe detail. |
| `Profile/Profile.jsx` | `/profile/:id` | `mockUsers.js`, `mockVibes.js`, `useFeed()` | Tab switching, follow toggle, edit profile modal | **Partial** | Direct mutation of user object (`user.name = editName`); 6 unused variables causing lint errors. |
| `University/University.jsx` | `/university/:id` | `mockUniversities.js`, `mockVibes.js`, `mockEvents.js` | Tab switching (Vibes, Events, Clubs, Rankings) | **Partial** | Vibes rendered as non-clickable `<img>`; no department list; no follow button. |
| `Department/Department.jsx` | `/department/:id` | `mockUniversities.js`, `mockUsers.js`, `mockEvents.js` | Viewing members and events | **UI Only** | Bare list without navigation links to member profiles. |
| `Club/Club.jsx` | `/club/:id` | `mockUniversities.js`, `mockEvents.js` | "Join" button (local boolean toggle) | **UI Only** | Join state lost on route change or refresh. |
| `Event/Event.jsx` | `/event/:id` | `mockEvents.js`, `mockVibes.js` | "RSVP" button (local boolean toggle) | **UI Only** | RSVP state lost on refresh; related vibes non-clickable. |
| `Rankings/Rankings.jsx` | `/rankings` | `mockRankings.js` | Tab switching, "Inspect Formula" accordion | **Mostly Complete** | Rich leaderboard UI; exposes raw math formula in `<pre>` block against product rules; 4 lint errors. |
| `Saved/Saved.jsx` | `/saved` | `useFeed()` (`getSavedVibes`) | Viewing saved vibe cards | **Partial** | Reads from in-memory Set; all saved items reset on refresh. |
| `Chat/Chat.jsx` | `/chat` | `useChat()` (`mockChat.js`) | Conversation list, search input | **UI Only** | Search input has no filter logic. |
| `ChatRoom.jsx` | `/chat/:id` | `useChat()` | Text input, send message | **Mock Only** | Appends to in-memory state; no WebSockets or persistence. |
| `Notifications/Notifications.jsx` | `/notifications` | `useNotifications()` | "Mark all as read" | **Mock Only** | Resets on page refresh. |
| `Opportunities/Opportunities.jsx` | `/opportunities` | Local static array (`upcomingCategories`) | "Join Priority Waitlist" form | **UI Only** | "Coming soon" waitlist; ignores existing `mockOpportunities.js` seed data; 3 lint errors. |
| `Settings/Settings.jsx` | `/settings` | `useAuth()`, `useLocale()` | Language toggle (EN/AM), Logout | **Partial** | Privacy and Notification toggles are static `<label>` elements without inputs. |
| `Upload/Upload.jsx` | `/upload` | Side-effect `useUpload()` | Opens modal, returns `null` | **Broken** | Renders blank screen if user dismisses modal. |
| `NotFound/NotFound.jsx` | `*` | Static copy | "Go Home" button | **Complete** | Standard 404 handler. |
| `Login/Login.jsx` | `/login` | `useAuth()` (`mockUsers.js`) | Email/password form, demo button, forgot password modal | **Mock Only** | Hardcoded credentials; forgot password is simulated with timeout. |
| `SignUp/SignUp.jsx` | `/signup` | `useAuth()`, `mockUniversities.js` | 2-step registration, student toggle, university dropdown, missing uni modal | **Mostly Complete** | High fidelity UI; creates user in localStorage; no student ID upload; 1 lint error. |

---

### 2.4 State Management & Context (`Frontend/src/context/`)

| Context Provider | Responsibility | Persistent in LocalStorage? | API Integration | Audit Notes |
|---|---|---|---|---|
| `AuthProvider.jsx` | Authentication state, user profile, login/signup/logout | **Yes** (Serializes `user` JSON to `localStorage`) | None (`authService` not used) | Defaults to `currentUser` (Kalab Araya); auto-verifies students (`verificationStatus: "verified"`). Unused `rememberMe` causes lint error. |
| `FeedContext.jsx` | Posts array, Sets for liked, saved, reposted, shared | **No** (Memory only) | Imports `postService` but **never uses it** (lint error) | All engagement resets on reload. `addComment` only increments a counter; does not store text. |
| `ChatContext.jsx` | Conversation list and active messages | **No** (Memory only) | None | Appends message objects to in-memory array. |
| `NotificationContext.jsx` | Notification list and unread count | **No** (Memory only) | None | `markRead` and `markAllRead` mutate in-memory state. |
| `UploadContext.jsx` | Controls visibility of `UploadModal` | **No** (Boolean state) | None | Simple open/close state machine. |
| `SeeThroughContext.jsx` | Controls metadata inspect modal & panel type | **No** (Memory only) | None | Image, Video, Profile, University, Club, Event panels. |
| `LocaleContext.jsx` | English (`en`) and Amharic (`am`) language switcher | **No** (Defaults to 'en') | None | Translates strings via `t(key)` helper. |

---

### 2.5 Services Layer (`Frontend/src/services/` — Untracked Files)

> [!CRITICAL]
> The entire services folder was created as a preparatory draft but is currently **completely disconnected from the React UI**.
> Grep inspection confirms that across the entire `Frontend/src/` directory, only `FeedContext.jsx` imports from `services/`, and that import is an unused variable.

| Service Module | Intended Responsibility | Current Implementation | Usable with FastAPI? |
|---|---|---|---|
| `apiClient.js` | Global fetch wrapper with base URL fallback | Simple 14-line fetch helper. Hardcodes `Content-Type: application/json`. No Auth header. | **Needs overhaul** (Add token interceptor, multipart support, error response parsing). |
| `authService.js` | Login, signup, getCurrentUser, logout | Simulates async delay with `setTimeout(300)`. Validates against `mockCredentials`. Has unused `password` argument (lint error). | **Ready for replacement** with real FastAPI `/api/v1/auth/*` endpoints. |
| `postService.js` | Feed pagination, post retrieval, post creation, likes, reposts, saves | Simulates delay; mutates in-memory `mockVibes`. Enforces verified student check. | **Good contract template** for FastAPI `/api/v1/posts/*`. |
| `rankingService.js` | Season info, leaderboard, highlights, top contributors, PT formula | Wraps `mockRankings.js` constants and calculation formula. Has unused `_userId` (lint error). | **Good contract template** for FastAPI `/api/v1/league/*`. |
| `profileService.js` | User profile retrieval, updates, user vibes, saved/liked vibes | Simulates delay; mutates in-memory `mockUsers`. Has 2 unused `_userId` arguments (lint errors). | **Good contract template** for FastAPI `/api/v1/users/*`. |
| `universityService.js` | Universities, departments, clubs, missing university requests | Simulates delay; wraps `mockUniversities.js`. Has unused `mockDepartments` import (lint error). | **Good contract template** for FastAPI `/api/v1/universities/*`. |
| `messageService.js` | Conversation list, conversation history, sending messages | Simulates delay; mutates `mockChat.js`. | **Usable for REST fallback**; needs WebSockets for real-time. |
| `eventService.js` | Events list by university, event details | Simulates delay; wraps `mockEvents.js`. | **Good contract template** for FastAPI `/api/v1/events/*`. |
| `notificationService.js` | Notification list, mark as read, mark all read | Simulates delay; mutates `mockNotifications.js`. | **Good contract template** for FastAPI `/api/v1/notifications/*`. |
| `index.js` | Central export aggregator for all services | Exports all 9 services and `apiClient`. | **Ready for UI adoption**. |

---

### 2.6 Mock Data Layer (`Frontend/src/data/`)

| File Path | Entities Represented | Record Count | Consistency & Quality |
|---|---|---|---|
| `mockUsers.js` | Users, student status, credentials | 6 users (4 verified students, 1 pending student, 1 non-student explorer) | High consistency. Used across all pages. |
| `mockVibes.js` | Posts/vibes with engagement counts, season, university links | 6 vibe records (4 images, 2 videos) | High consistency. Fields match League scoring requirements. |
| `mockUniversities.js` | Universities (7), Departments (7), Clubs (3), University Requests (1) | 7 Ethiopian universities (EPSU, AAU, JU, HU, BDU, MU, ASTU) | High quality baseline data. |
| `mockRankings.js` | Current Season 2026, Post PT calculation function, Leaderboard (7), Highlights, Top Contributors (3) | Full seasonal ranking baseline | Contains official mathematical formula and current standings. |
| `mockEvents.js` | Campus events with RSVP counts and locations | 3 events | Good structure; lacks end dates and category tags. |
| `mockChat.js` | Conversations and message threads | 3 conversation threads (7 total messages) | Basic text messages only. |
| `mockNotifications.js` | Likes, comments, follows, ranking, and event alerts | 5 notification records | Well structured; covers all event types. |
| `mockStories.js` | 24-hour campus stories with expirations | 4 stories (image, video, text) | Includes expiry timestamps and viewed flags. |
| `mockOpportunities.js` | Campus jobs, scholarships, hackathons, and mock live streams | 4 opportunities, 3 live streams | Rich seed data, currently ignored by `Opportunities.jsx`. |
| `mockData.js` | Central barrel export of all data files plus navigation arrays | Barrel exports + nav configurations | Contains hardcoded paths for `/university/uni1` and `/club/club1`. |
