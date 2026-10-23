# Uni Vibe — Page-by-Page Functionality & Feature Audit

> **Scope:** Full inventory of all discovered routes, major screens, interactive controls, and architectural edges.  
> **Investigation Date:** October 2026  

---

## 1. Route & Feature Inventory Table

Status Definitions:
- **Complete:** The intended functionality is implemented and verified to the extent practical.
- **Mostly complete:** The primary flow works, with identifiable gaps.
- **Partial:** Some functionality exists, but the user journey is incomplete.
- **UI only:** The interface exists, but meaningful behavior is missing or simulated.
- **Mock only:** The feature operates on mock data without real persistence or backend integration.
- **Broken:** A verified defect prevents the intended behavior.
- **Missing:** The required feature or page was not found in the codebase.
- **Not verified:** Insufficient evidence to establish functionality.

| Route | Page / Feature | Main Files | Current Implementation | Data Source | User Interactions | Backend Dependency | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| `/login` | Authentication / Login | `pages/Login/Login.jsx`, `Login.css`, `AuthProvider.jsx` | Form with email/password, demo button, simulated forgot password | `mockUsers.js` (`mockCredentials`), `localStorage` | Login submit, demo login click, remember me checkbox, forgot password toggle | User authentication, password hashing, JWT issue, session cookies | **Mock only** | `Login.jsx:25` calls `login(email, password)`; `AuthProvider.jsx:31-55` checks hardcoded `demo@univibe.com` / `demo123`. |
| `/signup` | User Registration & Student Branching | `pages/SignUp/SignUp.jsx`, `SignUp.css`, `AuthProvider.jsx` | 2-step form: Account details -> Student status question -> University/dept select -> Request missing uni modal | `mockUniversities.js`, `mockDepartments` | Step progression, student toggle, university dropdown, custom dept input, missing uni modal submit | Account creation, verification request submission, university directory lookup | **Mostly complete** | `SignUp.jsx:161-260` branches on `isStudent`; `SignUp.jsx:81` pushes to `mockUniversityRequests`; `AuthProvider.jsx:80-105` stores user in `localStorage`. |
| `/` | Home Campus Feed | `pages/Home/Home.jsx`, `components/Stories/Stories.jsx`, `components/VibeFeed/VibeFeed.jsx`, `components/VibeCard/VibeCard.jsx` | Renders `Stories` row + infinite scroll `VibeFeed` in 3-column layout | `mockVibes.js`, `mockStories.js`, `FeedContext.jsx` | Story viewing, liking, saving, reposting, sharing, comment modal, SeeThrough modal | Feed generation algorithm, story delivery, post interaction persistence | **Mock only** | `Home.jsx:8-12` mounts `Stories` & `VibeFeed`; `FeedContext.jsx:9` loads `mockVibes`; refreshing resets all counts. |
| `/feed` | Dedicated Feed View | `pages/Feed/Feed.jsx` | Identical to Home feed but without stories bar | `FeedContext.jsx` | Same as Home feed | Same as Home feed | **Mock only** | `Feed.jsx:5` renders `<VibeFeed />` alone. Redundant route with `/`. |
| `/live` | Campus Live Streams | `pages/Live/Live.jsx`, `Live.css` | Grid of live campus broadcast cards with viewer counts | `mockOpportunities.js` (`mockLiveStreams`) | "Join" button rendered | WebRTC / HLS streaming server, live chat, viewer presence | **UI only** | `Live.jsx:27`: `<button className="live-card__join">{t("live.join")}</button>` has no `onClick` handler. Clicking does nothing. |
| `/search` | Global Search | `pages/Search/Search.jsx`, `Search.css`, `SearchBar/SearchBar.jsx` | Search input with 5 tabs: Vibes, People, Universities, Clubs, Events | `mockVibes.js`, `mockUsers.js`, `mockUniversities.js`, `mockEvents.js` | Text search, tab switching, clicking result link | Full-text search engine (PostgreSQL tsvector / Elasticsearch), ranking | **Partial** | `Search.jsx:26-32` executes `.filter(includes)` on in-memory arrays. Clicking a vibe result navigates to `/feed` instead of a post detail view. |
| `/profile/:id` | Student & User Profile | `pages/Profile/Profile.jsx`, `Profile.css`, `ProfileHeader/ProfileHeader.jsx` | Cover image, avatar, bio, League contribution card, university badge, tabs (Posts, Saved, Liked, Media), Edit Profile modal | `mockUsers.js`, `mockVibes.js`, `FeedContext.jsx` | Tab switching, follow toggle, Edit Profile modal form | User profile API, follow graph, personal League points aggregation | **Partial** | `Profile.jsx:35` resolves user via `getUserById(id)`; `Profile.jsx:69-73` directly mutates `user.name = editName` in memory; 6 unused variables cause ESLint errors. |
| `/university/:id` | University Campus Profile | `pages/University/University.jsx`, `Entity.css` | Cover, population, ranking, tabs for Vibes, Events, Clubs, Rankings | `mockUniversities.js`, `mockVibes.js`, `mockEvents.js` | Tab switching | University directory API, campus feed, official announcements, league totals | **Partial** | `University.jsx:44` renders non-clickable `<img>` tags for vibes; events and clubs render bare unlinked text; no department directory list. |
| `/department/:id` | Department Page | `pages/Department/Department.jsx`, `Entity.css` | Department head name, student member list, events | `mockUniversities.js`, `mockUsers.js`, `mockEvents.js` | Viewing static list | Department directory API, student rosters, faculty announcements | **UI only** | `Department.jsx:20-25` renders avatars with names but without links to user profiles; events are unlinked text strings. |
| `/club/:id` | Campus Club Page | `pages/Club/Club.jsx`, `Entity.css` | Cover, member count, description, events, "Join" button | `mockUniversities.js` (`mockClubs`), `mockEvents.js` | "Join" button toggles local boolean state | Club membership management, officer roles, club post feed | **UI only** | `Club.jsx:13` uses `useState(false)` for `joined`. State is destroyed on route change or refresh. |
| `/event/:id` | Campus Event Page | `pages/Event/Event.jsx`, `Entity.css` | Date, time, location, RSVP count, description, "RSVP" button, related vibes | `mockEvents.js`, `mockVibes.js` | "RSVP" button toggles local boolean state | Event ticketing/registration, calendar sync, attendee tracking | **UI only** | `Event.jsx:13` uses `useState(false)` for `attending`; related vibes rendered as raw non-clickable `<img>` tags. |
| `/rankings` | Uni Vibe League Standings | `pages/Rankings/Rankings.jsx`, `Rankings.css`, `mockRankings.js` | Annual Season banner, highlights (Leader, Climber, Trending), full university leaderboard, personal uni spotlight, top contributors, formula explainer | `mockRankings.js` | Tab switching (All, My Uni, Contributors), Inspect Formula toggle | Server-side PT calculation engine, historical season archiving, tamper-proof leaderboards | **Mostly complete (UI)** | `Rankings.jsx:165-254` renders complete leaderboard; `Rankings.jsx:392-409` leaks raw math formula into UI in violation of product requirements; 4 ESLint errors. |
| `/saved` | Saved Vibes Collection | `pages/Saved/Saved.jsx`, `Saved.css` | Grid of saved vibes | `FeedContext.jsx` (`getSavedVibes()`) | Viewing saved vibe cards | User bookmarks/saves database table | **Partial** | `Saved.jsx:8` reads from in-memory Set in `FeedContext`. Refreshing page empties the saved list. |
| `/chat` | Messages & Channels Inbox | `pages/Chat/Chat.jsx`, `Chat.css` | List of conversations with avatar, last message, timestamp, unread badge | `ChatContext.jsx` (`mockChat.js`) | Clicking conversation navigates to `/chat/:id`, search input | WebSocket server, persistent message storage, unread count tracking | **UI only** | `Chat.jsx:20` search input has no event handler; category chips (Pinned, Groups, etc.) have no filter logic. |
| `/chat/:id` | Private Message Thread | `pages/ChatRoom/ChatRoom.jsx`, `ChatRoom.css`, `components/ChatBubble/ChatBubble.jsx` | Message bubbles (incoming/outgoing), text input, attachment buttons | `ChatContext.jsx` | Typing text and submitting appends to local conversation array | Real-time bi-directional messaging, media attachments, read receipts | **Mock only** | `ChatRoom.jsx:23` calls `sendMessage(id, text)`; Smile, Paperclip, Mic buttons have no handlers. Resets on refresh. |
| `/notifications` | Activity Notifications | `pages/Notifications/Notifications.jsx`, `Notifications.css` | List of alerts (likes, comments, follows, ranking movements, events) | `NotificationContext.jsx` (`mockNotifications.js`) | "Mark all as read" button | Push notification infrastructure, notification persistence | **Mock only** | `Notifications.jsx:19` marks all read in memory; state is lost on refresh. |
| `/opportunities` | Student Jobs & Scholarships | `pages/Opportunities/Opportunities.jsx`, `Opportunities.css` | Coming-soon landing banner, priority waitlist form, 3 category preview cards | Local static array (`upcomingCategories`) | Entering email and clicking "Join Priority Waitlist" | Job board API, applicant tracking, recruiter verification | **UI only (Waitlist)** | `Opportunities.jsx:57-61` sets `submitted = true` without storing the submitted email anywhere; ignores `mockOpportunities.js`; 3 ESLint errors. |
| `/settings` | User Account & Preferences | `pages/Settings/Settings.jsx`, `Settings.css` | Account summary, language switcher (English/Amharic), privacy toggles, notification toggles, Logout button | `useAuth()`, `useLocale()` | Language selection changes locale, Logout clears auth | User settings sync, 2FA management, password changes, push token registry | **Partial** | Language switcher works; privacy and notification toggles are static `<label>` elements without checkboxes or handlers; Logout clears localStorage. |
| `/upload` | Direct Upload Route | `pages/Upload/Upload.jsx` | Triggers global `openUpload()` and returns `null` | `UploadContext.jsx` | Opens `UploadModal` overlay | Media ingestion pipeline, presigned URLs, transcode workers | **Broken** | `Upload.jsx:11` returns `null`. If a user lands directly on `/upload` and dismisses the modal, they see a completely blank page. |
| `/post/:id` | Single Post Detail View | *None* | *None* | *None* | *None* | Post retrieval by ID, deep linking, SEO meta tags | **Missing** | No route or component exists for viewing a single vibe in isolation. |
| `/universities` | University Directory | *None* | *None* | *None* | *None* | Searchable, filterable directory of all approved institutions | **Missing** | Left sidebar links directly to `/university/uni1` because no directory route exists. |
| `/clubs` | Campus Clubs Directory | *None* | *None* | *None* | *None* | Inter-campus club discovery and search | **Missing** | Left sidebar links directly to `/club/club1` because no directory route exists. |
| `/events` | Campus Events Directory | *None* | *None* | *None* | *None* | Campus event calendar and discovery | **Missing** | Right sidebar "View all events" links directly to `/event/ev1`. |
| `*` | 404 Fallback | `pages/NotFound/NotFound.jsx`, `NotFound.css` | Displays "404", message, and "Go Home" button | None | Navigates to `/` | None | **Complete** | Standard catch-all route. |

