
# UniVerse 🌌✨ - Your Cosmic Campus Companion

**Navigate your university journey like never before! UniVerse is a feature-rich, space-themed web application designed to be the ultimate hub for students seeking academic collaboration, event discovery, insightful guidance, and innovative project development, fostering connections with peers, seniors, and alumni.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview 🌠

UniVerse is an immersive platform built to enhance the student experience by providing a centralized **dashboard and interactive hub** for all campus needs, all within an engaging and thematically exciting space environment. From finding the perfect study buddy and discovering campus events to gaining wisdom from AI and peers, or launching your next big project, UniVerse aims to connect, support, and inspire students by facilitating meaningful interactions with fellow students, experienced seniors, and guiding alumni (professors can be considered part of this "alumni/mentor" group).

This project showcases a highly interactive frontend experience, leveraging modern web technologies to simulate a dynamic and personalized platform. Core features are currently implemented with client-side persistence (`localStorage`) for a seamless single-user demo experience, laying a strong foundation for a fully-fledged, collaborative application with real-time connections.

---

<!--
**🚀 Live Demo (Optional)**
[Link to your live demo if you have one]

**📸 Screenshots (Optional)**
[Consider adding screenshots here to showcase the UI]
-->

## Core Features 🪐

UniVerse is built around four primary constellations of functionality, all accessible via a persistent sidebar acting as your main navigation dashboard:

1.  **Study Sphere 🧑‍🚀🤝🧑‍🚀 (Interactive Demo with Local Persistence)**
    *   **Detailed Study Profiles:** Customize your academic persona by specifying courses, skills, interests, project areas, and preferred learning styles (Visual, Auditory, Kinesthetic, Reading/Writing). Profile data is saved locally.
    *   **Dynamic Buddy Finder:** Discover and connect with potential study partners by filtering based on courses, learning styles, and other profile attributes.
    *   **Peer Connections:** Initiate connections with peers. Interactions and connections are currently managed locally. (Future: Real-time connection requests and shared profiles).
    *   **Group Collaboration:** Create new study groups or join existing ones (data saved locally).
    *   **Resource Sharing:** "Upload" and browse study materials (notes, summaries) within your local session.
    *   **Session Coordination:** Schedule and join study sessions (saved locally).

2.  **Event Horizon 🗓️🔭 (Interactive Demo with Local Persistence)**
    *   **Comprehensive Event Discovery:** Browse official campus events and peer-organized gatherings.
    *   **Advanced Filtering:** Search by keywords or filter events by interest tags.
    *   **Interactive RSVPs & Interest Marking:** Mark your attendance or interest, with choices saved locally.
    *   **Peer Event Creation:** Launch your own study sessions or informal meetups for others to see (within your local session).
    *   **Simulated Recommendations:** Get a glimpse of potential event recommendations based on locally available data.

3.  **Celestial Chats 🤖💬 (Functional AI Feature & Simulated Mentor Interaction)**
    *   **Stellar Assist AI:** Engage with an AI (powered by Genkit) trained to provide guidance and answer questions, embodying the collective wisdom of seniors and alumni.
    *   **Meet Mentors & AMAs:** View profiles of (hardcoded) senior students and alumni mentors. Explore upcoming (hardcoded) "Ask Me Anything" sessions.
    *   **Mentor Connections:** Reach out to mentors and alumni. Connection requests are currently simulated and managed locally. (Future: Direct messaging and confirmed connections with real mentors/professors).

4.  **Nebula of Ideas 💡🚀 (Conceptual Feature with Partial Interactivity)**
    *   **Showcase for Innovation:** A hub for students to share project ideas and find collaborators.
    *   **Collaborator Connections:** Connect with project initiators to join innovative ventures. Connection requests are currently simulated and managed locally. (Future: Team formation tools and shared project spaces).
    *   *(Currently, this feature primarily showcases project ideas with basic connection simulation. Enhanced interactivity like submitting ideas to `localStorage` and dynamic filtering is a planned enhancement.)*

**Unique UniVerse Elements:**

*   **Immersive Space Theme:** A visually stunning interface with a dynamic starry background, cosmic color palette, and thematic icons and animations.
*   **Global Alien Guide 👽:** A friendly, animated bot that provides contextual tips and guidance throughout the application, enhancing user onboarding and engagement.
*   **Persistent User Stats & Navigation Sidebar:** An always-visible sidebar (your main **dashboard for easy access**) displaying key user statistics (connections, skills, project areas) and providing quick navigation to all core features, including a dedicated "My Connections" page.
*   **Mock Authentication:** A simulated login/signup system allowing for a personalized demo experience and `localStorage` data scoping.

