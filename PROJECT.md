# Uni Vibe — Project Guide for AI Assistants

> Read **[MASTER_BLUEPRINT.md](./MASTER_BLUEPRINT.md)** first. This file defines how to write code that matches the Uni Vibe vision.

---

## Vision & Goals

Uni Vibe is **the digital home of university life** — a social platform where students share campus vibes, universities compete positively, and future students discover authentic campus culture.

**Core question:** *"What's happening on your campus today?"*

**Primary CTA:** *"UV it!"*

**Current phase:** Version 0.1 — visual shell and design system.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build | Vite 8 |
| Icons | lucide-react |
| Routing | React Router (to be added v0.2) |
| Styling | Plain CSS (colocated per component) |
| Language | JavaScript (JSX) — TypeScript may be adopted later |

---

## Folder Structure

```
uni-vibe-web/
├── MASTER_BLUEPRINT.md      ← Product spec (source of truth)
├── PROJECT.md               ← This file (AI coding guide)
├── Frontend/                ← React app (deploy to Vercel)
│   ├── public/              ← Static assets (logo.png, etc.)
│   ├── src/
│   │   ├── components/      ← Reusable UI components
│   │   ├── pages/           ← Route-level page components
│   │   ├── hooks/           ← Custom React hooks
│   │   ├── services/        ← API client functions
│   │   ├── context/         ← React context providers
│   │   ├── utils/           ← Pure utility functions
│   │   ├── data/            ← Mock/seed data for development
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        ← Global styles only
│   ├── vercel.json
│   └── package.json
├── Backend/                 ← REST API (deploy to Render, not started)
└── .cursor/rules/           ← Cursor AI rules
```

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `VibeCard.jsx` |
| Component folders | PascalCase | `components/VibeCard/` |
| Pages | PascalCase | `pages/Home/Home.jsx` |
| CSS files | Match component name | `VibeCard.css` |
| CSS classes | kebab-case | `.vibe-card`, `.search-box` |
| Hooks | camelCase with `use` prefix | `useFeed.js` |
| Services | camelCase | `vibeService.js` |
| Constants | UPPER_SNAKE_CASE | `MAX_VIDEO_DURATION` |
| Mock data | camelCase | `mockVibes.js` |

**Terminology:** Use **"vibe"** (not "post") in UI copy and variable names where referring to user content. Internal/API may use `post` until backend is unified.

---

## Component Architecture

### Rules

1. **One component per folder** — `ComponentName/ComponentName.jsx` + `ComponentName.css`
2. **Functional components only** — no class components
3. **Colocate styles** — each component has its own CSS file
4. **Extract when reused** — if used in 2+ places, move to `components/`
5. **Pages compose components** — pages should not contain complex logic
6. **Props over context** — use context only for global state (auth, theme)

### Component Template

```jsx
import "./ComponentName.css";

function ComponentName({ prop1, prop2 }) {
  return (
    <div className="component-name">
      {/* content */}
    </div>
  );
}

export default ComponentName;
```

---

## UI/UX Guidelines

### Design System (from MASTER_BLUEPRINT Part 18)

```css
/* Background */
background: #08111f;

/* Glass panel */
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 30px;

/* Accent */
color: #2d8cff;  /* active tabs, links, CTAs */

/* Text */
color: #ffffff;           /* primary */
color: #bcbcbc;           /* secondary */
```

### Principles

- **Dark mode first** — `#08111f` background, glassmorphism panels
- **Rounded corners** — 30px for panels, 50% for avatars
- **Minimal chrome** — content is the hero, UI stays out of the way
- **Mobile-ready** — build desktop-first but use responsive breakpoints
- **"UV it!" branding** — use on upload/create buttons

### Layout

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | 3-column grid (280px + 1fr + 320px) |
| Tablet (768–1024px) | 2-column (feed + sidebar) |
| Mobile (<768px) | Single column + bottom nav |

---

## React Best Practices

- Use **named/default exports** — `export default` for components
- Keep components **under 150 lines** — extract sub-components if larger
- Use **lucide-react** for all icons — do not add other icon libraries
- Avoid inline styles — use CSS classes
- Mock data in `src/data/` until API is connected
- Do not install new dependencies without clear need

---

## Backend Conventions (Future)

When backend work begins:

- REST API at `/api/v1/`
- JWT authentication
- PostgreSQL for primary data
- See MASTER_BLUEPRINT Parts 15–17 for full architecture

---

## Git Workflow

- **Main branch:** `main`
- **Feature branches:** `feature/description` (e.g., `feature/vibe-feed`)
- **Commit messages:** concise, present tense — `add vibe card component`
- Do not commit `.env`, credentials, or `node_modules/`

---

## Performance Requirements

- Lazy-load routes and heavy components
- Optimize images (WebP, lazy loading)
- Virtualize long feeds (when implemented)
- Target Lighthouse score > 90

---

## Security Requirements

- Never hardcode API keys or secrets
- Sanitize user input before rendering
- Use HTTPS in production
- Implement CSRF protection when backend is added
- Student verification required for content upload

---

## Accessibility Checklist

- [ ] Semantic HTML (`header`, `main`, `nav`, `button`)
- [ ] Alt text on all images
- [ ] Keyboard navigation for interactive elements
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Focus indicators on buttons and inputs
- [ ] ARIA labels on icon-only buttons
- [ ] Screen reader-friendly See Through panels

---

## What to Build Next

Refer to **MASTER_BLUEPRINT Part 23** for the version roadmap. Current target: **v0.1 completion** then **v0.2 Core Feed**.

Priority components:
1. `GlassPanel` — reusable glassmorphism wrapper
2. `BottomNav` — mobile navigation
3. `VibeCard` — individual vibe display
4. `VibeFeed` — scrollable feed container
5. `RankingWidget` — right sidebar rankings

---

*When in doubt, check MASTER_BLUEPRINT.md.*
