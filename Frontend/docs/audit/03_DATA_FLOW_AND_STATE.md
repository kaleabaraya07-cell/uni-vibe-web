# Uni Vibe — Data Flow & State Management Audit

> **Scope:** Tracing data provenance, state ownership, action dispatch, and persistence boundaries across all critical user journeys.  
> **Investigation Date:** October 2026  

---

## 1. Global State Architecture Overview

The frontend application uses a multi-layered React Context architecture wrapped around the application in `Frontend/src/App.jsx`:

```text
LocaleProvider (src/context/LocaleContext.jsx)
  └─ AuthProvider (src/context/AuthProvider.jsx)
       └─ FeedProvider (src/context/FeedContext.jsx)
            └─ SeeThroughProvider (src/context/SeeThroughContext.jsx)
                 └─ NotificationProvider (src/context/NotificationContext.jsx)
                      └─ UploadProvider (src/context/UploadContext.jsx)
                           └─ ChatProvider (src/context/ChatContext.jsx)
                                └─ BrowserRouter -> AppLayout -> Pages
```

### Persistence Summary Matrix

| Data Domain | Initial Source | In-Memory State Holder | Storage Mechanism | Survives Route Transition? | Survives Page Refresh? | Connected to HTTP API? |
|---|---|---|---|---|---|---|
| **Auth & Current User** | `data/mockUsers.js` | `AuthProvider` | `localStorage` (`univibe_current_user`) | **Yes** | **Yes** | **No** |
| **Feed Posts (Vibes)** | `data/mockVibes.js` | `FeedContext` | React `useState` | **Yes** | **No** (Resets to mock) | **No** |
| **Likes / Saves / Reposts** | Empty `Set`s | `FeedContext` | React `useState(new Set())` | **Yes** | **No** (Resets to empty) | **No** |
| **Comments** | Hardcoded array in `VibeCard` | Local `useState` in `VibeCard` | Component state | **No** | **No** | **No** |
| **Stories** | `data/mockStories.js` | `Stories.jsx` | Component `useState` | **Yes** (if inside home) | **No** | **No** |
| **Conversations & Chat** | `data/mockChat.js` | `ChatContext` | React `useState` | **Yes** | **No** | **No** |
| **Notifications** | `data/mockNotifications.js` | `NotificationContext` | React `useState` | **Yes** | **No** | **No** |
| **League Leaderboard** | `data/mockRankings.js` | Direct module import in `Rankings.jsx` | Static module memory | **Yes** | **Yes** (Static) | **No** |
| **University Requests** | `data/mockUniversities.js` | Module array `mockUniversityRequests` | In-memory JS array | **Yes** (In-session) | **No** | **No** |
| **Profile Edits** | `data/mockUsers.js` | Direct mutation in `Profile.jsx` | In-memory object mutation | **Yes** (In-session) | **No** | **No** |
| **Language Locale** | `'en'` | `LocaleContext` | React `useState` | **Yes** | **No** (Resets to 'en') | **No** |

---

## 2. Detailed Data Flow Traces

---

### Flow 1: User Login
```text
Login.jsx (Form submit)
  ↓
AuthProvider.login(email, password, rememberMe)
  ↓
Validates against mockUsers / mockCredentials
  ↓
setUser(matchedUser)
  ↓
localStorage.setItem("univibe_current_user", JSON.stringify(user))
  ↓
Navigate to previous route or "/"
```
1. **Initial Data Source:** `Frontend/src/data/mockUsers.js` (`mockCredentials`, `mockUsers`).
2. **State Owner:** `AuthProvider.jsx` (`user` state).
3. **Action Handling:** Form `onSubmit` in `Login.jsx` calls `login(email, password)`.
4. **Where Updates Are Stored:** React state in `AuthProvider` + `localStorage.setItem("univibe_current_user")`.
5. **Survives Refresh:** **Yes**, `AuthProvider` reads from `localStorage` on initial render.
6. **Survives Navigation:** **Yes**.
7. **Connected to API:** **No**.
8. **Endpoint Called:** None.
9. **Request Data:** `{ email, password }`.
10. **Expected Response:** `{ ok: true, user }`.
11. **Loading / Error States:** Error string rendered in `Login.jsx:84`; no network loading state.
12. **Failure Behavior:** Sets `error` state in `Login.jsx`.
13. **Required Backend Changes:** Post credentials to `POST /api/v1/auth/login`, receive `{ access_token, token_type, user }`, store token in secure HTTP-only cookie or memory.

