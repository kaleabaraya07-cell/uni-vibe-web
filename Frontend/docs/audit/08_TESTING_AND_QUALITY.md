# Uni Vibe — Testing Strategy & Technical Health Review

> **Scope:** Dependency configuration, build & lint verification, code quality audit, and critical journey testability analysis.  
> **Investigation Date:** October 2026  

---

## 1. Tooling & Script Execution Results

### 1.1 Dependency Inventory (`Frontend/package.json`)

```json
{
  "dependencies": {
    "lucide-react": "^1.28.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.2"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "eslint": "^10.8.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "vite": "^8.2.0"
  }
}
```

- **Runtime Dependencies:** Extremely lean (only 4 packages). No UI component libraries, no CSS frameworks (pure vanilla CSS), no state management libraries (Redux/Zustand), no HTTP client (Axios).
- **Missing Testing Tooling:**
  - Zero test runner configured (no `vitest`, `jest`, or `@testing-library/react`).
  - Zero end-to-end framework (no `playwright` or `cypress`).
  - Zero TypeScript compiler (`tsc`) — plain JavaScript with JSX.

---

### 1.2 Verification Commands Executed & Evidence

#### A. Linting Verification: `npm run lint`
- **Script Executed:** `eslint .`
- **Result:** **FAILED (Exit Code 1)**
- **Output Summary:** `✖ 30 problems (29 errors, 1 warning)`
- **Detailed Defect Log:**
  1. `Frontend/src/components/ProfileHeader/ProfileHeader.jsx:2:61` — `MessageCircle` is defined but never used (`no-unused-vars`).
  2. `Frontend/src/components/Stories/Stories.jsx:2:26` — `Camera` is defined but never used.
  3. `Frontend/src/components/Stories/Stories.jsx:2:69` — `CheckCircle2` is defined but never used.
  4. `Frontend/src/components/Stories/Stories.jsx:9:8` — `StoryRing` is defined but never used.
  5. `Frontend/src/components/StoryViewer/StoryViewer.jsx:2:61` — `Camera` is defined but never used.
  6. `Frontend/src/components/StoryViewer/StoryViewer.jsx:2:69` — `Sparkles` is defined but never used.
  7. `Frontend/src/components/VibeCard/VibeCard.jsx:24:3` — `Clock3` is defined but never used.
  8. `Frontend/src/components/VibeCard/VibeCard.jsx:122:6` — **Warning:** React Hook `useEffect` missing dependency: `'closeMenu'`.
  9. `Frontend/src/context/AuthProvider.jsx:29:47` — `rememberMe` is assigned a value but never used.
  10. `Frontend/src/context/FeedContext.jsx:4:10` — `postService` is defined but never used.
  11. `Frontend/src/data/mockRankings.js:1:10` — `mockUniversities` is defined but never used.
  12. `Frontend/src/pages/Opportunities/Opportunities.jsx:6:8` — `Input` is defined but never used.
  13. `Frontend/src/pages/Opportunities/Opportunities.jsx:14:3` — `Compass` is defined but never used.
  14. `Frontend/src/pages/Opportunities/Opportunities.jsx:51:11` — `t` is assigned a value but never used.
  15. `Frontend/src/pages/Profile/Profile.jsx:8:8` — `StoryRing` is defined but never used.
  16. `Frontend/src/pages/Profile/Profile.jsx:15:3` — `Flame` is defined but never used.
  17. `Frontend/src/pages/Profile/Profile.jsx:16:3` — `Award` is defined but never used.
  18. `Frontend/src/pages/Profile/Profile.jsx:30:9` — `navigate` is assigned a value but never used.
  19. `Frontend/src/pages/Profile/Profile.jsx:31:27` — `switchAccount` is assigned a value but never used.
  20. `Frontend/src/pages/Profile/Profile.jsx:62:9` — `storyUsers` is assigned a value but never used.
  21. `Frontend/src/pages/Rankings/Rankings.jsx:6:8` — `Button` is defined but never used.
  22. `Frontend/src/pages/Rankings/Rankings.jsx:21:3` — `Sparkles` is defined but never used.
  23. `Frontend/src/pages/Rankings/Rankings.jsx:28:3` — `Compass` is defined but never used.
  24. `Frontend/src/pages/Rankings/Rankings.jsx:34:11` — `t` is assigned a value but never used.
  25. `Frontend/src/pages/SignUp/SignUp.jsx:18:3` — `HelpCircle` is defined but never used.
  26. `Frontend/src/services/authService.js:26:5` — `password` is defined but never used.
  27. `Frontend/src/services/profileService.js:27:27` — `_userId` is defined but never used.
  28: `Frontend/src/services/profileService.js:33:27` — `_userId` is defined but never used.
  29. `Frontend/src/services/rankingService.js:34:27` — `_userId` is defined but never used.
  30. `Frontend/src/services/universityService.js:3:3` — `mockDepartments` is defined but never used.

