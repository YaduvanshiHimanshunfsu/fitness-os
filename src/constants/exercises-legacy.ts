/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LEGACY EXERCISE DATA — PRE V7.0 (archived, NOT in use)
 * ─────────────────────────────────────────────────────────────────────────────
 * Original exercise definitions replaced during the V7.0 upgrade.
 * Images remain intact in public/images/. NOT imported by any component.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Exercise } from './exercises';

export const LEGACY_EXERCISES: Exercise[] = [

  // ── MONDAY (legacy): Basic Chest + Triceps
  { id: 1, name: 'Chest Press',           muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Chest Press.png',              sets: 4, reps: '12',       exerciseOrder: 1, day: 'monday' },
  { id: 2, name: 'Push-Ups',              muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Push-up.png',                  sets: 3, reps: '10-15',    exerciseOrder: 2, day: 'monday' },
  { id: 3, name: 'Incline Chest Press',   muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Incline Chest Press.png',      sets: 3, reps: '12',       exerciseOrder: 3, day: 'monday' },
  { id: 4, name: 'Chest Fly',             muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Chest Fly.png',                sets: 3, reps: '12-15',    exerciseOrder: 4, day: 'monday' },
  { id: 5, name: 'Tricep Pushdown',       muscleGroup: 'triceps',  imageUrl: '/images/MONDAY/Triceps Pushdown.png',         sets: 3, reps: '12-15',    exerciseOrder: 5, day: 'monday' },
  { id: 6, name: 'Overhead Tricep Ext',   muscleGroup: 'triceps',  imageUrl: '/images/MONDAY/Overhead Triceps Extension.png', sets: 3, reps: '12',    exerciseOrder: 6, day: 'monday' },
  { id: 7, name: 'Hammer Curl',           muscleGroup: 'arms',     imageUrl: '/images/MONDAY/Hammer Curl.png',              sets: 3, reps: '12',       exerciseOrder: 7, day: 'monday' },

  // ── TUESDAY (legacy): Back + Biceps
  { id: 8,  name: 'Lat Pulldown',        muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Lat Pulldown.png',            sets: 4, reps: '12',       exerciseOrder: 1, day: 'tuesday' },
  { id: 9,  name: 'Bent Over Row',       muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Bent Over Row.png',           sets: 4, reps: '12',       exerciseOrder: 2, day: 'tuesday' },
  { id: 10, name: 'Seated Row',          muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Seated Row.png',              sets: 3, reps: '12',       exerciseOrder: 3, day: 'tuesday' },
  { id: 11, name: 'Face Pull',           muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Face Pull.png',               sets: 3, reps: '15',       exerciseOrder: 4, day: 'tuesday' },
  { id: 12, name: 'Biceps Curl',         muscleGroup: 'biceps',   imageUrl: '/images/TUESDAY/Biceps Curl.png',             sets: 3, reps: '12',       exerciseOrder: 5, day: 'tuesday' },
  { id: 13, name: 'Hammer Curl',         muscleGroup: 'biceps',   imageUrl: '/images/TUESDAY/Hammer Curl.png',             sets: 3, reps: '12',       exerciseOrder: 6, day: 'tuesday' },
  { id: 14, name: 'Wrist Curl',          muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Wrist Curl.png',              sets: 2, reps: '20',       exerciseOrder: 7, day: 'tuesday' },
  { id: 15, name: 'Reverse Wrist Curl',  muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Reverse Wrist Curl.png',      sets: 2, reps: '20',       exerciseOrder: 8, day: 'tuesday' },
  { id: 16, name: 'Farmer Hold',         muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Farmer Hold.png',             sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'tuesday' },

  // ── WEDNESDAY (legacy): Legs + Knee Stability
  { id: 17, name: 'Squats',         muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Tube Squat.png',      sets: 4, reps: '12-15',  exerciseOrder: 1, day: 'wednesday' },
  { id: 18, name: 'Backward Lunges',muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Reverse Lunge.png',   sets: 3, reps: '10-12',  exerciseOrder: 2, day: 'wednesday' },
  { id: 19, name: 'Glute Bridge',   muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Glute Bridge.png',    sets: 3, reps: '15',     exerciseOrder: 3, day: 'wednesday' },
  { id: 20, name: 'Side Lunges',    muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Side Lunge.png',      sets: 3, reps: '10',     exerciseOrder: 4, day: 'wednesday' },
  { id: 21, name: 'Calf Raises',    muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Calf Raise.png',      sets: 4, reps: '20',     exerciseOrder: 5, day: 'wednesday' },
  { id: 22, name: 'Wall Sit',       muscleGroup: 'legs', imageUrl: '/images/WEDNESDAY/Wall Sit.png',        sets: 2, reps: '45 sec', exerciseOrder: 6, day: 'wednesday' },

  // ── FRIDAY (legacy): Legs + Knee Stability
  { id: 23, name: 'Squats',         muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Squat.png',          sets: 4, reps: '12-15',  exerciseOrder: 1, day: 'friday' },
  { id: 24, name: 'Backward Lunges',muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Backward Lunge.png', sets: 3, reps: '10-12',  exerciseOrder: 2, day: 'friday' },
  { id: 25, name: 'Glute Bridge',   muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Glute Bridge.png',   sets: 3, reps: '15',     exerciseOrder: 3, day: 'friday' },
  { id: 26, name: 'Side Lunges',    muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Side Lunge.png',     sets: 3, reps: '10',     exerciseOrder: 4, day: 'friday' },
  { id: 27, name: 'Calf Raises',    muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Calf Raise.png',     sets: 4, reps: '20',     exerciseOrder: 5, day: 'friday' },
  { id: 28, name: 'Wall Sit',       muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Wall Sit.png',       sets: 2, reps: '45 sec', exerciseOrder: 6, day: 'friday' },

  // ── SATURDAY (legacy): Chest + Arms Variation
  { id: 29, name: 'Decline Push-Ups',   muscleGroup: 'chest',     imageUrl: '/images/SATURDAY/Decline Push Up.png',     sets: 3, reps: '8-12',    exerciseOrder: 1, day: 'saturday' },
  { id: 30, name: 'Hindu Push-Ups',     muscleGroup: 'chest',     imageUrl: '/images/SATURDAY/Hindu Push-Up.png',       sets: 3, reps: '8-10',    exerciseOrder: 2, day: 'saturday' },
  { id: 31, name: 'Brick Squeeze Press',muscleGroup: 'chest',     imageUrl: '/images/SATURDAY/Brick Squeeze Press.png', sets: 3, reps: '12-15',   exerciseOrder: 3, day: 'saturday' },
  { id: 32, name: 'Arnold Press',       muscleGroup: 'shoulders', imageUrl: '/images/SATURDAY/Arnold Press.png',        sets: 4, reps: '10',      exerciseOrder: 4, day: 'saturday' },
  { id: 33, name: 'Tricep Dips',        muscleGroup: 'triceps',   imageUrl: '/images/SATURDAY/Tricep Dip.png',          sets: 3, reps: '12-15',   exerciseOrder: 5, day: 'saturday' },
  { id: 34, name: 'Dumbbell Kickbacks', muscleGroup: 'triceps',   imageUrl: '/images/SATURDAY/Dumbbell Kickbacks.png',  sets: 3, reps: '12-15',   exerciseOrder: 6, day: 'saturday' },
  { id: 35, name: 'Hammer Curl',        muscleGroup: 'biceps',    imageUrl: '/images/SATURDAY/Hammer Curl.png',         sets: 3, reps: '12',      exerciseOrder: 7, day: 'saturday' },
  { id: 36, name: 'Reverse Wrist Curl', muscleGroup: 'forearms',  imageUrl: '/images/SATURDAY/Reverse Wrist Curl.png',  sets: 4, reps: '20',      exerciseOrder: 8, day: 'saturday' },
  { id: 37, name: 'Farmer Hold',        muscleGroup: 'forearms',  imageUrl: '/images/SATURDAY/Farmer Hold.png',         sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'saturday' },

  // ── SUNDAY (legacy): Full Body + Athletic
  { id: 38, name: 'Floor Press',    muscleGroup: 'chest',    imageUrl: '/images/SUNDAY/Floor Press.png',    sets: 4, reps: '12',      exerciseOrder: 1, day: 'sunday' },
  { id: 39, name: 'Bent Over Rows', muscleGroup: 'back',     imageUrl: '/images/SUNDAY/Bent Over Row.png',  sets: 4, reps: '12',      exerciseOrder: 2, day: 'sunday' },
  { id: 40, name: 'Step-Ups',       muscleGroup: 'legs',     imageUrl: '/images/SUNDAY/Step-Up.png',        sets: 3, reps: '10',      exerciseOrder: 3, day: 'sunday' },
  { id: 41, name: 'Backward Lunges',muscleGroup: 'legs',     imageUrl: '/images/SUNDAY/Backward Lunge.png', sets: 3, reps: '10',      exerciseOrder: 4, day: 'sunday' },
  { id: 42, name: 'Push-Ups',       muscleGroup: 'chest',    imageUrl: '/images/SUNDAY/Push-Up.png',        sets: 3, reps: '10-15',   exerciseOrder: 5, day: 'sunday' },
  { id: 43, name: 'Hammer Curl',    muscleGroup: 'arms',     imageUrl: '/images/SUNDAY/Hammer Curl.png',    sets: 3, reps: '12',      exerciseOrder: 6, day: 'sunday' },
  { id: 44, name: 'Plank',          muscleGroup: 'abs',      imageUrl: '/images/SUNDAY/Plank.png',          sets: 3, reps: '45 sec', exerciseOrder: 7, day: 'sunday' },
  { id: 45, name: 'Burpees',        muscleGroup: 'fullbody', imageUrl: '/images/SUNDAY/Burpee.png',         sets: 2, reps: '8',       exerciseOrder: 8, day: 'sunday' },
  { id: 46, name: 'Farmer Hold',    muscleGroup: 'forearms', imageUrl: '/images/SUNDAY/Farmer Hold.png',    sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'sunday' },
];
