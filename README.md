# FITNESS OS 🏋️‍♂️ v6.0

> **A premium, high-performance web application designed for elite athlete tracking.**
> *This is a personal, self-learned project built by Himanshu Yadav to master advanced web architecture, complex state management, and modern UI/UX design.*

---

## 🌟 Overview

FITNESS OS is not just another workout tracker—it's a comprehensive, hardware-accelerated dashboard designed to offer a seamless, premium user experience. Built with Next.js and Supabase, it handles complex relational data, live streak computations, and sophisticated global state management across an uninterrupted, highly animated workout flow.

With Version 6.0, the app has received a **massive** upgrade including a dedicated AI Coach, an Admin Command Center, and extreme performance optimizations.

## ✨ New in Version 6.0

- **Dedicated AI Fitness Coach**: Powered by Google Gemini AI, the coach analyzes your past workouts, answers health and diet questions (with strict safety guardrails), and generates dynamic post-workout summaries.
- **Admin Command Center**: A secure `/admin` portal restricted to authorized users. Includes a beautiful drag-and-drop UI to manage the exercise library and upload exercise images directly to Supabase Storage.
- **Admin Audit Logs**: Complete tracking of system changes, ensuring a secure audit trail for app settings and exercise modifications.
- **Extreme Performance Caching**: Utilizing Next.js `unstable_cache` with custom invalidation tags to serve heavy relational data instantly.
- **Premium Glassmorphic UI**: Completely overhauled visual language featuring deep dark modes, ambient glows, dynamic haptics, and 60fps GPU-accelerated micro-animations.

## 🏗️ Architecture & Tech Stack

### Frontend Layer
- **Framework:** Next.js 16 (App Router) with Turbopack for ultra-fast compilation.
- **Styling:** Vanilla CSS & TailwindCSS (hybrid) for absolute pixel-perfect control.
- **Animations:** Framer Motion (leveraging `will-change: transform` to offload work to the GPU).
- **State Management:** Zustand for global, lightning-fast store updates without React Context re-render cascades.
- **Icons:** Lucide React for crisp, scalable vector graphics.

### Backend Layer (Supabase)
- **Database:** PostgreSQL with 14 custom composite performance indexes.
- **Authentication:** Supabase Auth tightly coupled with `profiles` via automated SQL triggers.
- **Business Logic:** 
  - Live Database Triggers calculate workout `completion_score` automatically upon set insertion.
  - Streak Achievement Triggers award XP and unlock milestones natively on the database layer.
- **Security:** Strict Row Level Security (RLS) policies ensure users can only query their own session data.
- **Storage:** Supabase Storage integration for dynamic exercise media handling.

## 🔄 The Core Workout Flow

FITNESS OS utilizes a highly engineered sequence to track athletes:

1. **The Dashboard (`/dashboard`)**: The central hub fetching live stats, current streaks, and the exact "Workout of the Day" via a high-performance database view (`workout_daily_summary`).
2. **Global Store Initialization**: Clicking "Start Mission" mounts the `useWorkoutStore` into memory and triggers a Live Workout Timer in the persistent Topbar.
3. **The Session (`/workout/...`)**: A dynamic flow through Warmup, Main Session, and Cooldown. Users can log actual reps, complete sets, or skip exercises.
4. **The Summary (`/workout/summary`)**: 
   - A highly optimized page using strictly ordered React Hooks.
   - Computes time deltas (actual vs estimated), total calories, and completion percentages.
   - Flags skipped exercises dynamically.
   - **NEW**: Generates a live Gemini AI analysis of the workout.
5. **Persistence (`saveWorkoutSession`)**: A Next.js Server Action that safely unwraps the global store payload, inserts the session into PostgreSQL, triggers backend XP recalculation, and commands an animated UI redirect.

## 💡 Key Learnings & Engineering Decisions

During the development of this project, several complex challenges were overcome:

- **React 'Rules of Hooks' Violations:** Engineered strict functional component layouts, moving all `useMemo` and `useEffect` calls above conditional returns to prevent infinite render loops and application freezing.
- **GPU Rendering Optimization:** Solved "black screen" rendering blocks by stripping heavy top-level `opacity: 0` wrappers and animating child elements directly with Z-axis transforms.
- **Idempotent SQL Schema:** Wrote a highly advanced `schema.sql` file capable of running idempotently, featuring safe column migrations (`ADD COLUMN IF NOT EXISTS`) and robust conflict resolution to prevent `42P10` and `40P01` deadlock errors.
- **Type-Safety Enforcement:** Refactored complex nested Supabase queries from loose `as any` casts to strict generated `Database` interface types.

---

## 👨‍💻 Developer & Contact

**Created by:** Himanshu Yadav  
**Contact:** [himanshu.btmtcs4242906@nfsu.ac.in](mailto:himanshu.btmtcs4242906@nfsu.ac.in)  

*Built with passion, sweat, and thousands of lines of code. Keep Going!*