---

### Flow 2: User Registration & Student Branching
```text
SignUp.jsx (Step 1: Account -> Step 2: Campus Profile)
  ↓
SignUp.handleSubmit()
  ↓
AuthProvider.signup({ name, username, email, isStudent, universityId, departmentId, departmentName })
  ↓
Constructs newUser object with verificationStatus: isStudent ? "verified" : "none"
  ↓
setUser(newUser) + localStorage.setItem("univibe_current_user", JSON.stringify(newUser))
  ↓
Navigate to "/"
```
1. **Initial Data Source:** User inputs + `mockUniversities.js` for dropdown options.
2. **State Owner:** `AuthProvider.jsx`.
3. **Action Handling:** `SignUp.jsx:55` collects form fields and calls `signup()`.
4. **Where Updates Are Stored:** React state + `localStorage`.
5. **Survives Refresh:** **Yes**.
6. **Survives Navigation:** **Yes**.
7. **Connected to API:** **No**.
8. **Endpoint Called:** None.
9. **Request Data:** User details, `isStudent`, `universityId`, `departmentId`.
10. **Expected Response:** `{ ok: true, user: newUser }`.
11. **Loading / Error States:** Basic HTML required attributes only.
12. **Failure Behavior:** None implemented.
13. **Required Backend Changes:** Send `POST /api/v1/auth/register`. If student, initiate verification submission (ID upload/edu email) and set status to `pending`, not auto-verified.

---

### Flow 3: Student Verification Check for Post Creation
```text
UploadModal.jsx
  ↓
Reads `user` from `useAuth()`
  ↓
Computes `isVerifiedStudent = Boolean(user?.isStudent && (user?.verified || user?.verificationStatus === "verified"))`
  ↓
If false: Renders `.upload-modal__verification-gate` (blocking form)
If true: Renders vibe creation multi-step wizard
```
1. **Initial Data Source:** `user` object in `AuthProvider.jsx`.
2. **State Owner:** `UploadModal.jsx` (computed memo).
3. **Action Handling:** If not verified, shows gate with a "Switch to Verified Student Demo" button that calls `switchAccount(currentUser)`.
4. **Where Updates Are Stored:** Client-only state.
5. **Survives Refresh:** Dependent on current user stored in `localStorage`.
6. **Survives Navigation:** Yes.
7. **Connected to API:** **No**.
8. **Endpoint Called:** None.
9. **Required Backend Changes:** The FastAPI backend must enforce verification on the `POST /api/v1/posts` endpoint by inspecting `current_user.verification_status == "verified"`.

---

### Flow 4: Feed Loading & Infinite Scroll
```text
Home.jsx
  ↓
VibeFeed.jsx
  ↓
useFeed() in FeedContext.jsx
  ↓
useInfiniteScroll(vibes, 3) (src/hooks/useInfiniteScroll.js)
  ↓
IntersectionObserver triggers sentinelRef -> loadMore()
  ↓
Slices visibleItems from in-memory `vibes` array
```
1. **Initial Data Source:** `Frontend/src/data/mockVibes.js`.
2. **State Owner:** `FeedContext.jsx` holds `vibes`; `useInfiniteScroll` holds `visibleCount`.
3. **Action Handling:** Intersection Observer triggers `setVisibleCount(prev => prev + 3)`.
4. **Where Updates Are Stored:** Component memory.
5. **Survives Refresh:** **No**; resets to initial `mockVibes` array.
6. **Survives Navigation:** Slicing resets when leaving Home and returning.
7. **Connected to API:** **No**.
8. **Endpoint Called:** None.
9. **Required Backend Changes:** Replace client array slice with cursor-based pagination calling `GET /api/v1/feed?cursor=...&limit=10`.