---

## 2. In-Depth Component & Flow Analysis

### 2.1 The Overprotected Route Defect
In `Frontend/src/App.jsx` (lines 48–72), `<ProtectedRoute>` wraps all major routes:
```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Home />} />
  <Route path="feed" element={<Feed />} />
  <Route path="live" element={<Live />} />
  <Route path="search" element={<Search />} />
  <Route path="profile/:id" element={<Profile />} />
  <Route path="university/:id" element={<University />} />
  <Route path="department/:id" element={<Department />} />
  <Route path="club/:id" element={<Club />} />
  <Route path="event/:id" element={<Event />} />
  <Route path="rankings" element={<Rankings />} />
  <Route path="saved" element={<Saved />} />
  <Route path="chat" element={<Chat />} />
  <Route path="chat/:id" element={<ChatRoom />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="opportunities" element={<Opportunities />} />
  <Route path="settings" element={<Settings />} />
  <Route path="upload" element={<Upload />} />
</Route>
```
**Implication:**
- Uni Vibe's product vision emphasizes that prospective students, parents, and campus explorers can discover university culture, view rankings, and explore universities.
- Currently, if `isAuthenticated === false`, visiting `/` or `/rankings` or `/university/uni1` results in an immediate redirect to `/login`.
- The only reason this is not immediately obvious in the prototype is that `AuthProvider.jsx` (lines 14) automatically logs the visitor in as `currentUser` (Kalab Araya). Once a user clicks "Logout" in Settings, the entire platform becomes inaccessible until they log back in.

