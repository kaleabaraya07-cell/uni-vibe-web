# Uni Vibe — Security, Authorization & Data Integrity Review

> **Scope:** Audit of client-side trust assumptions, security boundaries, authentication risks, media validation, League competition integrity, and anti-abuse architecture.  
> **Investigation Date:** October 2026  

---

## 1. Client-Side Trust Assumptions vs. Real Security Boundaries

> [!WARNING]
> In its current prototype form, **the frontend enforces virtually all business rules and permission barriers entirely in client JavaScript**.
> In web architecture, client-side checks exist purely for user experience (UX) feedback. Any user with a browser DevTools console or an HTTP client (like cURL or Postman) can bypass client restrictions entirely.
> When the Python/FastAPI backend is introduced, **every single boundary below must be independently enforced on the server**.

---

### 1.1 Student-Only Post Creation
- **Current Frontend State:**
  - `UploadModal.jsx:46` calculates:
    ```javascript
    const isVerifiedStudent = Boolean(user?.isStudent && (user?.verified || user?.verificationStatus === "verified"));
    ```
  - If `isVerifiedStudent === false`, `UploadModal.jsx` renders a visual `<div className="upload-modal__verification-gate">` to block the UI form.
  - Furthermore, `UploadModal` includes a bypass button: "Switch to Verified Student Demo", which immediately logs the user in as `currentUser` (Kalab Araya).
- **Security Vulnerability:** A non-student or unverified user could easily call the API directly if the backend relied on the frontend to filter posting privileges.
- **Backend Requirement:**
  ```python
  # FastAPI Dependency
  def require_verified_student(current_user: User = Depends(get_current_user)):
      if not current_user.is_student or current_user.verification_status != VerificationStatus.VERIFIED:
          raise HTTPException(
              status_code=status.HTTP_403_FORBIDDEN,
              detail="Only verified university students are authorized to publish vibes."
          )
      return current_user
  ```

---

### 1.2 Student Verification Lifecycle & Integrity
- **Current Frontend State:**
  - In `SignUp.jsx`, selecting "Yes, I'm a Student" triggers `signup()` in `AuthProvider.jsx`.
  - In `AuthProvider.jsx:89-90`:
    ```javascript
    verificationStatus: isStudent ? "verified" : "none",
    verified: Boolean(isStudent),
    ```
  - Any user can claim to be a student of any university (e.g. EPSU or AAU) with zero verification, zero ID upload, and zero confirmation, immediately receiving verified status.
- **Security Vulnerability:** Identity fraud, unauthorized campus representation, and fake posting under university names.
- **Backend Requirement:**
  - Initial student status must be locked to `"pending"`.
  - The user must submit a verification package (`document_image_url`, `student_id_number`, and optionally an institutional `@*.edu.et` email).
  - The backend must provide a manual administrative review workflow (via `admin_web`) or automated domain verification before promoting `verification_status` to `"verified"`.

---

### 1.3 University Addition Integrity
- **Current Frontend State:**
  - In `SignUp.jsx:78-98`, users can click "My university isn't listed" and submit a request.
  - The request is currently appended to an in-memory array `mockUniversityRequests`.
- **Integrity Requirement:**
  - A user-submitted university must never automatically become an active, authoritative directory entry.
  - The backend must store university addition requests in a separate `university_requests` table with status `"pending"`. Only platform administrators in `admin_web` can review, approve, and assign official university IDs and season ranking records.

---

### 1.4 League Competition & Scoring Integrity

The Uni Vibe League is designed as an official, inter-collegiate competition where institutions and individual students compete for seasonal championships. Consequently, **the League is a high-value target for manipulation, botting, and engagement fraud**.

#### A. The Client PT Exposure Risk
- In `mockRankings.js:31-42`, the scoring algorithm is written in client-side JavaScript (`calculatePostPT`).
- In `rankingService.js:39`, the service exports `calculatePT(metrics)` to the frontend.
- In `Rankings.jsx:396-407`, the UI displays the exact mathematical formula in a code block.
- **Threat Vector:** If the frontend is ever permitted to compute, increment, or submit `PT` values to the backend, malicious actors could forge HTTP requests claiming thousands of points for their university.
- **Security Rule:**
  1. The client must NEVER submit `PT` to the server.
  2. The server must be the **sole authoritative calculator** of Post PT, Student PT, and University Season PT.
  3. The formula must be evaluated asynchronously in the backend (via background worker tasks, e.g. Celery / ARQ / Redis) upon verified engagement events.

