# FITNESS OS 🏋️‍♂️

![Fitness OS Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop)

> **A premium, high-performance web application designed for elite athlete tracking.**
> *This is a personal, self-learned project built by Himanshu Yadav to master advanced web architecture, complex state management, and modern UI/UX design.*

---

## 🌟 Overview

FITNESS OS is not just another workout tracker—it's a comprehensive, hardware-accelerated dashboard designed to offer a seamless, premium user experience. Built with Next.js and Supabase, it handles complex relational data, live streak computations, and sophisticated global state management across an uninterrupted, highly animated workout flow.

The core philosophy of this project was to push the boundaries of modern web development, focusing heavily on:
- **Flawless UI/UX:** Smooth, 60fps animations utilizing hardware acceleration (`translateZ`).
- **Robust Architecture:** Advanced Database Triggers and complex Row Level Security.
- **Future-Proofing:** Strict type safety and component-driven modular design.

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

## 🔄 The Core Workout Flow

FITNESS OS utilizes a highly engineered sequence to track athletes:

1. **The Dashboard (`/dashboard`)**: The central hub fetching live stats, current streaks, and the exact "Workout of the Day" via a high-performance database view (`workout_daily_summary`).
2. **Global Store Initialization**: Clicking "Start Mission" mounts the `useWorkoutStore` into memory and triggers a Live Workout Timer in the persistent Topbar.
3. **The Session (`/workout/...`)**: A dynamic flow through Warmup, Main Session, and Cooldown. Users can log actual reps, complete sets, or skip exercises.
4. **The Summary (`/workout/summary`)**: 
   - A highly optimized page using strictly ordered React Hooks.
   - Computes time deltas (actual vs estimated), total calories, and completion percentages.
   - Flags skipped exercises dynamically.
5. **Persistence (`saveWorkoutSession`)**: A Next.js Server Action that safely unwraps the global store payload, inserts the session into PostgreSQL, triggers backend XP recalculation, and commands an animated UI redirect.

## 💡 Key Learnings & Engineering Decisions

During the development of this project, several complex challenges were overcome:

- **React 'Rules of Hooks' Violations:** Engineered strict functional component layouts, moving all `useMemo` and `useEffect` calls above conditional returns to prevent infinite render loops and application freezing.
- **GPU Rendering Optimization:** Solved "black screen" rendering blocks by stripping heavy top-level `opacity: 0` wrappers and animating child elements directly with Z-axis transforms.
- **Idempotent SQL Schema:** Wrote a highly advanced, 500-line `schema.sql` file capable of running idempotently, featuring safe column migrations (`ADD COLUMN IF NOT EXISTS`) and robust conflict resolution to prevent `42P10` and `40P01` deadlock errors.

---

## 👨‍💻 Developer & Contact

**Created by:** Himanshu Yadav  
**Contact:** [mrhimanshu1234567@gmail.com](mailto:mrhimanshu1234567@gmail.com)  

*Built with passion, sweat, and thousands of lines of code. Keep Going!*