### 2.2 Navigation Hardcoding
In `Frontend/src/data/mockData.js` (lines 47–55):
```javascript
export const navItems = [
  { id: "home", label: "Home", icon: "Home", path: "/" },
  { id: "live", label: "Live Events", icon: "Radio", path: "/live" },
  { id: "universities", label: "Universities", icon: "Building2", path: "/university/uni1" },
  { id: "clubs", label: "Clubs", icon: "Users", path: "/club/club1" },
  { id: "opportunities", label: "Opportunities", icon: "Megaphone", path: "/opportunities" },
  { id: "ranking", label: "Ranking", icon: "Trophy", path: "/rankings" },
  { id: "saved", label: "Saved", icon: "Bookmark", path: "/saved" },
];
```
- Clicking "Universities" always navigates to `uni1` (EPSU).
- Clicking "Clubs" always navigates to `club1` (Tech Innovators Club).
- In `RightSidebar.jsx` (line 44), `<Link to="/event/ev1" className="view-all-events">` hardcodes event 1 for "View all events".

### 2.3 Media Playback Limitation
In `Frontend/src/components/VibeCard/VibeCard.jsx` (line 126):
```jsx
<img src={media} alt="" className="vibe-card__media" />
```
- No `<video>` HTML element or custom video player exists in `VibeCard.jsx`.
- When `vibe.type === "video"` (e.g. `v2` or `v6`), the card still renders a static `<img>` displaying an Unsplash photograph.
- As a consequence, watch time is neither tracked nor simulated, and the rule requiring a 4-second minimum watch duration to register a "valid view" for League PT cannot be evaluated.

