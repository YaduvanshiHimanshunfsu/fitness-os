<div align="center">

# 🏋️ FITNESS OS

### *Your Personal High-Performance Workout Operating System*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **A premium, full-stack athlete tracking platform — engineered for performance, built with passion.**
> *Personal project by Himanshu Yadav — mastering advanced web architecture, real-time data, and elite UI/UX.*

---

</div>

## 🌟 What is FITNESS OS?

FITNESS OS is not just another workout tracker. It's a **comprehensive, hardware-accelerated dashboard** that offers a seamless, premium experience for serious athletes. Built on Next.js 16 and Supabase PostgreSQL, it manages complex relational data, live streak computations, AI-powered coaching, and sophisticated global state across a fully animated workout flow.

**V7.0** brings the most complete overhaul yet — a fully restructured 6-day program (Mon/Tue/Wed/Fri/Sat/Sun), simplified 3-phase workout flow, and a new resistance-tube-first exercise library built for home athletes.

---

## 🚀 What's New in V7.0

| Feature | Description |
|---|---|
| 🏠 **New Exercise Library** | Completely redesigned 6-day split using resistance tubes, bricks & bodyweight |
| 📋 **3-Phase Workout Flow** | Simplified to: **Pre-Workout → Main Session → Post-Workout** |
| 🦵 **Knee Rehab Integration** | Knee correction exercises (Clamshells, Side Leg Raises, Wall Sit) built into every cooldown |
| 💾 **Legacy Archive** | Old exercise data preserved in `exercises-legacy.ts` — images retained |
| ⚡ **CSP Dev Fix** | `unsafe-eval` added in dev mode for React/Turbopack compatibility |
| 🧠 **Memory Optimization** | Node.js heap increased to 4GB to prevent OOM crashes during compilation |

---

## 🗓️ The 6-Day Program (V7.0)

| Day | Focus | Key Exercises |
|---|---|---|
| **Monday** | Chest + Triceps | Chest Press, Push-up Progression, Chest Fly, Triceps Pushdown |
| **Tuesday** | Back + Biceps + Forearms | Lat Pulldown, Bent-Over Row, Biceps Curl, Farmer Hold |
| **Wednesday** | Legs + Athletic Strength | Tube Squat, Bulgarian Split Squat, RDL, Step-Ups |
| **Thursday** | 🛌 Rest Day | Recovery |
| **Friday** | Shoulders + Chest + Triceps | Shoulder Press, Lateral Raise, Arnold Press, Rear-Delt Fly |
| **Saturday** | Back + Chest + Arms | Lat Pulldown, Face Pull, Chest Fly, Overhead Triceps Extension |
| **Sunday** | Full Body Athletic | Pulldown, Chest Press, RDL, Step-Ups, Lateral Raise, Farmer Hold |

---

## 🔄 The Workout Flow

```
Dashboard → Pre-Workout (Warmup) → Main Session → Post-Workout (Cooldown + Knee) → Summary
    1              2                     3                    4                        5
```

1. **Dashboard** — Live stats, streak tracking, day-of workout loaded
2. **Pre-Workout** — Guided warmup with timer
3. **Main Session** — Set-by-set logging with rest timers, pause/resume, skip
4. **Post-Workout** — Cooldown stretches + 3 integrated knee correction exercises
5. **Summary** — AI-generated analysis, XP earned, completion score, session save

---

## 🏗️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **Next.js 16** (App Router + Turbopack) | Core framework, SSR, file-based routing |
| **React 19** | UI layer with concurrent features |
| **Framer Motion** | GPU-accelerated 60fps animations |
| **Zustand** | Global workout state (no context re-renders) |
| **TailwindCSS 4** | Utility-first styling |
| **Lucide React** | Crisp, scalable icon set |

### Backend
| Tech | Purpose |
|---|---|
| **Supabase PostgreSQL** | Primary database with 14 composite indexes |
| **Supabase Auth** | Session management, RLS-protected data |
| **Supabase Storage** | Exercise media (images) |
| **Next.js Server Actions** | Type-safe DB mutations |
| **Database Triggers** | Auto-compute completion scores & XP on set insert |

### AI
| Tech | Purpose |
|---|---|
| **Google Gemini** | AI Coach, post-workout summaries, Q&A |

---

## ✨ Core Features

- 🤖 **AI Fitness Coach** — Powered by Gemini. Analyzes workouts, answers diet/health questions with safety guardrails
- 🛡️ **Admin Command Center** — `/admin` portal with drag-and-drop exercise management & image uploads
- 📊 **Live Analytics** — Streak tracking, XP system, workout heatmap, completion scores
- 🎯 **Gamification** — Achievements, level system, milestone notifications
- 🌓 **Dark / Light Mode** — System-aware theme with premium dark glassmorphic UI
- 📱 **PWA Ready** — Installable on mobile devices
- 🔐 **Row-Level Security** — Users only ever see their own data
- ⚡ **Edge Caching** — `unstable_cache` with tag-based invalidation for instant load times

---

## 🧠 Engineering Highlights

- **Strict TypeScript** — Zero `any` casts; all Supabase queries typed via generated `Database` interface
- **Idempotent SQL Schema** — Safe column migrations (`ADD COLUMN IF NOT EXISTS`), deadlock-free
- **React Hooks Compliance** — All `useMemo`/`useEffect` above conditional returns — no render loops
- **GPU Rendering** — Animations use `will-change: transform` + Z-axis transforms; no black-screen flicker
- **CSP-aware Dev Mode** — `unsafe-eval` scoped to development only; production stays strict

---

## 📁 Project Structure

```
fitness-os/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (main)/        # Authenticated routes
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── workout/   # Pre → Session → Cooldown → Summary
│   │   │   ├── coach/     # AI Coach
│   │   │   └── analytics/ # Performance analytics
│   │   └── admin/         # Admin command center
│   ├── components/        # Reusable UI components
│   ├── constants/         # Exercise library (exercises.ts, cooldown.ts)
│   ├── hooks/             # Zustand store (useWorkout.ts)
│   └── actions/           # Next.js Server Actions
├── public/
│   └── images/            # Exercise images (MONDAY/ TUESDAY/ ... SUNDAY/)
└── workout/               # Source exercise images by day
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Gemini API key

# Run development server (with memory optimization)
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👨‍💻 Developer

<div align="center">

**Built by Himanshu Yadav**

[![Email](https://img.shields.io/badge/Email-himanshu.btmtcs4242906%40nfsu.ac.in-red?style=flat-square&logo=gmail)](mailto:himanshu.btmtcs4242906@nfsu.ac.in)
[![GitHub](https://img.shields.io/badge/GitHub-YaduvanshiHimanshunfsu-black?style=flat-square&logo=github)](https://github.com/YaduvanshiHimanshunfsu)

*Built with passion, sweat, and thousands of lines of code.*
*Every commit is a rep. Keep going.* 💪

</div>

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
- **Strict TypeScript Integrity & Edge Routing**: Eliminated implicit 'any' data extraction and enforced non-null assertions across high-volume analytical joins. Resolved Next.js dynamic routing edge cases around server cookies.

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
