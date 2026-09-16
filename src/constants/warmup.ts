/**
 * Warmup constants — FITNESS OS
 *
 * Architecture:
 *   - Primary data source: DB (auxiliary_routines table via getRoutineExercises('warmup'))
 *   - Fallback: Day-specific constants below (used when DB is empty or unreachable)
 *   - WireframeWarmup component falls back to WARMUP_EXERCISES when no DB data
 *
 * Warmup specs per workout .md files (monday.md – sunday.md):
 *   All days share: Marching / High Knees + mobility/activation work specific to the day's muscle targets
 */

export interface WarmupExercise {
  id: string
  name: string
  /** Timer-based exercise (seconds). Mutually exclusive with reps. */
  durationSeconds?: number
  /** Rep-based description e.g. "2 × 12–15". Mutually exclusive with durationSeconds. */
  reps?: string
  /** Optional coaching note shown in UI */
  note?: string
}

/**
 * Day-specific warmup exercises matching each day's muscle targets.
 * Used as fallback when DB has no warmup routine, and for future day-aware warmup feature.
 */
export const DAY_WARMUP_EXERCISES: Record<string, WarmupExercise[]> = {
  monday: [
    { id: 'mon_w1', name: 'Marching / Light High Knees',       durationSeconds: 120, note: 'Raise body temperature' },
    { id: 'mon_w2', name: 'Arm Circles + Shoulder Rotations',  durationSeconds: 60,  note: 'Shoulder mobility' },
    { id: 'mon_w3', name: 'Band Pull-Apart',                    reps: '2 × 12–15',   note: 'Activate upper back / rear delt' },
    { id: 'mon_w4', name: 'Scapular Push-up',                   reps: '2 × 8–10',    note: 'Prepare shoulder girdle' },
    { id: 'mon_w5', name: 'Incline Push-up',                    reps: '1 × 8–10',    note: 'Prime chest pattern' },
  ],
  tuesday: [
    { id: 'tue_w1', name: 'Marching / Light High Knees',       durationSeconds: 120 },
    { id: 'tue_w2', name: 'Dead Bug',                           reps: '2 × 8–10/side', note: 'Core activation + anti-extension' },
    { id: 'tue_w3', name: 'Reverse Crunch',                     reps: '2 × 10–15' },
    { id: 'tue_w4', name: 'Band Pull-Apart + Shoulder Rotation',reps: '2 × 12–15',    note: 'Rear delt activation' },
  ],
  wednesday: [
    { id: 'wed_w1', name: 'Brisk Marching / Light High Knees', durationSeconds: 120 },
    { id: 'wed_w2', name: 'Dead Bug',                           reps: '2 × 8–10/side', note: 'Core stability' },
    { id: 'wed_w3', name: 'Plank',                              durationSeconds: 40,    note: 'Core + shoulder stability' },
    { id: 'wed_w4', name: 'Bodyweight Squat + Hip/Ankle Mobility', reps: '2 × 10',    note: 'Prime knee/hip pattern' },
  ],
  thursday: [], // Rest day — no warmup needed
  friday: [
    { id: 'fri_w1', name: 'Marching / Light High Knees',       durationSeconds: 120 },
    { id: 'fri_w2', name: 'Dead Bug',                           reps: '2 × 8–10/side' },
    { id: 'fri_w3', name: 'Reverse Crunch',                     reps: '2 × 10–15' },
    { id: 'fri_w4', name: 'Band Pull-Apart + Arm Circles',      reps: '2 × 12–15',   note: 'Shoulder + rear delt prep' },
  ],
  saturday: [
    { id: 'sat_w1', name: 'Marching / Light High Knees',       durationSeconds: 120 },
    { id: 'sat_w2', name: 'Dead Bug',                           reps: '2 × 8–10/side' },
    { id: 'sat_w3', name: 'Heel Taps',                          reps: '2 × 16–20' },
    { id: 'sat_w4', name: 'Band Pull-Apart + Arm Circles',      reps: '2 × 12–15' },
  ],
  sunday: [
    { id: 'sun_w1', name: 'Marching / Light High Knees',              durationSeconds: 120 },
    { id: 'sun_w2', name: 'Bird Dog',                                   reps: '2 × 8–10/side', note: 'Core + hip stability' },
    { id: 'sun_w3', name: 'Plank',                                      durationSeconds: 40 },
    { id: 'sun_w4', name: 'Bodyweight Reverse Lunge + Hip Mobility',   reps: '2 × 8/leg' },
  ],
}

/**
 * Generic warmup used as the primary fallback in WireframeWarmup.
 * Based on the common elements across all day-specific warmups.
 * These match what is seeded into the DB in schema.sql Section 21.
 *
 * NOTE: All exercises use durationSeconds because the warmup timer UI
 *       only supports timed exercises (no rep-based timer display).
 *       Rep-based exercises are approximated with a 45-second hold.
 */
export const WARMUP_EXERCISES: WarmupExercise[] = [
  { id: 'w1', name: 'Marching / Light High Knees',          durationSeconds: 120, note: 'Raise body temperature' },
  { id: 'w2', name: 'Arm Circles + Shoulder Rotations',     durationSeconds: 60,  note: 'Shoulder mobility' },
  { id: 'w3', name: 'Band Pull-Apart',                       durationSeconds: 45,  note: '2 × 12–15 — activate upper back' },
  { id: 'w4', name: 'Dead Bug',                              durationSeconds: 45,  note: '2 × 8–10/side — core activation' },
  { id: 'w5', name: 'Plank',                                 durationSeconds: 40,  note: 'Core + shoulder stability' },
  { id: 'w6', name: 'Bodyweight Squat (Hip Mobility)',       durationSeconds: 45,  note: '2 × 10 — prime hip/knee pattern' },
]

/** Warmup page hero image */
export const WARMUP_IMAGE = '/images/Full Body Warm-Up Routine/Full Body Warm-Up.png'

/**
 * Get day-specific warmup exercises with generic fallback.
 * @param day - e.g. 'monday', 'tuesday', etc. (case-insensitive)
 */
export function getWarmupForDay(day: string): WarmupExercise[] {
  const specific = DAY_WARMUP_EXERCISES[day.toLowerCase()]
  if (specific && specific.length > 0) return specific
  return WARMUP_EXERCISES
}
