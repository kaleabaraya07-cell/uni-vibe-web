# Uni Vibe — Backend Integration Readiness Report

> **Target Backend:** Python / FastAPI + PostgreSQL + Redis / S3 Object Storage  
> **Investigation Date:** October 2026  
> **Current Integration Readiness Score:** **1.5 / 5.0 (Early Preparation / High Gaps)**  

---

## 1. API Infrastructure Inventory & Gap Analysis

| Component | File Path | Current Status | Current Behavior & Deficiencies | Action Required for FastAPI |
|---|---|---|---|---|
| **HTTP Client** | `src/services/apiClient.js` | **Placeholder only** | 14-line `fetch` wrapper. Defaults to `http://localhost:3000/api/v1`. Hardcodes `Content-Type: application/json`. Does not attach Bearer tokens. Does not parse JSON error bodies. | Rewrite with Axios or custom fetch wrapper supporting Bearer auth injection, 401 token refresh interceptor, AbortController timeouts, and multipart/form-data. |
| **API Base URL** | `src/services/apiClient.js`, `.env.example` | **Partially implemented** | Reads `import.meta.env.VITE_API_URL`. Default is localhost:3000 (Node style) rather than FastAPI standard (localhost:8000). `.env.example` has placeholder `https://your-api.onrender.com/api/v1`. | Update `.env.example` to default to `http://localhost:8000/api/v1`. |
| **Request Interceptors** | *None* | **Missing** | No request middleware exists. | Implement auth token attachment and request tracking IDs. |
| **Response & Error Normalization** | `src/services/apiClient.js:9` | **Placeholder only** | `if (!res.ok) throw new Error("API error: " + res.status);`. Completely discards FastAPI's standard `{ detail: "..." }` validation error response. | Extract and throw structured API exceptions containing status code and error messages. |
| **Token Handling** | `src/context/AuthProvider.jsx` | **Simulated / Deficient** | Stores whole user JSON in `localStorage`. Emits hardcoded string `"mock-jwt-token"` in untracked `authService.js`. No token decoding, expiration check, or refresh rotation. | Implement standard OAuth2 Bearer token storage (or HTTP-only secure cookie sessions). |
| **Request Cancellation** | *None* | **Missing** | Zero `AbortController` or cancellation tokens in any service or hook. | Add `signal` pass-through to API calls to prevent race conditions during rapid navigation. |
| **Pagination Helpers** | `src/hooks/useInfiniteScroll.js` | **Client-only** | Slices local in-memory JavaScript array. | Implement cursor-based pagination hook that calls FastAPI with `cursor` or `page` and appends results. |
| **File Upload Preparation** | `src/components/UploadModal/UploadModal.jsx` | **Deficient / Memory Leak** | Uses `URL.createObjectURL(file)` directly without `FormData`, size limits, MIME type validation, or `URL.revokeObjectURL()`. | Implement presigned S3/R2 direct upload flow or `multipart/form-data` endpoint. |
| **Retry Behavior** | *None* | **Missing** | Zero retry logic on network failure. | Implement exponential backoff for idempotent GET requests. |
| **Mock-to-Real API Switch** | *None* | **Missing** | Services contain hardcoded mock delays (`setTimeout`). No environment flag (e.g. `VITE_USE_MOCK_API`) exists to toggle between mocks and live endpoints. | Implement an adapter pattern or toggle flag in services to enable staged backend onboarding. |

---

## 2. Services Layer Evaluation (`Frontend/src/services/`)

The repository contains 10 newly created service files in `Frontend/src/services/`. These files were drafted as untracked files and are currently **completely disconnected from the React UI components**.

### 2.1 `apiClient.js`
- **Lines:** 14
- **Exports:** `apiClient`, `default apiClient`
- **Audit Findings:**
  - Hardcodes `Content-Type: application/json`. If a user attempts to pass a `FormData` object for file uploads, this hardcoded header will corrupt the multipart boundary and cause the backend parser to fail.
  - Does not read or inject authorization tokens from storage.
  - Ignores error response payloads from the server.
- **Verdict:** Unusable in production without substantial refactoring.

### 2.2 `authService.js`
- **Lines:** 72
- **Exports:** `authService`, `default authService`
- **Methods:** `login(email, password)`, `signup(params)`, `getCurrentUser()`, `logout()`
- **Audit Findings:**
  - Implements mock delay `await new Promise((r) => setTimeout(r, 300))`.
  - Line 26: `password` argument is unused in `signup()`, generating an ESLint compilation error.
  - Returns hardcoded `"mock-jwt-token"`.
  - Sets `verificationStatus: isStudent ? "pending" : "none"` (unlike `AuthProvider.jsx` which sets `"verified"`).
- **Verdict:** Usable as a contract blueprint for FastAPI OAuth2 password flow (`/api/v1/auth/token`).

### 2.3 `postService.js`
- **Lines:** 83
- **Exports:** `postService`, `default postService`
- **Methods:** `getFeedPosts()`, `getPostById()`, `createPost()`, `toggleLike()`, `repost()`, `toggleSave()`, `getStories()`
- **Audit Findings:**
  - Line 30 enforces business rule: `if (!currentUser?.isStudent || currentUser?.verificationStatus !== "verified") throw new Error(...)`.
  - Modifies in-memory `mockVibes` array.
  - Never imported or called by `FeedContext.jsx` or `Home.jsx` (the import in `FeedContext.jsx:4` is an unused variable).
- **Verdict:** Strong contract foundation. Readily translates to FastAPI `/api/v1/posts/*`.

