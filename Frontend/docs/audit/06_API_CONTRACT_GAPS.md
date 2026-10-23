# Uni Vibe — Backend API Contract Gap Analysis

> **Target API Standard:** Python / FastAPI RESTful Specification (`/api/v1/...`)  
> **Investigation Date:** October 2026  

---

## 1. Feature-by-Feature Contract Gap Matrix

| Feature | Existing Service / Hook | Current Input | Current Output | Proposed API Responsibility | Integration Gap |
|---|---|---|---|---|---|
| **User Login** | `services/authService.js:9`, `context/AuthProvider.jsx:29` | `email`, `password`, `rememberMe` | `{ ok: true, user }` (or throws Error) | `POST /api/v1/auth/token`<br>OAuth2 password flow. Validates argon2/bcrypt password hash; returns JWT access + refresh tokens. | Frontend expects synchronous object return; no token decoding, bearer header injection, or HTTP cookie handling. |
| **Registration & Student Branching** | `services/authService.js:22`, `context/AuthProvider.jsx:58` | `{ name, username, email, password, isStudent, universityId, departmentId, departmentName }` | `{ ok: true, user: newUser }` | `POST /api/v1/auth/register`<br>Validates email uniqueness, creates `User` record with `verification_status="none"` or `"pending"`. | Frontend auto-verifies students; no endpoint exists to receive verification documents or institutional email. |
| **Student Verification Submission** | *None* (Simulated by boolean toggle in `SignUp.jsx`) | *None* | *None* | `POST /api/v1/users/me/verification`<br>Accepts student ID card image / transcript, institutional email, student ID number. | Entirely missing in frontend; no file upload for student credentials. |
| **Current User Profile** | `services/authService.js:62`, `context/AuthProvider.jsx:7` | None | Stored `user` object from `localStorage` | `GET /api/v1/users/me`<br>Resolves authenticated user from JWT claims, joins university & department data. | Frontend relies on `localStorage.getItem("univibe_current_user")` without validating token expiration or status changes with the server. |
| **University Directory** | `services/universityService.js:16` | None | `mockUniversities[]` | `GET /api/v1/universities`<br>Returns approved university list with search/filter query params. | Service exists but is not consumed by UI; no `/universities` directory page exists in the routing table. |
| **University Profile** | `services/universityService.js:21` | `id` (e.g. `"uni1"`) | `mockUniversities.find()` | `GET /api/v1/universities/{id}`<br>Returns university details, active stats, season rank, and departments. | `University.jsx` imports `getUniversityById` from `mockUniversities.js` instead of using the service. |
| **Missing University Request** | `services/universityService.js:46`, `pages/SignUp/SignUp.jsx:78` | `{ name, location, website, applicantEmail }` | `{ success: true, request }` | `POST /api/v1/universities/requests`<br>Stores request in database and triggers review queue for administrators. | UI pushes directly to in-memory `mockUniversityRequests` array in `SignUp.jsx:81`. |
| **Feed Retrieval** | `services/postService.js:8`, `context/FeedContext.jsx:9` | `{ page = 1, limit = 10, category }` | `{ posts: [], hasMore: boolean, total: number }` | `GET /api/v1/feed`<br>Cursor-based pagination (`?cursor=...&limit=10&tab=for-you`). Applies recommendation & freshness weights. | `VibeFeed.jsx` ignores `postService.getFeedPosts()` and performs client-side slicing on static `mockVibes`. |
| **Post Creation** | `services/postService.js:27`, `components/UploadModal/UploadModal.jsx:55` | `{ caption, media (blob url), category, universityId, hashtags }` | Created post object | `POST /api/v1/posts`<br>Enforces verified student authorization, attaches server timestamp, assigns permanent season ID. | Frontend uploads local blob URL without server upload; `UploadModal` calls `FeedContext.addVibe()` directly. |
| **Media File Upload** | *None* | Raw browser `File` object | Local `blob:` URL | `POST /api/v1/media/upload-url`<br>Generates signed S3/R2 direct PUT URL for secure binary transfer. | Complete absence of file upload service or S3 client. |
| **Liking a Vibe** | `services/postService.js:53`, `context/FeedContext.jsx:15` | `postId` | `{ success: true, likes: number }` | `POST /api/v1/posts/{id}/like`<br>Toggles like; increments post like count; queues background PT recalculation. | `FeedContext` mutates in-memory `Set` and counter; changes are lost upon page reload. |
| **Saving a Vibe** | `services/postService.js:68`, `context/FeedContext.jsx:30` | `postId` | `{ success: true, saves: number }` | `POST /api/v1/posts/{id}/save`<br>Toggles bookmark in `saved_posts`; recalculates Post PT. | Handled via in-memory Set in `FeedContext`; resets on page reload. |
| **Reposting a Vibe** | `services/postService.js:60`, `context/FeedContext.jsx:45` | `postId` | `{ success: true, reposts: number }` | `POST /api/v1/posts/{id}/repost`<br>Records repost; updates Post PT (5× multiplier); distributes to follower feed. | Handled via in-memory Set; resets on reload. |
| **Valid Watch View Tracking** | *None* | *None* | *None* | `POST /api/v1/posts/{id}/views`<br>Payload: `{ watch_time_seconds }`. Validates watch duration >= 4.0s; deduplicates by viewer IP/user. | Completely missing in frontend; no video player or timer exists. |
| **Post Comments** | *None* (`FeedContext.jsx:69` has dummy increment) | `id` | None | `GET /api/v1/posts/{id}/comments`<br>`POST /api/v1/posts/{id}/comments` | `VibeCard` uses hardcoded `demoComments` and discards typed comment text. |
| **Campus Stories** | `services/postService.js:76`, `components/Stories/Stories.jsx:51` | `{ draftText, media, draftType }` | Appends to in-memory story list | `GET /api/v1/stories`<br>`POST /api/v1/stories`<br>Filters expired stories (older than 24h). | Frontend performs client-side expiration check; stores stories in component state. |
| **League Leaderboard & Standings** | `services/rankingService.js:19`, `pages/Rankings/Rankings.jsx:9` | None | `mockLeagueLeaderboard[]` | `GET /api/v1/league/leaderboard?season=2026`<br>Returns authoritative standings pre-calculated by backend. | Frontend reads static mock array and exposes raw scoring equation in UI. |
| **Top Student Contributors** | `services/rankingService.js:29` | None | `mockTopContributors[]` | `GET /api/v1/league/contributors?season=2026` | Read directly from `mockRankings.js`. |
| **Campus Clubs** | `services/universityService.js:36` | `universityId` | `mockClubs[]` | `GET /api/v1/clubs?university_id=...`<br>`POST /api/v1/clubs/{id}/join` | No club directory; join toggle stored in local boolean state. |
| **Campus Events** | `services/eventService.js:7` | `{ universityId }` | `mockEvents[]` | `GET /api/v1/events`<br>`POST /api/v1/events/{id}/rsvp` | No event calendar route; RSVP state lost on refresh. |
| **Chat & Messaging** | `services/messageService.js:7` | `{ conversationId, text }` | Appends to local messages array | `GET /api/v1/chat/conversations`<br>`GET /api/v1/chat/{id}/messages`<br>`WS /api/v1/ws/chat/{id}` | In-memory only; no WebSocket connection or real-time persistence. |
| **Notifications** | `services/notificationService.js:7` | None | `mockNotifications[]` | `GET /api/v1/notifications`<br>`PUT /api/v1/notifications/{id}/read`<br>`PUT /api/v1/notifications/read-all` | Stored in React context; resets on page reload. |
| **Opportunities** | `data/mockOpportunities.js` | None | `mockOpportunities[]` | `GET /api/v1/opportunities`<br>`POST /api/v1/opportunities/{id}/save` | UI displays static waitlist; ignores mock seed data. |
| **Content Reporting & Moderation** | *None* | *None* | *None* | `POST /api/v1/reports`<br>Payload: `{ target_type, target_id, reason, details }`. | "Report" button in `VibeCard` context menu merely closes the popup. |

