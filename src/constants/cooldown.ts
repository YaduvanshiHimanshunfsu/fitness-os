/**
 * Cooldown constants — FITNESS OS
 *
 * Architecture:
 *   - Primary data source: DB (auxiliary_routines table via getRoutineExercises('cooldown'))
 *   - Fallback: Generic cooldown below (used when DB is empty or unreachable)
 *   - ClientCooldownPage uses COOLDOWN_EXERCISES when no DB data
 *
 * Cooldown specs per workout .md files (monday.md – sunday.md):
 *   Monday:    Doorway Chest Stretch · Overhead Triceps Stretch · Lat Stretch · Wall Slides · Lateral Band Walk
 *   Tuesday:   Lat Stretch · Biceps + Forearm Stretch · Wall Angels · Side Lunges
 *   Wednesday: Hip-Flexor Stretch · Quad + Hamstring Stretch · Wall Angels · Butterfly Stretch · Controlled Sumo Squat
 *   Friday:    Shoulder Cross-Body Stretch · Overhead Triceps Stretch · Wall Angels · Side Lunges
 *   Saturday:  Lat Stretch · Chest + Triceps Stretch · Wall Angels · Side Lunge
 *   Sunday:    Hip-Flexor Stretch · Chest + Lat Stretch · Wall Angels · Side Lunge
 *
 * KEY FIX: Removed knee rehab exercises (Clamshells, Side Leg Raises, Wall Sit with Pillow)
 * from the generic cooldown. Those are posture/knockknee-correction exercises and
 * only belong in the dedicated Posture/KnockKnee auxiliary routines — NOT after every workout.
 */

export interface CooldownExercise {
  id: string
  name: string
  /** Timer-based stretch (seconds). */
  durationSeconds: number
  /** Optional coaching note */
  note?: string
}

/**
 * Day-specific cooldown exercises matching each day's muscle targets.
 * Stretches target the muscles just worked.
 */
export const DAY_COOLDOWN_EXERCISES: Record<string, CooldownExercise[]> = {
  monday: [
    { id: 'mon_c1', name: 'Doorway Chest Stretch',     durationSeconds: 30, note: 'Chest recovery — hold doorframe, lean forward' },
    { id: 'mon_c2', name: 'Overhead Triceps Stretch',  durationSeconds: 30, note: '30 sec each arm' },
    { id: 'mon_c3', name: 'Lat Stretch',               durationSeconds: 30, note: '30 sec each side — arm overhead, lean away' },
    { id: 'mon_c4', name: 'Wall Slides',               durationSeconds: 30, note: '2 × 10 — posture control' },
    { id: 'mon_c5', name: 'Lateral Band Walk',         durationSeconds: 30, note: '2 × 10/side — hip/knee control' },
  ],
  tuesday: [
    { id: 'tue_c1', name: 'Lat Stretch',               durationSeconds: 30, note: '30 sec each side' },
    { id: 'tue_c2', name: 'Biceps + Forearm Stretch',  durationSeconds: 30, note: '30 sec each side — arm straight, palm down' },
    { id: 'tue_c3', name: 'Wall Angels',               durationSeconds: 30, note: '2 × 10 — posture' },
    { id: 'tue_c4', name: 'Side Lunge (Hip Control)',  durationSeconds: 30, note: '2 × 8–10/side slow' },
  ],
  wednesday: [
    { id: 'wed_c1', name: 'Hip-Flexor Stretch',              durationSeconds: 30, note: '30 sec each side — lunge position' },
    { id: 'wed_c2', name: 'Quadriceps + Hamstring Stretch',  durationSeconds: 30, note: '30 sec each leg' },
    { id: 'wed_c3', name: 'Wall Angels',                      durationSeconds: 30, note: '2 × 10 — posture' },
    { id: 'wed_c4', name: 'Butterfly Stretch',                durationSeconds: 45, note: 'Hold 45 sec — adductor / groin' },
    { id: 'wed_c5', name: 'Controlled Sumo Squat',           durationSeconds: 30, note: '2 × 10 slow — hip/knee control' },
  ],
  thursday: [], // Rest day
  friday: [
    { id: 'fri_c1', name: 'Shoulder Cross-Body Stretch',   durationSeconds: 30, note: '30 sec each side' },
    { id: 'fri_c2', name: 'Overhead Triceps Stretch',      durationSeconds: 30, note: '30 sec each arm' },
    { id: 'fri_c3', name: 'Wall Angels',                   durationSeconds: 30, note: '2 × 10 — posture' },
    { id: 'fri_c4', name: 'Side Lunge (Hip Control)',      durationSeconds: 30, note: '2 × 8–10/side' },
  ],
  saturday: [
    { id: 'sat_c1', name: 'Lat Stretch',               durationSeconds: 30, note: '30 sec each side' },
    { id: 'sat_c2', name: 'Chest + Triceps Stretch',   durationSeconds: 30, note: '30 sec each side' },
    { id: 'sat_c3', name: 'Wall Angels',               durationSeconds: 30, note: '2 × 10 — posture' },
    { id: 'sat_c4', name: 'Side Lunge (Hip Control)',  durationSeconds: 30, note: '2 × 8–10/side' },
  ],
  sunday: [
    { id: 'sun_c1', name: 'Hip-Flexor Stretch',  durationSeconds: 30, note: '30 sec each side' },
    { id: 'sun_c2', name: 'Chest + Lat Stretch', durationSeconds: 30, note: '30 sec each side' },
    { id: 'sun_c3', name: 'Wall Angels',          durationSeconds: 30, note: '2 × 10 — posture' },
    { id: 'sun_c4', name: 'Side Lunge (Hip Control)', durationSeconds: 30, note: '2 × 8–10/side' },
  ],
}