#### B. The 4-Second Valid View Integrity
- Product Rule: *"A view counts only after at least four seconds of viewing."*
- **Threat Vector:** Automated scripts or bots generating instant HTTP requests to artificially inflate the view count `V`.
- **Backend Mitigation:**
  - Client sends periodic watch heartbeats (`POST /api/v1/posts/{id}/views` with `{ session_token, elapsed_seconds: 4.0 }`).
  - The backend validates session tokens, rate limits per IP/user, and enforces a strict uniqueness constraint (`UNIQUE(post_id, user_id, date)` or IP hash) so a single viewer cannot spam thousands of valid views on one post.

#### C. Engagement Rate Manipulation & Ratios
- Product Rules:
  - Like weight = 1
  - Save weight = 5
  - Repost weight = 5
  - Confidence = $\frac{\sqrt{V}}{\sqrt{V} + \sqrt{1000}}$
- The confidence damping factor prevents a post with 1 view and 1 like from scoring disproportionately high.
- The backend must reject engagement events from previous seasons, as posts belong permanently to the season in which they were created.

---

## 2. Authentication, Token Handling & Storage

| Layer | Current Implementation | Risk / Vulnerability | Remediation for FastAPI |
|---|---|---|---|
| **Storage** | `localStorage.setItem("univibe_current_user", ...)` | Vulnerable to Cross-Site Scripting (XSS). Any script injected into the page can read the user object. | Use secure, HTTP-only, SameSite=Lax cookies for refresh tokens; store short-lived JWT access tokens in memory. |
| **Token Claims** | Emits dummy string `"mock-jwt-token"` in `authService.js` | Zero cryptography, zero expiration, zero signature verification. | Standard asymmetric JWTs (RS256 or HS256) signed with a secure backend secret, containing `sub`, `exp`, `is_student`, `verification_status`. |
| **Session Expiration** | Never expires in `localStorage`. | Stale user state persists indefinitely unless cleared manually. | Short-lived access tokens (15–30 min) + background refresh rotation. |
| **Impersonation** | `AuthProvider.jsx:14` falls back to `currentUser` (Kalab Araya). | Every first-time visitor automatically adopts the identity of a verified student. | Default to `null` (unauthenticated). Show public view or redirect to login when appropriate. |

---

## 3. Media Upload & Input Validation Risks

1. **Missing File Size & MIME Restrictions:**
   - In `UploadModal.jsx:171`, `<input type="file" accept="image/*,video/*" />` exists, but there is zero JavaScript validation on file size or actual MIME headers.
   - A user can drop an arbitrary executable (e.g. `.exe`, `.sh`) renamed with an image extension, or a massive 10GB file, causing browser memory crashes.
   - **Remediation:** Enforce maximum client file size (e.g. 15MB for images, 100MB for video) and validate magic bytes on the server before issuing upload permissions.
2. **Object URL Memory Leaks:**
   - `URL.createObjectURL(file)` is invoked in `UploadModal.jsx:106` and `Stories.jsx:47` without calling `URL.revokeObjectURL()`.
   - Repeated uploads cause browser memory leaks.
3. **HTML Sanitization & XSS:**
   - Post captions in `VibeCard.jsx:290` and comments in `VibeCard.jsx:229` are rendered directly via React JSX (`<p>{caption}</p>`), which safely escapes strings by default.
   - No instances of `dangerouslySetInnerHTML` were discovered in the repository.

---

## 4. Moderation, Reporting & Community Safety

1. **Dead Reporting Action:**
   - `VibeCard.jsx:203` renders a "Report" button in the context menu.
   - Clicking "Report" only invokes `closeMenu()`. It does not collect report reasons (hate speech, nudity, misinformation, harassment) and submits nothing.
2. **Missing Administrative Capabilities:**
   - The repository directory `admin_web/` is completely empty.
   - No moderation queue, user ban interface, content takedown tool, or student verification review panel exists.
   - **Recommendation:** Build the FastAPI administrative API endpoints first (`/api/v1/admin/*`), requiring role-based access control (`role == "admin"`), before scaffolding the `admin_web` dashboard.