---

## 2. Proposed FastAPI Endpoint Specifications

### 2.1 Authentication & Accounts (`/api/v1/auth/`)
```http
POST   /api/v1/auth/register            -> Create account (student or explorer)
POST   /api/v1/auth/token               -> OAuth2 Login (returns access_token, refresh_token)
POST   /api/v1/auth/refresh             -> Refresh access token
POST   /api/v1/auth/logout              -> Invalidate session / revoke refresh token
POST   /api/v1/auth/forgot-password     -> Initiate password reset email
POST   /api/v1/auth/reset-password      -> Submit new password with reset token
```

### 2.2 User Profiles & Student Verification (`/api/v1/users/`)
```http
GET    /api/v1/users/me                 -> Get current user profile & verification status
PATCH  /api/v1/users/me                 -> Update bio, avatar, year of study
POST   /api/v1/users/me/verification    -> Submit student ID / proof for verification
GET    /api/v1/users/{id}               -> Get public student/user profile
GET    /api/v1/users/{id}/posts         -> Get vibes published by user
GET    /api/v1/users/{id}/saved         -> Get saved vibes (owner only)
POST   /api/v1/users/{id}/follow        -> Follow / unfollow student
```

### 2.3 Feed, Posts & Engagement (`/api/v1/posts/`)
```http
GET    /api/v1/feed                     -> Paginated feed (For You / Campus / Following)
POST   /api/v1/posts                    -> Create vibe (Strictly verified students only)
GET    /api/v1/posts/{id}               -> Single post detail
DELETE /api/v1/posts/{id}               -> Delete own post
POST   /api/v1/posts/{id}/like          -> Toggle like
POST   /api/v1/posts/{id}/save          -> Toggle save
POST   /api/v1/posts/{id}/repost        -> Repost vibe
POST   /api/v1/posts/{id}/views         -> Record view duration (>= 4.0s qualifies)
GET    /api/v1/posts/{id}/comments      -> Paginated comment thread
POST   /api/v1/posts/{id}/comments      -> Create comment
POST   /api/v1/media/upload-url         -> Generate presigned S3/R2 upload URL
```