/**
 * Generic cooldown — used as primary fallback when DB is empty.
 * Targets the most common muscle groups across all workout days.
 * These match what is seeded into the DB in schema.sql Section 21.
 *
 * KEY FIX: Replaced Cobra Stretch, Child's Pose, Clamshells, Side Leg Raises,
 * Wall Sit with Pillow (all wrong for general cooldown) with proper post-workout stretches.
 */
export const COOLDOWN_EXERCISES: CooldownExercise[] = [
  { id: 'c1', name: 'Lat Stretch',                    durationSeconds: 30, note: '30 sec each side — arm overhead, lean away from wall' },
  { id: 'c2', name: 'Chest Stretch',                  durationSeconds: 30, note: 'Doorway or wall — hold 30 sec' },
  { id: 'c3', name: 'Hip-Flexor Stretch',             durationSeconds: 30, note: 'Lunge position — 30 sec each side' },
  { id: 'c4', name: 'Quadriceps Stretch',             durationSeconds: 30, note: 'Standing — 30 sec each leg' },
  { id: 'c5', name: 'Hamstring Stretch',              durationSeconds: 30, note: 'Seated or standing — 30 sec each leg' },
  { id: 'c6', name: 'Wall Angels',                    durationSeconds: 30, note: '2 × 10 slow reps — posture correction' },
  { id: 'c7', name: 'Butterfly Stretch',              durationSeconds: 45, note: 'Hold 45 sec — hip/adductor mobility' },
  { id: 'c8', name: 'Side Lunge (Hip Control)',       durationSeconds: 30, note: '2 × 8–10/side — slow, controlled' },
]

/** Cooldown page hero image */
export const COOLDOWN_IMAGE = '/images/Post-Workout Cool Down Routine/Post-Workout Cool Down.png'

/**
 * Get day-specific cooldown exercises with generic fallback.
 * @param day - e.g. 'monday', 'tuesday', etc. (case-insensitive)
 */
export function getCooldownForDay(day: string): CooldownExercise[] {
  const specific = DAY_COOLDOWN_EXERCISES[day.toLowerCase()]
  if (specific && specific.length > 0) return specific
  return COOLDOWN_EXERCISES
}