## Tech Stack 🛠️

*   **Frontend:**
    *   **Next.js 15+ (App Router):** For server-side rendering, client-side navigation, and a modern React framework.
    *   **React 18+:** For building dynamic user interfaces.
    *   **TypeScript:** For type safety and improved code quality.
    *   **ShadCN UI:** Beautifully designed, accessible, and customizable UI components.
    *   **Tailwind CSS:** For utility-first styling and rapid UI development.
    *   **Lucide Icons:** A comprehensive and clean icon library.
    *   **Framer Motion:** For smooth and engaging animations (used for some UI elements).
    *   **`react-tsparticles` & `tsparticles-slim`:** For the dynamic starry background effect.
    *   **Browser `localStorage`:** For client-side data persistence to simulate a dynamic and personalized experience for individual users.
*   **Artificial Intelligence:**
    *   **Genkit (by Google):** Powers the "Stellar Assist AI" in Celestial Chats.
*   **State Management:**
    *   React Context API (for mock authentication).
    *   Component-level state (`useState`, `useEffect`) for UI interactivity and `localStorage` management.

## Getting Started 🚀

To run UniVerse locally:

1.  **Prerequisites:**
    *   Node.js (v18.x or later recommended)
    *   npm, yarn, or pnpm

2.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

4.  **Environment Variables (Mock Setup):**
    *   The project is currently set up for mock authentication and does not require external API keys for its core demo functionality.
    *   If Genkit AI features are to be used with live models, a `.env` file with appropriate API keys (e.g., `GOOGLE_API_KEY`) would be needed.

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:3000` (or the port specified in your `package.json` if changed from default).

## Project Structure (Simplified) 📁

```
uni-verse/
├── src/
│   ├── app/                # Core application pages and layouts
│   │   ├── (feature-pages)/ # Folders for Study Sphere, Event Horizon, etc.
│   │   ├── my-connections/ # Dedicated page for user connections
│   │   ├── layout.tsx      # Root layout (includes sidebar and main content structure)
│   │   ├── page.tsx        # Main landing page / unified dashboard
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable UI components
│   │   ├── AlienGuide.tsx
│   │   ├── UserStatsSidebar.tsx # Main navigation and stats dashboard
│   │   ├── AnimatedHeroText.tsx
│   │   ├── StarryBackground.tsx
│   │   └── ui/             # ShadCN UI components
│   ├── contexts/           # React contexts (e.g., AuthContext for mock auth)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, (mock) Firebase setup
│   └── ai/                 # Genkit AI flows
├── public/                 # Static assets
├── package.json
└── tailwind.config.ts
```

## Current State & Future Scope 🔮

**Current State:**
*   UniVerse offers a highly interactive and visually polished **frontend-focused demo**.
*   **Mock Authentication:** Simulates user login/signup for a personalized experience.
*   **Client-Side Persistence:** Core features like "Study Sphere" (profiles, groups, resources, sessions, connections), "Event Horizon" (RSVPs, created events), and "My Connections" save user data and interactions to browser `localStorage`. This makes the experience persistent for a single user across sessions on the same browser.
*   **Functional AI:** The "Stellar Assist AI" in Celestial Chats is operational.
*   **Interactive UI for Core Features:** Study Sphere and Event Horizon have dynamic client-side forms, filtering, and list updates.
*   **"Nebula of Ideas"** is currently conceptual with basic connection simulation.

**Future Enhancements:**
*   **Full Backend Integration & Real-Time Connections:** Transition from `localStorage` and mock authentication to a robust backend solution (e.g., Firebase Authentication for users, Firestore/Supabase for database) to enable:
    *   Secure user accounts.
    *   **Real-time peer, mentor, and professor connections:** Implement systems for actual connection requests, shared profiles, and direct communication.
    *   Persistent data across devices for all users.
*   **Dynamic "Nebula of Ideas":** Implement full functionality for users to submit, browse, search, and collaborate on project ideas with real-time updates.
*   **Real-Time Chat/Messaging:** Integrate direct messaging between connected peers or within study groups.
*   **Notifications System:** For event reminders, new connection requests, group updates, etc.
*   **Advanced Personalization:** More sophisticated event and peer recommendations based on user activity and profile data.
*   **Mobile Responsiveness Polish:** Continued refinement for optimal viewing on all device sizes.

---

## Thank you for exploring UniVerse! We believe in its potential to transform the student experience by truly connecting its users.

---