### 2.4 Uni Vibe League (`/api/v1/league/`)
```http
GET    /api/v1/league/season            -> Current active season details (dates, status)
GET    /api/v1/league/leaderboard       -> University standings (rank, PT, active students)
GET    /api/v1/league/highlights        -> Current leader, fastest climber, trending up
GET    /api/v1/league/contributors      -> Top student contributors across universities
GET    /api/v1/league/archive/{year}    -> Historical season archive
```

### 2.5 Universities, Clubs & Events (`/api/v1/universities/`, `/api/v1/clubs/`, `/api/v1/events/`)
```http
GET    /api/v1/universities             -> Search & filter university directory
GET    /api/v1/universities/{id}        -> University profile & departments
POST   /api/v1/universities/requests    -> Request addition of missing university
GET    /api/v1/clubs                    -> Campus clubs directory
GET    /api/v1/clubs/{id}               -> Club details & members
POST   /api/v1/clubs/{id}/join          -> Join / leave club
GET    /api/v1/events                   -> Campus events calendar
GET    /api/v1/events/{id}              -> Event details
POST   /api/v1/events/{id}/rsvp         -> RSVP for event
```

### 2.6 Chat & Real-Time (`/api/v1/chat/`)
```http
GET    /api/v1/chat/conversations       -> Conversation list with last message
GET    /api/v1/chat/{id}/messages       -> Message history
POST   /api/v1/chat/{id}/messages       -> Send message (REST fallback)
WS     /api/v1/ws/chat/{id}             -> WebSocket real-time message stream
```

### 2.7 Notifications & Reports (`/api/v1/notifications/`, `/api/v1/reports/`)
```http
GET    /api/v1/notifications            -> List activity notifications
PUT    /api/v1/notifications/{id}/read  -> Mark single notification read
PUT    /api/v1/notifications/read-all   -> Mark all notifications read
POST   /api/v1/reports                  -> Submit moderation report (post/user/comment)
```