---

### Flow 5: Creating a Vibe (Post) & Media Upload
```text
UploadModal.jsx (File input / Dropzone)
  ↓
handleFileSelection(file) -> URL.createObjectURL(file) -> setPreview(objectUrl)
  ↓
Step 3: User enters caption, university, category
  ↓
handlePublish() -> FeedContext.addVibe(newVibe)
  ↓
setVibes(prev => [newVibe, ...prev])
  ↓
UploadModal closes; navigate to "/feed"
```
1. **Initial Data Source:** Local file input or Unsplash fallback.
2. **State Owner:** `UploadModal` local state -> transferred to `FeedContext.vibes`.
3. **Action Handling:** `UploadModal.jsx:55` constructs `newVibe` object and calls `addVibe()`.
4. **Where Updates Are Stored:** In-memory array inside `FeedContext.jsx`.
5. **Survives Refresh:** **No**. The new post disappears completely upon reload. Furthermore, the `blob:` object URL becomes invalid upon reload or tab close.
6. **Survives Navigation:** Yes, during the current browser session.
7. **Connected to API:** **No**.
8. **Endpoint Called:** None.
9. **Memory Leak:** `URL.revokeObjectURL(objectUrl)` is never called.
10. **Required Backend Changes:**
    - Request presigned S3/R2 upload URL via `POST /api/v1/media/upload-url`.
    - Upload binary file to object storage via HTTP `PUT`.
    - Submit post metadata via `POST /api/v1/posts` with `{ media_url, caption, university_id, category }`.

---

### Flow 6: Post Engagement (Liking, Saving, Reposting)
```text
VibeCard.jsx (Click heart / bookmark / repeat)
  ↓
FeedContext.toggleLike(vibe.id) / toggleSave(vibe.id) / toggleRepost(vibe.id)
  ↓
FeedContext updates Set (liked / saved / reposted)
  ↓
FeedContext updates vibes array: likes + 1, saves + 1, reposts + 1
```
1. **Initial Data Source:** Initial counts in `mockVibes.js`.
2. **State Owner:** `FeedContext.jsx` (Sets: `liked`, `saved`, `reposted`).
3. **Action Handling:** Callbacks in `FeedContext.jsx:15-61`.
4. **Where Updates Are Stored:** React state in `FeedContext`.
5. **Survives Refresh:** **No**. All user interactions reset to empty Sets on reload.
6. **Survives Navigation:** Yes, during active session.
7. **Connected to API:** **No**.
8. **Required Backend Changes:**
    - Like: `POST /api/v1/posts/{id}/like` (toggle).
    - Save: `POST /api/v1/posts/{id}/save` (toggle).
    - Repost: `POST /api/v1/posts/{id}/repost`.
    - Backend asynchronously recalculates Post PT and university seasonal score.

---

### Flow 7: Adding a Comment
```text
VibeCard.jsx (Click comment icon)
  ↓
Opens comments bottom sheet
  ↓
User types in input -> setCommentText()
  ↓
User clicks Send -> handleAddComment()
  ↓
setCommentCount(prev => prev + 1)
setCommentText("")
```
1. **Initial Data Source:** `demoComments` hardcoded inside `VibeCard.jsx:60-66`.
2. **State Owner:** `VibeCard.jsx` local state (`commentCount`, `commentText`).
3. **Action Handling:** `VibeCard.jsx:68-72`.
4. **Where Updates Are Stored:** Discarded! The comment text is never added to `demoComments` or `FeedContext`. Only the local number `commentCount` increments.
5. **Survives Refresh:** **No**.
6. **Connected to API:** **No**.
7. **Required Backend Changes:** Call `POST /api/v1/posts/{id}/comments` with `{ text }`, append returned comment to thread list.