### 2.4 Mathematical Formula Exposure in UI
In `Frontend/src/pages/Rankings/Rankings.jsx` (lines 392–409):
```jsx
{showFormulaDetails && (
  <div className="formula-deep-dive">
    <h4>Official Post PT Formula</h4>
    <pre className="formula-code">
{`PostPT = [ Like Rate + (Save Rate × 5) + (Repost Rate × 5) ]
         × [ sqrt(V) / (sqrt(V) + sqrt(1000)) ]
         × 0.01

Where:
• V = Valid Views (>= 4s watch time)
• Like Rate   = (Likes / V) × 100
• Save Rate   = (Saves / V) × 100
• Repost Rate = (Reposts / V) × 100

University PT = Sum of all qualifying Post PT within Season 2026`}
    </pre>
  </div>
)}
```
- Product Requirement (Section 3.5): *"The mathematical formula must not appear on the user-facing LiveScore or League page. The UI should explain the scoring system in understandable language."*
- The current implementation directly violates this requirement by offering an expandable raw code block displaying the full formula.

### 2.5 Dead Links and Placeholders
1. **Footer Legal Links (`Login.jsx:137-139`):** `<a href="#terms">Terms of Service</a>` and `<a href="#privacy">Privacy Policy</a>` are anchor hash stubs with no target elements.
2. **VibeCard Context Menu (`VibeCard.jsx:198-206`):** Clicking "Interested", "Not Interested", "Hide Post", "Save to Collection", "Report", "Block User", or "Mute User" only invokes `closeMenu()`. No state change, filtering, or reporting action occurs.
3. **Live Stream Join (`Live.jsx:27`):** The "Join" button has no click handler.
4. **Chat Search & Filters (`Chat.jsx:20-27`):** The search bar and category chips are non-functional visual placeholders.
5. **Settings Toggles (`Settings.jsx:45-57`):** "Private account", "Two-factor enabled", "Push notifications", "Dark mode", "Language updates", and "Download offline" are bare `<label>` text elements without `<input type="checkbox">` controls.
