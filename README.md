# 🌌 UniVerse – Your Cosmic Campus Companion

**Navigate your university journey like never before!** UniVerse is a space-themed, feature-rich platform designed to be your central hub for collaboration, events, mentorship, and innovation – all through an immersive, celestial interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌠 Overview

UniVerse brings together students, seniors, and alumni in one platform, offering features like peer finding, study group creation, AI guidance, and project matchmaking – all stored locally for a demo experience using `localStorage`.
This frontend-focused application is visually stunning and highly interactive, simulating a fully connected campus environment.

---
## Workflow-Flowchart :
<details>
<summary>📊 Flowchart Placeholder (Click to expand)</summary>

```mermaid
flowchart TD
    A[Landing Page - root] --> B[Welcome Hero Section with Starry Background]
    B --> C[Alien Guide Intro and Tips]
    B --> D[Feature Cards: Study Sphere, Event Horizon, Celestial Chats, Nebula of Ideas]
    D --> E[Detailed Explanations of Features]

    A --> F[User clicks User Icon]
    F --> G{Is Logged In?}
    G -- No --> H[Go to login or signup]
    H --> I[Signup Page]
    H --> J[Login Page]
    I --> K[Enter Email and Password]
    J --> L[Enter Email and Password]
    K --> M[Create Mock Session and Redirect to root]
    L --> M

    G -- Yes --> M[Main Page with Sidebar]

    M --> N[User Stats Sidebar]
    N --> O[Navigation: Study Sphere, Event Horizon, Chats, Ideas, Connections]
    N --> P[Stats: Connections, Skills, Projects]
    N --> Q[Edit My Profile Button]

    Q --> R[Open Profile Dialog]
    R --> S[Update Personal Info and Preferences]
    S --> T[Save to LocalStorage]

    O --> U[Study Sphere]
    O --> V[Event Horizon]
    O --> W[Celestial Chats]
    O --> X[Nebula of Ideas]
    O --> Y[My Connections]

    U --> U1[Alien Guide Tips]
    U --> U2[Tabs: Buddies, Groups, Resources, Sessions]

    U2 --> U3[Find Buddies and Connect]
    U2 --> U4[Join or Create Study Groups]
    U2 --> U5[Upload and View Resources]
    U2 --> U6[Schedule or Join Study Sessions]

    V --> V1[Alien Guide Tips]
    V --> V2[Tabs: Discover Events, Create Event, Recommendations, All Events]
    V2 --> V3[RSVP or Mark Interest]
    V2 --> V4[Create Peer Event]

    W --> W1[Alien Guide Tips]
    W --> W2[AI Chat, AMAs, Mentors, Archives]
    W2 --> W3[Connect to Mentor]

    X --> X1[Alien Guide Tips]
    X --> X2[View Project Ideas]
    X2 --> X3[Connect to Project Starters]

    Y --> Y1[Alien Guide Tips]
    Y --> Y2[View All Connections]
    Y2 --> Y3[Message - Toast]
    Y2 --> Y4[Disconnect]

    M --> Z[Header Avatar Dropdown]
    Z --> AA[Log Out]
    AA --> AB[Clear Session and Hide Sidebar]

```

</details>

## 🪐 Core Features

UniVerse is organized into four primary feature modules, all navigable via a persistent sidebar:

### 1\. Study Sphere 🧑‍🚀🤝🧑‍🚀

* Customizable academic profiles (learning styles, skills, courses)
* Buddy Finder with filterable matching
* Local peer connections
* Group creation/joining
* Resource upload & sharing
* Study session scheduling
    *(All data stored locally)*

### 2\. Event Horizon 🗓️🔭

* Campus-wide and peer-hosted event discovery
* Keyword and tag-based filtering
* RSVP and mark interest features (persisted locally)
* Peer event creation with form validation
* Simulated event recommendations

### 3\. Celestial Chats 🤖💬

* Stellar Assist AI powered by Genkit (Google)
* Mentor/Alumni profiles and AMA sessions (mocked)
* Simulated mentor connection flows (local-only)

### 4\. Nebula of Ideas 💡🚀

* Browse student-led project ideas
* Simulated requests to connect and collaborate
* *(WIP) Form to submit and filter project ideas*
* *(Future) Real-time project team spaces*

## 👽 Unique Elements

* **Animated Starry Background** – Powered by `react-tsparticles`
* **Global Alien Guide** – Contextual animated helper across the app
* **Persistent Navigation Sidebar** – Shows user stats and access to all features
* **Mock Authentication System** – Simulates signup/login using `localStorage`

## 🛠️ Tech Stack

### Frontend

* [Next.js](https://nextjs.org/) 15+ (App Router)
* [React](https://react.dev/) 18+ with [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
* [Lucide Icons](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/)
* [`react-tsparticles`](https://www.google.com/search?q=https://github.com/tsparticles/react-tsparticles) for starry background

### State & Persistence

* [React Context API](https://react.dev/learn/passing-data-deeply-with-context) for authentication
* `useState`, `useEffect` (React Hooks) for component-level state
* [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for user data persistence

### AI Integration

* [Genkit (Google)](https://genkit.dev/) – Powers the AI mentor/study assistant

## 🚀 Getting Started

### 1\. Prerequisites

* [Node.js](https://nodejs.org/en/) v18+
* [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 2\. Clone & Install

```bash
git clone <repository-url>
cd <project-directory>
npm install  # or yarn / pnpm install
```

### 3\. Run Locally

```bash
npm run dev
# App usually runs at http://localhost:3000
```

### 4\. Environment Variables (Optional)

To enable live Genkit AI features, create a `.env` file:

```ini
GOOGLE_API_KEY=your_key_here
```

## 📁 Project Structure (Simplified)

```bash
uni-verse/
├── src/
│   ├── app/
│   │   ├── (feature-pages)/      # Feature routes: Study Sphere, Event Horizon, etc.
│   │   ├── my-connections/        # Connections dashboard
│   │   ├── layout.tsx             # Root layout with sidebar
│   │   └── page.tsx               # Main landing/dashboard
│   ├── components/
│   │   ├── AlienGuide.tsx
│   │   ├── UserStatsSidebar.tsx
│   │   └── StarryBackground.tsx
│   ├── contexts/                # Auth and other React contexts
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utility functions
│   └── ai/                      # Genkit AI flows
├── public/                      # Static assets
├── tailwind.config.ts
└── package.json
```

## 🔮 Roadmap & Future Scope

### ✅ Current

* Frontend demo with mock login/signup
* Persistent profiles, events, connections (via `localStorage`)
* Functional AI assistant
* Space-themed polished UI

### 🛸 Coming Soon

* Full backend integration (Firebase / Supabase)
* Real-time messaging, group collaboration, mentor chats
* Full "Nebula of Ideas" implementation
* Notifications system
* Improved mobile responsiveness
* AI-driven recommendations

## 🙏 Acknowledgements

Thank you for exploring UniVerse\! 🌌
We believe in transforming campus life by building connected, inspiring, and intelligent digital spaces for every student.