#### B. Production Build Verification: `npm run build`
- **Script Executed:** `vite build`
- **Result:** **SUCCESS (Exit Code 0)**
- **Duration:** 1.20s
- **Output Artifacts:**
  - `dist/index.html` (0.45 kB / gzip: 0.29 kB)
  - `dist/assets/index-7WdG-vxN.css` (56.32 kB / gzip: 9.72 kB)
  - `dist/assets/index-DiGqlASl.js` (360.67 kB / gzip: 106.47 kB)
- **Evaluation:** The build compiles cleanly despite the linting errors because ESLint is not currently gated inside `vite build`. The bundle footprint (~106 kB gzip) is compact and well-optimized.

---

## 2. Code Quality & Maintainability Observations

1. **Lack of Design System Tokens:**
   - There is no central CSS variables file (no `:root` definition).
   - Core colors (`#08111f`, `#2d8cff`, `rgba(255, 255, 255, 0.08)`), border radii (`24px`, `30px`), and font sizes are hardcoded repetitively across 30+ separate `.css` files.
   - Refactoring a primary accent color or dark mode tone currently requires searching and modifying dozens of files.
2. **Component File Size & Structure:**
   - Adheres generally to the rule *"one component per folder with colocated CSS"*.
   - However, files like `Rankings.jsx` (417 lines), `Rankings.css` (745 lines), `SignUp.jsx` (330 lines), and `VibeCard.jsx` (316 lines) exceed the recommended 150-line guideline from `PROJECT.md` and should eventually be subdivided into smaller subcomponents.
3. **Services Layer Disconnection:**
   - As documented in the architecture map, the 10 service files in `Frontend/src/services/` were drafted in isolation and never wired into the UI.

---

## 3. Critical User Journey Testability Matrix

| # | Critical User Journey | Current Testability Status | What Can Be Tested Now | What Requires Backend |
|---|---|---|---|---|
| **1** | A non-student registers and cannot create posts. | **Testable in Prototype** | Complete `SignUp.jsx` flow with `isStudent=false`; verify Explorer card selection; verify `UploadModal` gate blocks posting. | Verification that server rejects raw `POST /api/v1/posts` from non-student account. |
| **2** | A student registers and submits a verification request. | **Partially Testable** | Test university dropdown selection and missing-university modal form. | Student ID document upload, image processing, and verification queue processing. |
| **3** | A pending student cannot create posts. | **Partially Testable** | Manually set `user.verificationStatus = "pending"`; test that `UploadModal` shows the pending review notice. | Server enforcement of pending status. |
| **4** | A verified student can access the post creation flow. | **Testable in Prototype** | Login as demo verified student; verify `UploadModal` steps 1, 2, 3 render and publish to feed. | Direct upload to cloud object storage. |
| **5** | A user can create a post and see the expected result. | **Testable in Prototype** | Post creation adds new card to the top of the feed during the active session. | Real persistence, CDN URL generation, and multi-user feed delivery. |
| **6** | Feed interactions (like, save, repost, comment) behave consistently. | **Testable in Prototype** | Click like/save/repost; verify counter increments; verify bookmark appears in `/saved`. | Cross-session persistence and multi-user count sync. |
| **7** | University selection uses approved directory entries. | **Testable in Prototype** | Dropdown displays approved universities from `mockUniversities.js`. | Database directory lookup and dynamic department filtering. |
| **8** | Missing-university requests are submitted correctly. | **Partially Testable** | Modal accepts inputs and confirms submission. | Persistent storage in `university_requests` table and admin notification. |
| **9** | League pages display backend-provided scores without calculating points in the client. | **Partially Testable** | Verify standings table displays ranks, movement, and school PT. | Verify that client never computes or transmits PT; verify server calculation engine. |
| **10** | Refreshing a page does not unexpectedly destroy important persisted data. | **Defect Confirmed (Fails Test)** | User authentication survives reload (`localStorage`), but **all likes, saves, reposts, comments, and created vibes vanish on reload**. | PostgreSQL database backing all state. |
| **11** | Public and protected routes behave correctly. | **Defect Confirmed (Fails Test)** | Currently, logging out locks the user out of all public content (Home, Feed, Rankings, Universities) via `<ProtectedRoute>`. | Route decoupling in `App.jsx`. |
| **12** | Responsive layouts remain usable on small screens. | **Testable in Prototype** | Test layout across breakpoints (1200px, 1024px, 768px, 480px); verify bottom nav appears and sidebars collapse. | Mobile media performance and CDN bandwidth optimization. |