### 2.4 `rankingService.js`
- **Lines:** 45
- **Exports:** `rankingService`, `default rankingService`
- **Methods:** `getSeasonInfo()`, `getLeaderboard()`, `getLeagueHighlights()`, `getTopContributors()`, `getUserLeagueInfo()`, `calculatePT()`
- **Audit Findings:**
  - Line 34: `_userId` is unused, triggering an ESLint error.
  - Exposes `calculatePT(metrics)` on the client. As established in the product rules, the client must never be authoritative for scoring.
- **Verdict:** The `calculatePT()` method should be removed from client services and confined strictly to the backend Python engine. The retrieval methods provide a clean contract for FastAPI.

### 2.5 `universityService.js`
- **Lines:** 60
- **Exports:** `universityService`, `default universityService`
- **Methods:** `getUniversities()`, `getUniversityById()`, `getDepartmentsByUniversity()`, `getDepartmentById()`, `getClubsByUniversity()`, `getClubById()`, `submitUniversityRequest()`
- **Audit Findings:**
  - Line 3: `mockDepartments` import is unused, triggering an ESLint error.
  - Provides CRUD abstractions for university discovery and directory requests.
- **Verdict:** Ready for conversion to FastAPI `/api/v1/universities/*`.

### 2.6 `profileService.js`
- **Lines:** 40
- **Exports:** `profileService`, `default profileService`
- **Methods:** `getProfile()`, `updateProfile()`, `getUserPosts()`, `getUserSavedPosts()`, `getUserLikedPosts()`
- **Audit Findings:**
  - Lines 27 & 33: `_userId` arguments are unused in `getUserSavedPosts` and `getUserLikedPosts`, triggering ESLint errors.
- **Verdict:** Matches required user endpoints on FastAPI.

### 2.7 `messageService.js`
- **Lines:** 41
- **Exports:** `messageService`, `default messageService`
- **Methods:** `getConversations()`, `getConversationById()`, `sendMessage()`
- **Audit Findings:**
  - Pure in-memory array manipulation on `mockChat.js`.
  - Does not support real-time socket connections.
- **Verdict:** Suitable for REST fallback, but inadequate for real-time messaging without WebSocket client scaffolding.

### 2.8 `eventService.js` & `notificationService.js`
- **Lines:** 22 & 29
- **Exports:** `eventService`, `notificationService`
- **Audit Findings:**
  - Clean, minimal mock service wrappers.
- **Verdict:** Ready for FastAPI mapping.

---

## 3. Real-Time Capabilities Readiness

| Real-Time Feature | Product Requirement | Existing Frontend Scaffolding | Verdict |
|---|---|---|---|
| **Direct Chat Messaging** | Instant bi-directional messaging between students | `ChatContext.jsx` appends messages to React state. Zero WebSockets (`ws://`), zero Server-Sent Events (SSE), zero polling. | **No real-time preparation exists.** |
| **Live Notifications** | Real-time alerts for likes, comments, and League movements | `NotificationContext.jsx` holds static mock list. Zero polling or socket listeners. | **No real-time preparation exists.** |
| **Campus Live Events** | Live video streaming with viewer presence counter | `Live.jsx` displays static thumbnail cards. "Join" button has no click handler. Zero WebRTC, HLS, or presence socket code. | **No live media preparation exists.** |
| **League Live Score (LiveScore)** | Live updates to inter-university standings | `Rankings.jsx` displays a static badge `<span className="league-live-tag">LIVE</span>` with zero network polling or socket subscription. | **Simulated UI only.** |

### Real-Time Recommendation for FastAPI:
1. **MVP Phase:** Use standard short-polling (e.g. 15s interval via `useQuery` or `useEffect`) for notifications and leaderboard updates. This avoids the operational complexity of managing persistent socket state across server restarts.
2. **Phase 2 (Chat):** Implement FastAPI WebSockets (`@app.websocket("/api/v1/ws/chat/{conv_id}")`) backed by a Redis Pub/Sub channel for horizontal scalability.

---

## 4. File & Media Upload Readiness

### Current Behavior:
1. In `UploadModal.jsx` and `Stories.jsx`, users select a local image or video file via `<input type="file">` or drag-and-drop.
2. The browser generates an ephemeral local pointer: `const objectUrl = URL.createObjectURL(file);`.
3. The local blob URL is assigned directly to the post's `media` property.
4. **Failure Modes:**
   - Blob URLs exist only in the memory of the current browser tab. If the tab is reloaded or opened on another device, the media link breaks immediately (`ERR_FILE_NOT_FOUND`).
   - `URL.revokeObjectURL()` is never invoked, creating a memory leak whenever files are uploaded.
   - Zero client validation on file size (a user can select a 2GB 4K video file without warning).
   - Zero client validation on video duration.

### Required Architecture for FastAPI:
Direct multi-gigabyte video uploads through Python/FastAPI worker threads must be avoided to prevent worker starvation.
```text
Frontend                         FastAPI Backend                  S3 / Cloudflare R2
   |                                    |                                 |
   |--- 1. POST /api/v1/media/upload -->|                                 |
   |    (filename, size, mime_type)     |--- 2. Generate Presigned URL -->|
   |<-- 3. Return presigned PUT URL ----|                                 |
   |                                                                      |
   |--- 4. Direct HTTP PUT (binary file) -------------------------------->|
   |                                                                      |
   |--- 5. POST /api/v1/posts (media_url, caption, university_id) ------->|
   |<-- 6. Return created Post object ------------------------------------|
```
