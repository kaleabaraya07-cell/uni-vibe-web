Uni Vibe 🎓

The Digital Home of University Life

Connecting students. Celebrating campus life. Bringing universities together.

Uni Vibe is a university-focused social platform designed to bring the experiences, communities, and cultures of university life into one digital space. From sharing campus moments and discovering student communities to exploring university events and competing through a university-wide league, Uni Vibe aims to make university life more connected, engaging, and memorable.

The vision is simple: every university should have a digital home where its community can connect, express itself, and be celebrated.

«Project Status: In Development
Project Type: Social Networking Platform
Founder & Lead Developer: Kalab Araya 
Primary Focus: Web Frontend Development, Product Design, and Platform Architecture»

---

📖 Table of Contents

- "About the Project" (#-about-the-project)
- "The Problem" (#-the-problem)
- "Our Solution" (#-our-solution)
- "Key Features" (#-key-features)
- "Uni Vibe League" (#-uni-vibe-league)
- "Technology Stack" (#-technology-stack)
- "Project Architecture" (#-project-architecture)
- "My Role" (#-my-role)
- "Development Roadmap" (#-development-roadmap)
- "Current Status" (#-current-status)
- "Long-Term Vision" (#-long-term-vision)

---

🌍 About the Project

University life is about more than lectures, assignments, and examinations. It is also about friendships, football matches, cultural celebrations, student clubs, campus events, personal achievements, and the memories people create together.

However, these experiences are often scattered across different social media platforms, messaging groups, and disconnected university communities.

Uni Vibe aims to bring these experiences together in one university-centered platform.

It is being designed for university students and the wider university community, creating a space where people can discover campus life, engage with university communities, and celebrate the experiences that make each institution unique.

Uni Vibe is more than a place to post content. Its long-term ambition is to become a digital ecosystem for university life.

🎯 The Problem

University communities need better ways to:

- Discover what is happening across their campuses.
- Share experiences and preserve university memories.
- Connect with other students and student communities.
- Find university clubs, events, and opportunities.
- Showcase the identity and achievements of their universities.
- Celebrate positive participation and friendly competition between institutions.

Traditional social platforms serve many purposes, but university-specific experiences are often mixed with unrelated content.

Uni Vibe addresses this gap by placing university life at the center of the experience.

💡 Our Solution

Uni Vibe is being developed as a dedicated digital environment for university communities.

The platform brings together social networking, campus discovery, university communities, events, and friendly inter-university competition.

Its core principles are:

- Community first: Build meaningful connections around university life.
- Student expression: Give verified university students a place to share their experiences.
- University identity: Help institutions and their communities showcase their culture and achievements.
- Discoverability: Make campus content, events, clubs, and universities easier to explore.
- Positive competition: Encourage participation through the Uni Vibe League.
- Accessibility: Create an experience that works across desktop, tablet, and mobile devices.
- Room to grow: Build the frontend with a structure that can support future backend and mobile applications.

---

✨ Key Features

The following describes the product's planned functionality. Individual features are being implemented and tested as development progresses.

🏠 1. Personalized Home Feed

A central place to discover university life through photos, videos, campus experiences, student activities, and community updates.

Planned capabilities include:

- Personalized content discovery.
- Interactive posts.
- Likes, comments, reposts, and saves.
- Photo and video content.
- Stories and campus moments.
- Content reporting and community safety controls.

🎓 2. University Profiles

Dedicated spaces for universities to represent their identity and showcase their communities.

Planned capabilities include:

- University logos, covers, and descriptions.
- University-specific content.
- Campus information and departments.
- Clubs and events.
- University League standings.
- Student contributions and achievements.

Universities will be added through an approved directory rather than unrestricted user-created entries.

🏆 3. Uni Vibe League

The Uni Vibe League introduces a friendly, season-based competition between universities.

It is designed to recognize meaningful community engagement and celebrate the universities and students contributing to campus life.

Planned capabilities include:

- University rankings.
- Season-based leaderboards.
- Student contributor rankings.
- Historical season archives.
- University achievements and awards.
- Transparent, understandable explanations of how rankings work.

The League is intended to encourage participation and community pride rather than simply reward the volume of content published.

👤 4. Student Profiles

Personal profiles where students can represent themselves and share their university experiences.

Planned capabilities include:

- Profile pictures and biographies.
- University affiliation.
- Personal posts and activity.
- Saved content.
- Student verification indicators.
- Recognition for contributions and achievements.

💬 5. Chat and Notifications

Communication features designed to help users stay connected.

Planned capabilities include:

- Private conversations.
- Messaging interfaces.
- Notifications for relevant activity.
- Updates related to posts and interactions.
- A foundation for future real-time messaging.

Live messaging and persistent notifications will require backend integration.

🎪 6. Clubs and Events

Dedicated discovery experiences for student clubs, university activities, and campus events.

The goal is to help students find communities, discover activities, and participate more actively in university life.

🔎 7. Search and Discovery

Search experiences designed to make the university ecosystem easier to navigate.

Planned discovery categories include:

- Universities.
- Students.
- Posts and hashtags.
- Clubs.
- Events.

💼 8. Opportunities

A dedicated space intended to bring university students closer to opportunities such as:

- Internships.
- Scholarships.
- Jobs.
- Training programs.
- Other educational and professional opportunities.

🔐 9. Student Verification and Community Safety

Uni Vibe is designed around an important distinction: everyone can create an account, but posting privileges are reserved for verified university students.

Non-student users may browse and participate in permitted interactions without receiving student posting privileges.

The planned verification experience includes:

- University selection.
- Student verification requests.
- Verification status tracking.
- Requests to add a missing university.
- Appropriate restrictions for unverified accounts.

The full verification process, enforcement, and secure moderation will require backend support.

---

🏆 Uni Vibe League: Building a Culture of Participation

The Uni Vibe League is one of the platform's defining concepts.

Instead of treating universities as passive profile pages, the League is designed to give each university a visible presence within a broader community.

Students contribute through their participation, while universities build recognition through engagement with their communities.

The long-term goal is to create a positive competitive environment in which universities can celebrate their achievements, recognize contributors, and preserve their history across annual seasons.

The League will require server-side ranking calculations, reliable engagement data, and appropriate anti-abuse controls before it can operate as an authoritative competition.

---

🛠️ Technology Stack

Uni Vibe is being developed with a frontend-first approach. The initial priority is to build and refine the user experience before integrating the backend.

Current Frontend

Technology| Purpose
React| Component-based user interface
Vite| Frontend development and build tooling
JavaScript / JSX| Application logic and UI components
CSS| Styling, layouts, and responsive design

The exact dependencies and versions should be confirmed from the project's current package configuration.

Planned Backend and Infrastructure

The following technologies represent the intended future architecture, not a claim that these systems are already implemented.

Technology| Intended Purpose
Python| Backend development
FastAPI| API development
PostgreSQL| Persistent relational data
Redis| Caching and selected real-time or background-processing support
Object storage and CDN| Media storage and delivery
Flutter| Potential cross-platform mobile application

The final infrastructure will be selected and implemented as the product requirements evolve.

---

🏗️ Project Architecture

Uni Vibe is following a frontend-first development strategy while preparing for a more complete application architecture.

Current Development Direction

┌──────────────────────────────────────┐
│           React Web Frontend         │
│                                      │
│  Pages • Components • UI State       │
│  Navigation • Responsive Design      │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│       Frontend Service Layer         │
│                                      │
│  API Boundaries • Mock Services      │
│  Data Handling • Error States        │
└──────────────────────────────────────┘

Intended Future Architecture

┌───────────────────┐    ┌───────────────────┐
│   React Web App   │    │  Flutter Mobile   │
└─────────┬─────────┘    └─────────┬─────────┘
          │                        │
          └───────────┬────────────┘
                      ▼
           ┌────────────────────┐
           │   FastAPI Backend  │
           │                    │
           │ Authentication     │
           │ Posts and Feeds    │
           │ Universities       │
           │ Messaging          │
           │ Notifications      │
           │ League and Ranking │
           └──────────┬─────────┘
                      │
                      ▼
           ┌────────────────────┐
           │   Data Services    │
           │                    │
           │ PostgreSQL         │
           │ Redis              │
           │ Media Storage      │
           └────────────────────┘

The frontend should communicate with mock services where backend functionality is not yet available. This allows the interface to be developed and tested without pretending that mock interactions are already persistent or production-ready.

The architecture may evolve as requirements, scale, and operational needs become clearer.

---

👨‍💻 My Role

Kalab Araya — Founder & Lead Developer

I initiated Uni Vibe from an idea: what if every university had a digital home dedicated to the experiences, people, communities, and memories that make university life special?

I am leading the development of Uni Vibe, turning that idea into a structured product with a clear vision, defined user journeys, and a foundation for future expansion.

My responsibilities include:

Product Vision and Strategy

- Defining the purpose, direction, and long-term vision of Uni Vibe.
- Identifying the problems the platform is intended to solve.
- Establishing its core features, user roles, and product requirements.
- Planning how the platform can evolve into a broader university ecosystem.

Product Design and User Experience

- Planning the user journeys and interaction flows.
- Shaping the platform's visual identity and interface direction.
- Designing experiences for university communities, student profiles, content discovery, and the Uni Vibe League.
- Considering responsive behavior across desktop, tablet, and mobile devices.

Frontend Development

- Working on the React-based web application.
- Building and improving pages, reusable components, layouts, and navigation.
- Connecting interface components to frontend state and service layers.
- Identifying incomplete user journeys and improving usability.
- Preparing the frontend for future API integration.

Technical Planning and Architecture

- Defining the separation between frontend responsibilities and future backend services.
- Planning the integration path toward a Python and FastAPI backend.
- Considering data persistence, authentication, student verification, and platform security.
- Establishing requirements for future ranking, moderation, and community-management systems.

Product Development and Iteration

- Testing the application as features are implemented.
- Identifying problems and refining the product.
- Using development tools and AI-assisted coding workflows to accelerate implementation and learning.
- Prioritizing a maintainable foundation over simply making individual screens look complete.

I am building Uni Vibe while continuing to develop my software engineering skills. For me, the project is both a product I want to bring to life and a long-term opportunity to learn, build, and solve a real problem.

My goal is not just to build another social media application. It is to build something that gives university communities a stronger digital identity.

---

🚀 Development Roadmap

Uni Vibe is being developed incrementally, with frontend functionality and usability as the current priority.

Phase 1 — Frontend Foundation

- [x] Establish the core product vision.
- [x] Define the primary user journeys and product requirements.
- [ ] Consolidate the existing frontend structure.
- [ ] Improve shared layouts and navigation.
- [ ] Establish reusable UI components and consistent styling.

Phase 2 — Core Social Experience

- [ ] Complete account registration and login interfaces.
- [ ] Build the student verification experience.
- [ ] Complete the main feed and post interactions.
- [ ] Implement the post creation interface.
- [ ] Complete student profiles and saved content.
- [ ] Improve search and discovery.

Phase 3 — University Ecosystem

- [ ] Complete the university directory and profile pages.
- [ ] Implement the missing-university request experience.
- [ ] Develop clubs and events interfaces.
- [ ] Connect university content to the wider user experience.

Phase 4 — Uni Vibe League

- [ ] Build the League leaderboard.
- [ ] Add season and historical-ranking interfaces.
- [ ] Display student contributors and university achievements.
- [ ] Explain the scoring system in plain language.
- [ ] Prepare the interface for authoritative backend ranking data.

Phase 5 — Connected Experiences

- [ ] Complete chat and notification interfaces.
- [ ] Build the opportunities section.
- [ ] Complete settings and privacy experiences.
- [ ] Refine loading, empty, and error states.

Phase 6 — Quality and Backend Integration

- [ ] Test the application across screen sizes.
- [ ] Improve accessibility and performance.
- [ ] Run available lint checks, tests, and production builds.
- [ ] Develop the FastAPI backend.
- [ ] Integrate persistent storage, authentication, and media handling.
- [ ] Implement server-side permissions, verification, and ranking controls.

Roadmap checkboxes should be updated as work is completed and verified.

---

📌 Current Status

Uni Vibe is an active development project.

The current priority is to complete and refine the existing React frontend while keeping the architecture ready for future backend integration.

Some screens and interactions may still be incomplete, and features that depend on authentication, persistent storage, real-time communication, or authoritative server-side data will require additional implementation.

The project should not be considered production-ready until its functionality, security, data handling, and deployment have been appropriately implemented and tested.

---

🌱 Long-Term Vision

The long-term vision for Uni Vibe extends beyond a website.

I want to create a platform that becomes a meaningful part of university life: a place where students discover opportunities, communities share their stories, universities celebrate their achievements, and memories remain connected to the institutions where they were created.

Over time, Uni Vibe could expand into a broader ecosystem connecting students, universities, clubs, events, and educational opportunities across institutions.

The ambition is to grow from a focused product into a sustainable technology company built around university communities.

One platform. Every campus. A shared university experience.

---

🤝 Collaboration

Uni Vibe is an evolving project, and there is room for future collaboration across software development, product design, university partnerships, community building, and other areas.

As the project develops, this repository can become a foundation for collaboration with people who share the vision of making university life more connected and accessible.

---

©️ Project

Uni Vibe — The Digital Home of University Life

Founded and led by Kalab Araya.

Built with a vision to connect students, celebrate campus life, and bring university communities together.
[![Watch Demo Video](https://img.shields.io/badge/🎥_Watch_Demo_Video-Google_Drive-blue?style=for-the-badge)](https://drive.google.com/file/d/1UNYjAWmqqo5xFmQIPS41AzVhc_fl_i5Z/view?usp=drivesdk)
