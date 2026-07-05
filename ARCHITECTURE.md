# FITNESS OS Architecture

This document describes the current architecture, data modeling, and tech stack for FITNESS OS. Keep this updated as the project evolves.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Radix UI
- **Database / Auth:** Supabase (PostgreSQL)
- **AI Integration:** Google Gemini
- **State Management:** Zustand
- **Animation:** Framer Motion

## Database Schema (Current State)

### Live Tables (Actively Used)
- `profiles`: Core user accounts (linked to `auth.users`).
- `exercises`: The global dictionary of available exercises.
- `workout_templates` / `workout_template_exercises`: Custom workout routines built by users.
- `workouts_v5`, `workout_exercises_v5`, `workout_sets_v5`: The active workout tracking tables.
- `achievements`, `user_achievements`: Gamification and streak tracking.
- `personal_records`: User PRs per exercise.
- `streaks`: Daily usage streak tracking.
- `app_settings`: Global configuration overrides.
- `admin_logs`: Audit trail for admin actions.
- `secrets`: (NEW) Admin-only secure credential storage.

### Deprecated / Removed Tables
- `workout_sessions`, `workout_sets`: The v1/v2 tracking tables (removed).
- `martial_arts_sessions`, `muscle_focus_sessions`: The Phase 6 experimental tables (removed).

## Security Model
- **Row Level Security (RLS):** All user tables enforce RLS so users can only view and mutate their own rows (e.g. `auth.uid() = user_id`).
- **Admin Access:** Admins are determined by the `role = 'admin'` column in the `profiles` table. Modifying roles is restricted by a Postgres `WITH CHECK` constraint to prevent privilege escalation.
- **Secrets:** API keys (like `GEMINI_API_KEY`) are managed strictly via Vercel Environment Variables. The database does not leak keys to the client.

## Development Workflow
- **Type Safety:** The project uses `noUncheckedIndexedAccess` and strict TypeScript rules.
- **Validation:** Server Actions validate incoming payloads using `zod`.
- **Testing:** Pure logic functions (like streak calculation) are tested using Vitest.
