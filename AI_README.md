# FITNESS OS - System Architecture & AI Context

> **Note to AI Assistants (ChatGPT, Claude, etc.):** 
> This document provides the full technical context of the FITNESS OS project. Use this to understand the tech stack, folder structure, database schema, and core concepts before suggesting code changes or architectural updates.

## 🎯 Project Goal
FITNESS OS is a highly dynamic, premium, dark-mode fitness application built to provide users with a structured daily workout schedule, active workout tracking, progress analytics, and an integrated AI Coach. It includes a robust **Admin Command Center** that allows the administrator to globally manage the application's workout templates and exercise databases.

## 🛠️ Technology Stack & Methods
- **Framework**: Next.js 14+ (App Router, heavily utilizing React Server Components & Server Actions).
- **Styling & UI**: TailwindCSS, Framer Motion (for micro-interactions & smooth transitions), Lucide React (icons), and custom raw CSS for specialized scrollbars (`index.css`).
- **Database & Auth**: Supabase (PostgreSQL). Uses `@supabase/ssr` for server-side auth/cookies.
- **State Management**: Zustand (primarily for the `useWorkoutStore` to manage active session state across pages).
- **AI Integration**: `@google/generative-ai` (Gemini) used for the AI Coach and generating daily motivational tips.

## 🧠 Core Concepts & Design Patterns
1. **Server vs. Client Components**:
   - The project strictly separates data fetching and UI rendering. Pages (e.g., `page.tsx`) are typically Server Components that fetch data directly from Supabase (bypassing the need for API routes) and pass it down as props to Client Components (e.g., `ClientAdminPage.tsx`, `ClientSchedulePage.tsx`).
2. **Server Actions (`src/actions/*`)**:
   - All database mutations (CRUD operations) are handled via Next.js Server Actions. These are imported directly into Client Components and trigger server-side execution.
3. **Admin Authorization & RLS**:
   - Supabase Row Level Security (RLS) is strictly enforced.
   - Admin access is verified either by checking if `profiles.role = 'admin'` OR checking if the authenticated email is exactly `himanshu.btmtcs4242906@nfsu.ac.in`.
   - The Admin Command Center (`/admin`) is conditionally rendered in the Sidebar only for the admin.
4. **Dynamic Global Schedule**:
   - Instead of hardcoded exercises, the app relies on `workout_templates` and `workout_template_exercises` tables. The Admin uses the Command Center's "Daily Schedule Builder" to define what exercises users perform on any given day. The User's `/schedule` and `/workout/session` pages dynamically read from this database.
5. **AI Coach Resiliency**:
   - The AI service (`src/services/ai-service.ts`) attempts to use `gemini-1.5-flash`, but automatically catches `404 Not Found` errors and falls back to `gemini-pro` to ensure compatibility across all Google Cloud API keys.

## 📂 Folder Structure
```text
FITNESS OS/
├── database/                    # Raw SQL schema files and RLS migration scripts
├── src/
│   ├── actions/                 # Next.js Server Actions for Supabase mutations (e.g., exercises.ts, templates.ts)
│   ├── app/                     # Next.js App Router root
│   │   ├── (main)/              # Authenticated route group (contains layout with Sidebar)
│   │   │   ├── admin/           # Admin Command Center
│   │   │   ├── coach/           # AI Coach Chat interface
│   │   │   ├── dashboard/       # Main user landing page
│   │   │   ├── schedule/        # Dynamic daily workout schedule viewer
│   │   │   └── workout/         # Active workout flows (warmup -> session -> cooldown)
│   │   ├── api/                 # API Routes (e.g., /api/admin/seed for DB seeding)
│   │   └── login/               # Authentication page (Google OAuth + custom Admin login)
│   ├── components/              # Reusable React components
│   │   ├── admin/               # Admin specific UI (ScheduleBuilder, ExerciseModal)
│   │   ├── shared/              # Global UI (Sidebar, TopNav)
│   │   └── workout/             # Complex active workout flow components (WorkoutFlow.tsx)
│   ├── constants/               # Legacy hardcoded data (being phased out for DB)
│   ├── hooks/                   # Custom React hooks (e.g., useWorkout.ts using Zustand)
│   ├── lib/                     # Library configurations (e.g., supabase/server.ts, supabase/client.ts)
│   ├── services/                # External service wrappers (e.g., ai-service.ts)
│   └── utils/                   # Helper functions (e.g., date-utils.ts)
```

## 🚀 Current State & Upcoming Roadmap
**Completed:**
- Full Supabase Auth integration (with isolated Admin flow).
- AI Coach with context-aware responses and automatic model fallbacks.
- Dynamic Global Schedule Builder: Database-driven workout assignments editable via the Command Center.
- Active Workout Engine: Zustand-powered session tracker with progress saving.

**Next Steps (TODO):**
1. **Community Integration**: Connect the static `/community` page to a live database feed (leaderboards, shared workouts).
2. **Advanced Analytics & History**: Enhance the database to track granular workout data (exact sets, reps, time elapsed, skipped exercises). Build a robust history and streak-tracking UI for the user.
3. **AI Data Analysis**: Inject the user's detailed workout history directly into the AI Coach context so it can analyze progress, suggest weight increases (progressive overload), and identify weak points.
4. **Performance Optimization**: Audit and optimize React renders, image loading, and database query efficiency to ensure a buttery-smooth user experience.