---

### Flow 8: Opening University Campus Profile
```text
User clicks University link in Navbar / Sidebar / Card
  ↓
Navigates to `/university/:id`
  ↓
University.jsx reads id from `useParams()`
  ↓
getUniversityById(id) from `data/mockUniversities.js`
  ↓
Filters mockVibes, mockEvents, mockClubs by universityId
  ↓
Renders campus stats and tabs
```
1. **Initial Data Source:** `Frontend/src/data/mockUniversities.js`.
2. **State Owner:** None (pure functional render from static mock data).
3. **Survives Refresh:** Yes (reads ID from URL).
4. **Connected to API:** **No**.
5. **Required Backend Changes:** Call `GET /api/v1/universities/{id}` to fetch campus metadata, departments, clubs, verified stats, and season PT.

---

### Flow 9: Requesting a Missing University
```text
SignUp.jsx (Click "My university isn't listed")
  ↓
Opens Modal -> User inputs Name, Location, Website
  ↓
handleUniversityRequest()
  ↓
mockUniversityRequests.push({ id, name, location, website, applicantEmail, status: "pending" })
  ↓
Modal shows success checkmark and auto-closes after 1800ms
```
1. **Initial Data Source:** Form inputs in `SignUp.jsx`.
2. **State Owner:** Module-level array `mockUniversityRequests` in `mockUniversities.js`.
3. **Action Handling:** Direct push to imported JavaScript array.
4. **Survives Refresh:** **No**. The pushed request disappears upon reload.
5. **Connected to API:** **No**.
6. **Required Backend Changes:** Submit `POST /api/v1/universities/requests` to record request in PostgreSQL for administrative review in `admin_web`.

---

### Flow 10: League Leaderboard & Scoring
```text
Rankings.jsx mounts
  ↓
Directly reads `CURRENT_SEASON`, `mockLeagueLeaderboard`, `mockTopContributors` from `mockRankings.js`
  ↓
Renders table and cards
```
1. **Initial Data Source:** `Frontend/src/data/mockRankings.js`.
2. **State Owner:** Static module data.
3. **Action Handling:** Client tab switching (`selectedTab: "all" | "my-uni" | "contributors"`).
4. **Connected to API:** **No**.
5. **Required Backend Changes:** Call `GET /api/v1/league/leaderboard?season=2026` and `GET /api/v1/league/contributors?season=2026`. The frontend must NEVER calculate authoritative PT.

---

### Flow 11: Sending a Chat Message
```text
ChatRoom.jsx
  ↓
User enters message and clicks Send
  ↓
ChatContext.sendMessage(conversationId, text)
  ↓
setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMsg] } : c))
```
1. **Initial Data Source:** `Frontend/src/data/mockChat.js`.
2. **State Owner:** `ChatContext.jsx`.
3. **Action Handling:** `ChatRoom.jsx:21` calls `sendMessage()`.
4. **Where Updates Are Stored:** In-memory `conversations` array.
5. **Survives Refresh:** **No**.
6. **Connected to API:** **No**.
7. **Required Backend Changes:** Send `POST /api/v1/chat/{id}/messages` or broadcast over a WebSocket connection at `ws://api.../ws/chat/{id}`.

---

### Flow 12: Marking Notifications as Read
```text
Notifications.jsx (Click "Mark all as read")
  ↓
NotificationContext.markAllRead()
  ↓
setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  ↓
unreadCount recomputes to 0; Navbar bell badge hides
```
1. **Initial Data Source:** `Frontend/src/data/mockNotifications.js`.
2. **State Owner:** `NotificationContext.jsx`.
3. **Survives Refresh:** **No**. All notifications reset to their default unread state on reload.
4. **Connected to API:** **No**.
5. **Required Backend Changes:** Call `PUT /api/v1/notifications/read-all`.
