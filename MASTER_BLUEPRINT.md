# Uni Vibe — Complete Master Blueprint

**Version:** 1.0  
**Status:** Living document — update as the product evolves  
**Last updated:** 2026-08-01

> **The Digital Home of University Life**

This document is the single source of truth for Uni Vibe — for founders, engineers, designers, investors, campus ambassadors, and AI coding assistants. When in doubt, refer here first.

---

## Table of Contents

1. [Vision](#part-1--vision)
2. [Core Idea — Vibes](#part-2--core-idea)
3. [User Types](#part-3--user-types)
4. [Complete Feature List](#part-4--complete-feature-list)
5. [See Through System](#part-5--see-through-system)
6. [Complete Social System](#part-6--complete-social-system)
7. [Complete Competition System](#part-7--complete-competition-system)
8. [Vibe Score Algorithm](#part-8--vibe-score)
9. [Recommendation Algorithm](#part-9--recommendation-algorithm)
10. [Upload System](#part-10--upload-system)
11. [University Ecosystem](#part-11--university-ecosystem)
12. [Opportunities](#part-12--opportunities)
13. [Chat System](#part-13--chat-system)
14. [Security](#part-14--security)
15. [Backend Architecture](#part-15--backend-architecture)
16. [Database Design](#part-16--database-design)
17. [API Design](#part-17--api-design)
18. [Complete UI Roadmap](#part-18--complete-ui-roadmap)
19. [Mobile App Roadmap](#part-19--mobile-app-roadmap)
20. [AI Features](#part-20--ai-features)
21. [Monetization](#part-21--monetization)
22. [Marketing](#part-22--marketing)
23. [Development Roadmap](#part-23--development-roadmap)
24. [Cursor AI & Project Rules](#part-24--cursor-ai--project-rules)

---

## Part 1 — Vision

### Mission

Create a platform where university students can proudly share their campus experiences, build communities, compete positively with other universities, and preserve memories that last a lifetime.

### The Problem

Today's generation increasingly views university only as a place to earn a degree.

**Students and young people:**
- Do not understand campus life
- Feel disconnected from universities
- Choose universities with very little knowledge of student life
- Only see academic advertisements instead of authentic student experiences

**Traditional social media:**
- Mix university content with unrelated entertainment
- Don't build a sense of university identity
- Don't encourage healthy competition between universities
- Don't provide dedicated communities for campus life

One of the most memorable stages of life lacks a platform built specifically for it.

### The Solution

Uni Vibe creates a dedicated ecosystem where universities become digital communities. Students become storytellers of their campus. Every photo, match, graduation, event, friendship, and memory becomes part of their university's identity.

**Core question:** Instead of *"What are you doing today?"* — Uni Vibe asks *"What's happening on your campus today?"*

### Why Students Will Use It

- Authentic campus content without noise from unrelated social media
- University pride through rankings and competitions
- Digital memory book that lasts beyond graduation
- Discovery of nearby universities, events, clubs, and opportunities
- Live campus experiences (sports, graduations, festivals)
- Community belonging through departments, clubs, and groups

### Why Universities Benefit

- Authentic student-generated marketing for prospective students
- Stronger alumni engagement and campus culture visibility
- Official channels for announcements, schedules, and emergency alerts
- Positive inter-university competition that drives engagement
- Data on campus life trends, events, and student sentiment
- Partnership and recruitment opportunities

### Long-Term Vision

| Phase | Scope |
|-------|-------|
| Launch | Ethiopian universities |
| Phase 2 | East Africa |
| Phase 3 | Africa |
| Phase 4 | Middle East, Europe, North America, Asia |
| End goal | **The digital campus of Africa — and eventually the world** |

---

## Part 2 — Core Idea

### What Is a Vibe?

A **Vibe** is any authentic moment, story, or piece of content that represents university life. Vibes are the atomic unit of Uni Vibe — not generic "posts."

Students don't just upload content — they **represent their campus**.

### Vibe Categories

| Category | Examples |
|----------|----------|
| Campus life | Daily routines, campus walks, hangouts |
| Funny moments | Memes, pranks, relatable student humor |
| Graduation | Ceremonies, caps, celebrations |
| Sports | Football, basketball, inter-university matches |
| Clubs | Meetings, performances, club events |
| Food | Cafeteria, street food, dorm cooking |
| Dorm life | Room tours, roommate moments, late nights |
| Libraries | Study sessions, exam prep, group work |
| Competitions | Hackathons, debates, talent shows |
| Events | Festivals, concerts, cultural days |
| Talent | Music, dance, art, performances |
| Music | Campus artists, open mics |
| Memes | University-specific humor |
| Announcements | Official and unofficial campus news |
| Projects | Class projects, group assignments |
| Research | Papers, lab work, conferences |
| Startup ideas | Student entrepreneurship |
| Daily student life | Everything in between |

### Community Language

| Phrase | Usage |
|--------|-------|
| **"UV it!"** | Primary CTA — upload/share a vibe (strongest branding) |
| "Drop a Vibe." | Encouragement to post |
| "Catch the Vibe." | Browse/discover content |
| "Post the Campus." | Represent your university |
| "Let's UV." | Group action — go live or post together |

### Branding

- **Name:** Uni Vibe
- **Meaning:** The vibe, culture, energy, and memories of university life
- **Primary slogan:** *"The Digital Home of University Life."*
- **Alternates:** *"Where Campus Comes Alive."* · *"Share Your Campus Story."* · *"Every Campus Has a Story."* · *"Experience University Beyond the Classroom."*

---

## Part 3 — User Types

| User Type | Can Post Vibes | Can Go Live | Key Capabilities |
|-----------|----------------|-------------|------------------|
| **Student** | ✅ | ✅ | Full social, competition, chat |
| **University (official)** | ✅ (announcements) | ✅ | Official page, alerts, verification |
| **College** | ✅ | ✅ | Sub-unit of university |
| **Club** | ✅ | ✅ | Club page, events, members |
| **Organization** | ✅ | ✅ | Verified org content |
| **Business** | ✅ (promoted) | ❌ | Campus ads, marketplace |
| **Recruiter** | ✅ (jobs) | ❌ | Job/internship listings |
| **Sponsor** | ✅ (sponsored) | ❌ | Sponsored content, events |
| **Alumni** | ✅ (memories) | ❌ | Campus memories, mentorship |
| **Visitor** | ❌ | ❌ | Browse, follow, save, comment |
| **Moderator** | ❌ | ❌ | Content moderation, reports |
| **Campus Ambassador** | ✅ | ✅ | Growth, onboarding, events |
| **Administrator** | ✅ | ✅ | Platform management |

### Permission Tiers

- **Visitor** — read, like, comment, save, follow (no uploads)
- **Verified Student** — full creator access tied to university
- **Official Account** — university/club/org verified badge
- **Staff** — moderator + admin tools

---

## Part 4 — Complete Feature List

### Primary Navigation

| Page / Tab | Description |
|------------|-------------|
| **Home** | Main entry — feed layout with sidebars |
| **Live** | Live streams from campus |
| **For You** | Personalized vibe feed |
| **Search** | Global search across all entities |
| **Upload** | Create vibes (UV it!) |
| **Chat** | Messaging hub |
| **Notifications** | Activity and system alerts |
| **Profile** | User profile and settings |

### Entity Pages

| Page | Contents |
|------|----------|
| **University Page** | Info, population, photos, videos, rankings, events, clubs, sports, trending |
| **Department Page** | Department info, members, posts, events |
| **Club Page** | Club info, members, events, posts |
| **Event Page** | Event details, RSVP, live stream, attendees |

### User Features

| Feature | Description |
|---------|-------------|
| **Saved** | Bookmarked vibes and collections |
| **Ranking** | University/department/club/student leaderboards |
| **Leaderboards** | Weekly, monthly, yearly winners |
| **Messages** | Private and group conversations |
| **Settings** | Account, privacy, notifications, language |
| **Privacy** | Visibility controls, blocked users |
| **Verification** | Student ID verification, official badges |
| **Badges** | Achievement badges and trophies |
| **Achievements** | Milestones and hall of fame |
| **Reports** | Report content and users |
| **Moderation** | Mod tools for flagged content |

### Platform Features

| Feature | Description |
|---------|-------------|
| **AI Assistant** | Campus-aware AI helper |
| **Dark Mode** | Default; light mode optional |
| **Accessibility** | WCAG compliance, screen reader support |
| **Languages** | Multi-language support (Amharic, English, etc.) |
| **Offline Mode** | Cached feed and drafts (mobile) |

---

## Part 5 — See Through System

> **Uni Vibe's signature feature.** See Through lets users peek behind any vibe to discover context, connections, and opportunities without leaving the feed.

### What It Is

See Through is a contextual overlay/panel that reveals the **full story** behind a vibe — who, what, where, when, and what's connected. It's the difference between scrolling past a video and truly understanding campus life.

### How It Works

1. User taps/clicks the **See Through** icon on any vibe
2. A glassmorphism panel slides in (side on desktop, bottom sheet on mobile)
3. Contextual information loads based on vibe type
4. User can navigate to linked entities (university, club, event, etc.)
5. See Through opens contribute to **Vibe Score** and **engagement metrics**

### How Users Open It

- **Tap** See Through icon (eye/layers icon) on vibe card
- **Swipe up** on mobile vibe card
- **Long press** on vibe thumbnail
- **Keyboard:** `S` key when vibe is focused

### See Through Layouts by Content Type

#### Video Vibe
- Creator profile + university
- Caption and hashtags
- Watch stats (views, completion rate)
- Related vibes from same event/club
- Comments preview
- Share / Save actions

#### Image Vibe
- Same as video minus watch stats
- Location tag (campus building/area)
- Tagged students

#### University
- Overview (population, location, ranking)
- Trending vibes this week
- Top clubs and sports
- Upcoming events
- Follow / Request to add (if missing)

#### Club
- Club description and members count
- Recent vibes and events
- Join request button
- Related clubs

#### Student Profile
- Bio, university, department, year
- Top vibes and achievements
- Follow button
- Mutual connections

#### Event
- Date, time, location
- RSVP count and attendee preview
- Live stream link (if active)
- Related vibes from event

#### Research
- Abstract and authors
- Department and university
- Download/link to paper
- Related research vibes

#### Business
- Business info and campus location
- Promoted vibes and offers
- Contact / directions

#### Opportunity
- Job/internship/scholarship details
- Application link and deadline
- Posted by (recruiter/university)
- Save and share

---

## Part 6 — Complete Social System

### Engagement Actions

| Action | Icon | Points (University) | Points (Vibe Score) |
|--------|------|--------------------|--------------------|
| Like | ❤️ | 1 | Weighted |
| Comment | 💬 | 3 | Weighted |
| Reply | ↩️ | 2 | Weighted |
| Share | 📤 | 5 | Weighted |
| Quote | 💬+ | 4 | Weighted |
| Bookmark / Save | 🔖 | 4 | Weighted |
| Favorite | ⭐ | 2 | Weighted |
| View | 👀 | 0.2 | Watch time based |
| See Through Open | 👁️ | 1 | Direct input |

### Social Graph

- **Following / Followers** — standard social graph
- **Close Friends** — restricted visibility vibes
- **Communities** — university-wide groups
- **Groups** — department, club, project, sports teams
- **Mentions** — @student, @club, @university
- **Tags** — location and entity tags
- **Hashtags** — #CampusLife, #Graduation2026, etc.
- **Collections** — curated saved vibe groups

---

## Part 7 — Complete Competition System

> This is where Uni Vibe becomes different.

### Ranking Levels

| Level | Scope | Reset |
|-------|-------|-------|
| University Rankings | All universities | Weekly |
| Department Rankings | Within a university | Weekly |
| Club Rankings | All clubs | Weekly |
| Student Rankings | Individual creators | Weekly |

### Time Periods

| Period | Award |
|--------|-------|
| **Weekly** | 🏆 Uni Vibe of the Week |
| **Monthly** | 🌟 Uni Vibe of the Month |
| **Yearly** | 👑 Uni Vibe of the Year |

Weekly winners earn yearly points. Yearly winner receives digital trophies, badges, Hall of Fame recognition, and special profile decorations.

### Category Awards

| Award | Criteria |
|-------|----------|
| Most Active | Highest total engagement |
| Best Photographer | Top photo vibes by Vibe Score |
| Best Developer | Top project/code vibes |
| Best Designer | Top design/creative vibes |
| Best Athlete | Top sports-related vibes |
| Most Helpful | Community-nominated + engagement |
| Most Creative | Highest creativity score |
| Most Inspiring | Highest inspiration score |
| Most Popular Event | Event with most engagement |

### University Point System

| Action | Points |
|--------|--------|
| Like | 1 |
| Comment | 3 |
| Share | 5 |
| Save | 4 |
| View | 0.2 |

Weekly totals determine university ranking. All engagement on vibes tagged to a university contributes to that university's score.

---

## Part 8 — Vibe Score

> Uni Vibe's own content quality algorithm — beyond simple likes.

### Formula (Conceptual)

```
VibeScore = (
  (Likes × 1.0) +
  (Comments × 2.5) +
  (Shares × 4.0) +
  (Saves × 3.5) +
  (SeeThroughOpens × 2.0) +
  (CompletionRate × 5.0) +
  (WatchTimeScore × 3.0) +
  (UniversityInteraction × 1.5) +
  (ClubInteraction × 1.5) +
  (EventInteraction × 2.0)
) × FreshnessMultiplier × AuthenticityScore × TrendingBoost
  - (NegativeReports × 2.0)
  - SpamPenalty
```

### Factor Definitions

| Factor | Description |
|--------|-------------|
| **Completion Rate** | % of video watched (rewards quality content) |
| **Watch Time** | Total and average watch duration |
| **See Through Opens** | Depth of engagement — users want to know more |
| **University Interaction** | Engagement from same-university users |
| **Authenticity** | Verified student status, no spam flags |
| **Freshness** | Time decay — newer vibes get a boost |
| **Trending** | Velocity of engagement in short window |
| **Regional Boost** | Boost content from user's region |
| **New Creator Boost** | Help new students get discovered |
| **Spam Detection** | AI + report-based penalty |
| **Negative Reports** | User reports reduce score pending review |

### Score Uses

- Feed ranking (For You)
- Trending section
- Category awards (Best Photographer, etc.)
- Creator analytics dashboard

---

## Part 9 — Recommendation Algorithm

### For You Feed — Signal Sources

| Signal | Weight | Description |
|--------|--------|-------------|
| Interest graph | High | Topics, categories user engages with |
| University graph | High | User's university + nearby universities |
| Friend graph | High | Content from followed users |
| Department graph | Medium | Same department content |
| Club graph | Medium | Joined club content |
| Location | Medium | Geographic proximity |
| Watch history | Medium | Completion and watch time patterns |
| Saved posts | Medium | Implicit interest signals |
| Liked posts | Medium | Explicit interest signals |
| Events | Low-Medium | Upcoming and past event vibes |
| Sports | Low-Medium | Sports preference |
| AI recommendation | Medium | ML model predictions |

### Cold Start Strategy

1. **Onboarding quiz** — interests, university, department, clubs
2. **University default feed** — show top vibes from user's university
3. **Trending fallback** — platform-wide trending vibes
4. **New creator boost** — surface fresh creators early
5. **Explore tab** — explicit discovery for new users

### Feed Mix (Target)

- 40% — University + nearby
- 25% — Following + friends
- 20% — Recommended (AI + interest)
- 10% — Trending
- 5% — New creators / explore

---

## Part 10 — Upload System

### Content Types

| Type | Format | Duration/Limit |
|------|--------|----------------|
| **Videos** | MP4, WebM | Up to 10 min |
| **Photos** | JPG, PNG, WebP | Up to 10 per vibe |
| **Stories** | Photo/Video | 24-hour expiry |
| **Live** | RTMP stream | Unlimited duration |
| **Announcements** | Text + media | Official accounts only |
| **Documents** | PDF | Research, assignments |
| **Research** | PDF + abstract | Linked to department |
| **Polls** | Text + options | Up to 4 options |
| **Questions** | Text | Q&A format |
| **Events** | Structured form | Date, location, RSVP |
| **Jobs** | Structured form | Recruiter accounts |
| **Scholarships** | Structured form | University/recruiter |

### Upload Flow

1. Tap **"UV it!"** button
2. Select content type
3. Capture or upload media
4. Add caption, tags, hashtags, location
5. Tag university, department, club, event
6. Set visibility (public, university, close friends)
7. Publish → enters moderation queue (if flagged) → appears in feed

---

## Part 11 — University Ecosystem

### Official Accounts

- **University** — main official page with verification badge
- **Departments** — faculty/department sub-pages
- **Clubs** — student club pages (verified by university admin)
- **Organizations** — student government, associations

### Official Content Types

| Type | Priority | Example |
|------|----------|---------|
| Emergency alerts | Critical | Campus safety notifications |
| Exam schedules | High | Final exam timetable |
| Graduation | High | Ceremony info and streams |
| Announcements | Normal | Registration, holidays |
| Research | Normal | Faculty publications |

### University Page Contents

- Campus information and photos
- Student population
- Rankings (current week/month/year)
- Events calendar
- Clubs directory
- Sports teams
- Trending vibes
- Top creators
- Request to add (if university missing)

---

## Part 12 — Opportunities

| Type | Posted By | Features |
|------|-----------|----------|
| Internships | Recruiters, businesses | Apply link, deadline, See Through layout |
| Jobs | Recruiters | Full job description |
| Scholarships | Universities, orgs | Eligibility, deadline |
| Competitions | Universities, clubs | Registration, prizes |
| Hackathons | Clubs, orgs | Team signup, schedule |
| Volunteer | NGOs, clubs | Hours, location |
| Exchange Programs | Universities | Partner schools, requirements |
| Research | Faculty, students | Abstract, collaboration |
| Training | Businesses, universities | Course info, enrollment |

Opportunities appear in feed, dedicated Opportunities tab, and See Through panels on related vibes.

---

## Part 13 — Chat System

### Chat Types

| Type | Members | Use Case |
|------|---------|----------|
| Private | 2 | Direct messages |
| Group | 2–256 | Friend groups |
| Department | Unlimited | Department-wide |
| Club | Unlimited | Club members |
| Event | Unlimited | Event attendees |
| University | Unlimited | Campus-wide (moderated) |

### Message Features

- Text, voice messages, video messages
- File sharing (documents, images)
- Polls
- Replies and threads
- Reactions (emoji)
- Pinned messages
- Read receipts
- Typing indicators
- Message search

---

## Part 14 — Security

| Area | Implementation |
|------|----------------|
| **Authentication** | Email + password, OAuth (Google), student ID verification |
| **Permissions** | Role-based access control (RBAC) per user type |
| **Encryption** | TLS in transit, encrypted at rest for messages |
| **Moderation** | AI pre-screening + human review queue |
| **Spam Protection** | Rate limiting, duplicate detection, Vibe Score penalties |
| **AI Detection** | Deepfake/spam/CSAM detection |
| **Report System** | User reports → mod queue → action (warn, remove, ban) |
| **Verification** | Student email/ID verification, official account badges |

---

## Part 15 — Backend Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │     │ Mobile App  │     │  Admin Panel│
│  (React)    │     │  (Flutter)  │     │  (React)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │
                    │  (REST/GQL)  │
                    └──────┬──────┘
                           │
       ┌───────────┬───────┼───────┬───────────┐
       │           │       │       │           │
  ┌────▼───┐ ┌────▼──┐ ┌──▼──┐ ┌──▼──┐ ┌────▼────┐
  │ Auth   │ │ Feed  │ │Chat │ │Media│ │Compete  │
  │Service │ │Service│ │Svc  │ │Proc │ │Service  │
  └────┬───┘ └───┬───┘ └──┬──┘ └──┬──┘ └────┬────┘
       │         │        │       │         │
  ┌────▼─────────▼────────▼───────▼─────────▼────┐
  │              PostgreSQL (Primary DB)           │
  └───────────────────────────────────────────────┘
       │         │        │       │
  ┌────▼───┐ ┌───▼───┐ ┌──▼──┐ ┌──▼──────┐
  │ Redis  │ │  S3   │ │Queue│ │   CDN   │
  │ Cache  │ │Storage│ │Jobs │ │ Delivery│
  └────────┘ └───────┘ └─────┘ └─────────┘
```

### Tech Stack (Recommended)

| Layer | Technology |
|-------|------------|
| Frontend (Web) | React + Vite |
| Frontend (Mobile) | Flutter |
| API | Node.js (Express/Fastify) or Go |
| Database | PostgreSQL |
| Cache | Redis |
| Storage | S3-compatible (Cloudflare R2 / AWS S3) |
| Queue | BullMQ / Redis Queue |
| Media Processing | FFmpeg workers |
| Search | Elasticsearch or PostgreSQL full-text |
| AI | OpenAI API / self-hosted models |
| CDN | Cloudflare |
| Notifications | Firebase Cloud Messaging |

---

## Part 16 — Database Design

### Core Tables

| Table | Key Fields |
|-------|------------|
| `users` | id, email, username, role, university_id, department_id, year, verified, avatar_url, bio |
| `universities` | id, name, country, city, logo_url, student_count, ranking_score |
| `departments` | id, university_id, name, faculty |
| `clubs` | id, university_id, name, description, logo_url, member_count |
| `posts` (vibes) | id, user_id, type, caption, media_urls, university_id, club_id, event_id, vibe_score, created_at |
| `videos` | id, post_id, url, duration, thumbnail_url, completion_rate |
| `comments` | id, post_id, user_id, parent_id, content, created_at |
| `likes` | id, post_id, user_id, created_at |
| `shares` | id, post_id, user_id, created_at |
| `saves` | id, post_id, user_id, collection_id, created_at |
| `follows` | id, follower_id, following_id, created_at |
| `messages` | id, chat_id, sender_id, content, type, created_at |
| `chats` | id, type, name, university_id, club_id, event_id |
| `chat_members` | id, chat_id, user_id, role, joined_at |
| `events` | id, university_id, club_id, title, description, start_at, end_at, location |
| `notifications` | id, user_id, type, reference_id, read, created_at |
| `rankings` | id, entity_type, entity_id, period, score, rank, created_at |
| `reports` | id, reporter_id, target_type, target_id, reason, status |
| `badges` | id, user_id, type, awarded_at |
| `opportunities` | id, type, title, description, posted_by, deadline, url |
| `see_through_events` | id, post_id, user_id, opened_at |

### Indexes

- `posts(university_id, created_at DESC)` — university feed
- `posts(vibe_score DESC, created_at DESC)` — trending
- `rankings(entity_type, period, score DESC)` — leaderboards
- `users(university_id)` — university members
- Full-text index on `posts(caption)` — search

---

## Part 17 — API Design

### Style

- **Primary:** REST API with JSON
- **Future:** GraphQL for complex queries (feed, See Through)
- **Real-time:** WebSocket for chat, live, notifications

### Core Endpoints

```
Auth
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/verify-student
  POST   /api/v1/auth/refresh

Users
  GET    /api/v1/users/:id
  PATCH  /api/v1/users/:id
  GET    /api/v1/users/:id/vibes
  POST   /api/v1/users/:id/follow
  DELETE /api/v1/users/:id/follow

Feed
  GET    /api/v1/feed/for-you?page=&limit=
  GET    /api/v1/feed/live
  GET    /api/v1/feed/trending
  GET    /api/v1/feed/university/:id

Vibes (Posts)
  POST   /api/v1/vibes
  GET    /api/v1/vibes/:id
  DELETE /api/v1/vibes/:id
  POST   /api/v1/vibes/:id/like
  POST   /api/v1/vibes/:id/comment
  POST   /api/v1/vibes/:id/share
  POST   /api/v1/vibes/:id/save
  GET    /api/v1/vibes/:id/see-through

Universities
  GET    /api/v1/universities
  GET    /api/v1/universities/:id
  POST   /api/v1/universities/request

Rankings
  GET    /api/v1/rankings/universities?period=weekly
  GET    /api/v1/rankings/students?period=weekly
  GET    /api/v1/rankings/clubs?period=weekly

Search
  GET    /api/v1/search?q=&type=all

Chat
  GET    /api/v1/chats
  POST   /api/v1/chats
  GET    /api/v1/chats/:id/messages
  POST   /api/v1/chats/:id/messages

Upload
  POST   /api/v1/upload/presigned-url
  POST   /api/v1/upload/complete

Notifications
  GET    /api/v1/notifications
  PATCH  /api/v1/notifications/:id/read
```

### Conventions

- Pagination: `?page=1&limit=20` with `{ data, meta: { total, page, limit } }`
- Auth: Bearer JWT in `Authorization` header
- Errors: `{ error: { code, message } }` with HTTP status codes
- Rate limiting: 100 req/min authenticated, 20 req/min anonymous

---

## Part 18 — Complete UI Roadmap

### Official Design Reference (Dark Mode v1)

The approved dark mode UI is defined by the design mockups (Aug 2026). All components must match this visual language.

**Desktop Home Layout:**
- Top navbar: logo + LIVE (red dot) / FOR YOU tabs + search + profile
- Left sidebar: user card, nav menu (Home → Saved), Uni Vibe of the Week card
- Center feed: full-height vibe card with vertical media, action bar (like/comment/share/save), See Through button
- Right sidebar: university students, top contributors, upcoming events
- Bottom bar: Uni Vibe, Opportunities, glowing + create button, Chat, Me

**Auth Screens (Mobile):**
- Glassmorphism card on blurred campus background
- Logo with blue glow, "Connect. Share. Vibe with your Campus."
- Login: Welcome Back / Sign Up: Create Your Account
- Social login: Google, Facebook, Apple
- Glowing blue gradient primary buttons

**Logo:** Glassmorphism rounded square with glowing blue "U" (headphones + smile motif)

### Design System

| Token | Value |
|-------|-------|
| Background | `#060d18` with blue radial gradients |
| Glass background | `rgba(255,255,255,0.06)` |
| Glass border | `rgba(255,255,255,0.1)` |
| Blur | `backdrop-filter: blur(20px)` |
| Border radius | `24px` (panels), `50%` (avatars) |
| Accent / glow | `#2d8cff` → `#0066ff` gradient |
| Live indicator | `#ff4757` with pulse animation |
| Text primary | `#ffffff` |
| Text secondary | `#bcbcbc` |
| Font | System sans-serif stack |
| Create button | Blue gradient + `box-shadow` glow |

### Page List

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | 🟢 Implemented (dark mode v1) |
| Live | `/live` | ⬜ Planned |
| For You Feed | `/feed` | ⬜ Planned |
| Search | `/search` | ⬜ Planned |
| Profile | `/profile/:id` | ⬜ Planned |
| University | `/university/:id` | ⬜ Planned |
| Department | `/department/:id` | ⬜ Planned |
| Club | `/club/:id` | ⬜ Planned |
| Event | `/event/:id` | ⬜ Planned |
| Upload | `/upload` | ⬜ Planned |
| Chat | `/chat` | ⬜ Planned |
| Chat Room | `/chat/:id` | ⬜ Planned |
| Notifications | `/notifications` | ⬜ Planned |
| Rankings | `/rankings` | ⬜ Planned |
| Saved | `/saved` | ⬜ Planned |
| Settings | `/settings` | ⬜ Planned |
| Opportunities | `/opportunities` | ⬜ Planned |
| See Through | Overlay | ⬜ Planned |

### Component Library

```
src/
├── components/
│   ├── Navbar/
│   ├── BottomNav/
│   ├── VibeCard/
│   ├── VibeFeed/
│   ├── SeeThrough/
│   ├── RankingWidget/
│   ├── UniversityCard/
│   ├── ProfileHeader/
│   ├── SearchBar/
│   ├── NotificationItem/
│   ├── ChatBubble/
│   ├── UploadModal/
│   ├── GlassPanel/          ← reusable glassmorphism wrapper
│   └── ui/                  ← buttons, inputs, badges, avatars
├── pages/
│   ├── Home/
│   ├── Live/
│   ├── Feed/
│   ├── Search/
│   ├── Profile/
│   ├── University/
│   ├── Chat/
│   ├── Upload/
│   ├── Rankings/
│   ├── Settings/
│   └── Opportunities/
├── hooks/
├── services/                ← API calls
├── context/                 ← auth, theme, feed
├── utils/
└── data/                    ← mock data (dev)
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | 3-column (sidebar + feed + sidebar) |
| Tablet (768–1024px) | 2-column (feed + sidebar) |
| Mobile (<768px) | Single column + bottom nav |

---

## Part 19 — Mobile App Roadmap

| Feature | Technology |
|---------|------------|
| Framework | Flutter (iOS + Android) |
| Push notifications | Firebase Cloud Messaging |
| Camera | Native camera integration |
| Offline | Cached feed + draft vibes |
| Live streaming | RTMP publisher |
| Deep linking | Universal links / app links |
| Biometric auth | Face ID / fingerprint |

### Mobile-Specific UX

- Bottom navigation (Home, Live, Upload, Chat, Profile)
- Swipe-up for See Through
- Pull-to-refresh on feeds
- Native share sheet
- Picture-in-picture for live streams

---

## Part 20 — AI Features

| Feature | Description |
|---------|-------------|
| **Smart Search** | Natural language search across all entities |
| **Caption Generator** | AI-generated captions for vibes |
| **Moderation** | Auto-flag inappropriate content |
| **Recommendations** | ML-powered For You feed |
| **Translations** | Auto-translate vibes and comments |
| **Summaries** | Summarize long vibes and event threads |
| **AI Campus Assistant** | Chatbot for campus info, schedules, FAQ |

---

## Part 21 — Monetization

| Revenue Stream | Description | Phase |
|----------------|-------------|-------|
| **Ads** | Targeted campus advertising | v2.0 |
| **Premium** | Enhanced profiles, analytics, badges | v1.5 |
| **University subscriptions** | Official tools, analytics, promotion | v1.0 |
| **Business accounts** | Verified business profiles | v1.5 |
| **Recruitment** | Job posting fees for recruiters | v2.0 |
| **Marketplace** | Commission on campus marketplace | v2.0 |
| **Events** | Promoted event listings | v1.5 |
| **Sponsors** | Sponsored vibes and competitions | v2.0 |
| **Merchandise** | Uni Vibe branded goods | v3.0 |
| **Creator programs** | Revenue share for top creators | v2.0 |
| **Verification fees** | Fast-track verification | v1.0 |

---

## Part 22 — Marketing

### Campus Ambassadors

- 2–5 ambassadors per launch university
- Responsibilities: onboarding, content creation, events
- Rewards: badges, premium, exclusive merch

### Referral System

- Unique referral codes per student
- Rewards for referrer and referee (badges, profile decorations)

### Launch Strategy

1. **Pilot** — 3–5 Ethiopian universities
2. **Competition launch** — Uni Vibe of the Week from day one
3. **Ambassador program** — seed content and users
4. **Inter-university events** — live stream competitions
5. **PR** — "Digital home of university life" narrative

### Growth Strategy

| Stage | Focus |
|-------|-------|
| Seed | Ethiopian universities, word of mouth |
| Growth | East Africa expansion, ambassador scaling |
| Scale | Africa-wide, university partnerships |
| Global | Middle East, Europe, Americas, Asia |

---

## Part 23 — Development Roadmap

### Version 0.1 — Foundation (Current)

**Goal:** Visual shell and design system

- [x] Project setup (React + Vite)
- [x] Navbar with Live / For You tabs, search, notifications
- [x] Home page 3-column glassmorphism layout
- [x] Bottom navigation component
- [x] GlassPanel reusable component
- [x] Mock data for vibes and universities
- [x] MASTER_BLUEPRINT.md and PROJECT.md

### Version 0.2 — Core Feed

**Goal:** Browsable vibe feed with engagement UI

- [x] VibeCard component (photo/video)
- [ ] VibeFeed with infinite scroll
- [x] Like, comment, share, save buttons (UI only)
- [x] Left sidebar — navigation menu
- [x] Right sidebar — university rankings widget
- [ ] React Router setup with page routes
- [ ] University page (static mock)
- [ ] Profile page (static mock)

### Version 0.5 — See Through + Competition

**Goal:** Signature features with mock data

- [ ] See Through overlay panel (all layout types)
- [ ] University ranking system (mock points)
- [ ] Uni Vibe of the Week banner
- [ ] Search page with filters
- [ ] Notifications page (mock)
- [ ] Upload modal ("UV it!" flow UI)
- [ ] Trending section

### Version 1.0 — MVP Launch

**Goal:** Functional product for pilot universities

- [ ] Backend API (auth, vibes, feed, rankings)
- [ ] PostgreSQL database
- [ ] User registration and student verification
- [ ] Real vibe upload (photos + videos)
- [ ] Working engagement (like, comment, share, save)
- [ ] Vibe Score calculation
- [ ] For You feed (basic recommendation)
- [ ] University and profile pages (dynamic)
- [ ] Chat (private messaging)
- [ ] Push notifications
- [ ] Moderation and reporting
- [ ] Deploy to production

### Version 2.0 — Community + Opportunities

**Goal:** Full social platform

- [ ] Live streaming
- [ ] Group chat (department, club, event)
- [ ] Opportunities (jobs, scholarships, hackathons)
- [ ] Official university accounts
- [ ] AI Campus Assistant
- [ ] Advanced recommendation algorithm
- [ ] Mobile app (Flutter) beta
- [ ] Monetization (premium, business accounts)
- [ ] Multi-language support

### Version 3.0 — Global Platform

**Goal:** Scale across Africa and beyond

- [ ] Full mobile app (iOS + Android)
- [ ] Campus Memories archive
- [ ] Uni Vibe of the Year + Hall of Fame
- [ ] Marketplace
- [ ] Advanced AI (translations, summaries, moderation)
- [ ] Offline mode
- [ ] Multi-region deployment
- [ ] Creator program and monetization
- [ ] API for third-party integrations

---

## Part 24 — Cursor AI & Project Rules

See **[PROJECT.md](./PROJECT.md)** for complete Cursor AI guidance including:

- Project vision and goals
- Coding standards and naming conventions
- Folder structure and component architecture
- UI/UX guidelines (glassmorphism, dark mode)
- React best practices
- Backend conventions (when added)
- Git workflow
- Performance and security requirements
- Accessibility checklist

Cursor rules are also defined in `.cursor/rules/` for automatic AI context.

---

## Document Maintenance

| Rule | Description |
|------|-------------|
| **Living document** | Update this file when features are added, changed, or shipped |
| **Version bumps** | Increment version number on major updates |
| **Status tracking** | Update Part 18 page statuses and Part 23 checkboxes |
| **Single source of truth** | If code and blueprint disagree, blueprint wins until intentionally changed |
| **AI reference** | All AI assistants should read this before generating code |

---

*Uni Vibe — Where Campus Comes Alive. UV it!*
