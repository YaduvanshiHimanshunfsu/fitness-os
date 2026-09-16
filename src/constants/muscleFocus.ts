/**
 * Muscle Focus constants — FITNESS OS
 *
 * Architecture:
 *   - Primary data source: DB (muscle_focus tables) when useDbMuscleFocus = true
 *   - Fallback: These constants (always accurate, no DB dependency)
 *
 * Fixes applied (Audit v7.2):
 *   1. abs_core: Replaced 'Burpees' (full-body cardio, NOT abs isolation) with 'Dead Bug'
 *   2. back_shoulder: Added proper back exercises (Face Pull, Straight-Arm Pulldown)
 *                     Renamed 'Decline Brick Press (Pullover Variation)' to 'Brick Pullover'
 *                     Removed 'Brick Squeeze Press' from back_shoulder (it's a chest exercise)
 */

export const MUSCLE_FOCUS_CATEGORIES = [
  { id: 'chest_focus',   title: 'Chest Focus' },
  { id: 'arms_focus',    title: 'Arms Focus' },
  { id: 'abs_core',      title: 'Abs and Core' },
  { id: 'legs',          title: 'Legs' },
  { id: 'back_shoulder', title: 'Back and Shoulder' },
]

export const MUSCLE_FOCUS_TEMPLATES: Record<string, any[]> = {
  chest_focus: [
    {
      id: 'cf_1', name: 'Push-Ups',
      instruction: 'Standard push-ups', sets: '3-4', reps: '10-12',
      comment: 'Alt: Wall Push-Up / Incline Push-Up',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Push-Ups.png'
    },
    {
      id: 'cf_2', name: 'Brick Chest Press',
      instruction: 'Press with bricks', sets: '3-4', reps: '10-12',
      comment: 'Alt: Floor Press with Bricks',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Chest Press.png'
    },
    {
      id: 'cf_3', name: 'Brick Chest Fly',
      instruction: 'Fly motion with bricks', sets: '3-4', reps: '10-12',
      comment: 'Alt: Squeeze Press with Bricks',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Chest Fly.png'
    },
    {
      id: 'cf_4', name: 'Decline Push-Ups',
      instruction: 'Feet elevated — targets upper chest', sets: '3-4', reps: '10-12',
      comment: 'Alt: Normal Push-Up / Incline Push-Up',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Decline Push-Ups.png'
    },
    {
      id: 'cf_5', name: 'Hindu Push-Ups',
      instruction: 'Dive bomber style — chest + shoulder + core', sets: '3-4', reps: '8-10',
      comment: 'Alt: Incline Hindu Push-Up / Cobra Push-Up',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Hindu Push-Ups.png'
    },
    {
      id: 'cf_6', name: 'Brick Squeeze Press',
      instruction: 'Press while squeezing bricks together — constant chest tension', sets: '3-4', reps: '10-12',
      comment: 'Alt: Isometric Chest Squeeze',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Squeeze Press.png'
    },
    {
      id: 'cf_7', name: 'Floor Press',
      instruction: 'Press from the floor — controlled range of motion', sets: '3-4', reps: '10-12',
      comment: 'Alt: Brick Chest Press',
      image_url: '/images/MUSCLE_FOCUS/chest_focus/Floor Press.png'
    },
  ],

  arms_focus: [
    {
      id: 'af_1', name: 'Alternating Bicep Curl',
      instruction: 'Biceps Focus', sets: '3-4', reps: '10-12',
      comment: 'Alt: Two-Hand Curl',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Alternating Bicep Curl.png'
    },
    {
      id: 'af_2', name: 'Hammer Curl',
      instruction: 'Biceps + Brachialis Focus', sets: '3-4', reps: '10-12',
      comment: 'Alt: Regular Curl',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Hammer Curl.png'
    },
    {
      id: 'af_3', name: 'Tricep Extension',
      instruction: 'Triceps Focus — overhead extension', sets: '3-4', reps: '10-12',
      comment: 'Alt: Overhead Band Extension',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Tricep Extension.png'
    },
    {
      id: 'af_4', name: 'Tricep Dips',
      instruction: 'Triceps Focus — chair or floor dips', sets: '3-4', reps: '10-12',
      comment: 'Alt: Bench/Chair Assisted Dips',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Tricep Dips.png'
    },
    {
      id: 'af_5', name: 'Dumbbell Kickbacks (Brick/Bottle)',
      instruction: 'Triceps isolation — hinge forward, extend arm back', sets: '3-4', reps: '10-12',
      comment: 'Alt: Band Kickback',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Dumbbell Kickbacks (Brick_Bottle).png'
    },
    {
      id: 'af_6', name: 'Wrist Curl',
      instruction: 'Forearms & Grip Focus — palm up', sets: '3-4', reps: '15-20',
      comment: 'Alt: Band Wrist Curl',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Wrist Curl.png'
    },
    {
      id: 'af_7', name: 'Reverse Wrist Curl',
      instruction: 'Forearms & Grip Focus — palm down', sets: '3-4', reps: '15-20',
      comment: 'Alt: Band Reverse Wrist Curl',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Reverse Wrist Curl.png'
    },
    {
      id: 'af_8', name: 'Farmer Hold',
      instruction: 'Forearms & Grip Focus — isometric hold', sets: '3-4', reps: '30-45 sec',
      comment: 'Alt: Suitcase Hold with One Brick',
      image_url: '/images/MUSCLE_FOCUS/arms_focus/Farmer Hold.png'
    },
  ],

  // FIX: Added Face Pull (proper back exercise) + Straight-Arm Pulldown (lat isolation)
  // FIX: Renamed 'Decline Brick Press (Pullover Variation)' → 'Brick Pullover' (correct name)
  // FIX: Removed 'Brick Squeeze Press' from this category (it's a CHEST exercise, not back/shoulder)
  back_shoulder: [
    {
      id: 'bs_1', name: 'Bent Over Rows',
      instruction: 'Back Focus — hinge at hips, row to lower chest', sets: '3-4', reps: '10-12',
      comment: 'Alt: Single-Arm Brick Row',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Bent Over Rows.png'
    },
    {
      id: 'bs_2', name: 'Brick Pullover',
      instruction: 'Lat + Serratus Focus — lying, arc brick overhead', sets: '3-4', reps: '10-12',
      comment: 'Alt: Band Pullover',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Decline Brick Press.png'
    },
    {
      id: 'bs_3', name: 'Shoulder Press',
      instruction: 'Shoulders Focus — press overhead from shoulder height', sets: '3-4', reps: '10-12',
      comment: 'Alt: Seated Shoulder Press',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Shoulder Press.png'
    },
    {
      id: 'bs_4', name: 'Lateral Raises',
      instruction: 'Side Delt Focus — raise arms to shoulder height', sets: '3-4', reps: '12-15',
      comment: 'Alt: Band Lateral Raise',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Lateral Raises.png'
    },
    {
      id: 'bs_5', name: 'Pike Push-Ups',
      instruction: 'Shoulder + Upper Body — inverted V position', sets: '3-4', reps: '8-12',
      comment: 'Alt: Incline Pike Push-Up',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Pike Push-Ups.png'
    },
    {
      id: 'bs_6', name: 'Rear Delt Fly',
      instruction: 'Rear Delt + Upper Back Focus — hinge forward, fly arms back', sets: '3-4', reps: '12-15',
      comment: 'Alt: Band Rear Fly',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Rear Delt Fly.png'
    },
    {
      id: 'bs_7', name: 'Arnold Press',
      instruction: 'Full Delt — rotate palms inward to outward during press', sets: '3-4', reps: '10-12',
      comment: 'Alt: Normal Shoulder Press',
      image_url: '/images/MUSCLE_FOCUS/back_shoulder/Arnold Press.png'
    },
  ],

  // FIX: Replaced 'Burpees' (full-body cardio, NOT abs isolation) with 'Dead Bug' (proper core stability)
  abs_core: [
    {
      id: 'ac_1', name: 'Long Arm Crunches',
      instruction: 'Abs & Core Focus — arms extended overhead', sets: '3-4', reps: '12-15',
      comment: 'Alt: Normal Crunches',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Long Arm Crunches.png'
    },
    {
      id: 'ac_2', name: 'Heel Taps',
      instruction: 'Obliques & Core Focus — lateral reach to heel', sets: '3-4', reps: '16-20',
      comment: 'Alt: Side Crunches',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Heel Taps.png'
    },
    {
      id: 'ac_3', name: 'Mountain Climbers',
      instruction: 'Abs & Core — dynamic plank, drive knees alternately', sets: '3-4', reps: '30 sec',
      comment: 'Alt: Slow Mountain Climbers',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Mountain Climbers.png'
    },
    {
      id: 'ac_4', name: 'Reverse Crunch',
      instruction: 'Lower Abs Focus — curl hips off floor', sets: '3-4', reps: '12-15',
      comment: 'Alt: Bent Knee Leg Raise',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Reverse Crunch.png'
    },
    {
      id: 'ac_5', name: 'Plank',
      instruction: 'Core Stability — hold neutral spine position', sets: '3-4', reps: '30-60 sec',
      comment: 'Alt: Knee Plank',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Plank.png'
    },
    {
      // FIX: Replaced Burpees (cardio, not core isolation) with Dead Bug (anti-extension core stability)
      id: 'ac_6', name: 'Dead Bug',
      instruction: 'Core Anti-Extension — extend opposite arm/leg, keep back flat', sets: '3-4', reps: '8-10/side',
      comment: 'Alt: Bird Dog',
      image_url: '/images/MUSCLE_FOCUS/abs_core/Dead Bug.png'
    },
  ],

  legs: [
    {
      id: 'l_1', name: 'Squats',
      instruction: 'Quads + Glutes Focus', sets: '3-4', reps: '12-15',
      comment: 'Alt: Chair Squats',
      image_url: '/images/MUSCLE_FOCUS/legs/Squats.png'
    },
    {
      id: 'l_2', name: 'Backward Lunges',
      instruction: 'Quads + Glutes — step back, knee to 90°', sets: '3-4', reps: '10-12 each',
      comment: 'Alt: Static Split Squat / Reverse Step Tap',
      image_url: '/images/MUSCLE_FOCUS/legs/Backward Lunges.png'
    },
    {
      id: 'l_3', name: 'Glute Bridge',
      instruction: 'Glutes + Hamstrings Focus', sets: '3-4', reps: '12-15',
      comment: 'Alt: Hip Bridge Hold',
      image_url: '/images/MUSCLE_FOCUS/legs/Glute Bridge.png'
    },
    {
      id: 'l_4', name: 'Side Lunges',
      instruction: 'Adductors + Glutes — lateral lunge, keep knee over toes', sets: '3-4', reps: '10-12 each',
      comment: 'Alt: Side Step Squat',
      image_url: '/images/MUSCLE_FOCUS/legs/Side Lunges.png'
    },
    {
      id: 'l_5', name: 'Calf Raises',
      instruction: 'Calf + Soleus Focus — full range, slow descent', sets: '3-4', reps: '15-20',
      comment: 'Alt: Supported Calf Raises',
      image_url: '/images/MUSCLE_FOCUS/legs/Calf Raises.png'
    },
    {
      id: 'l_6', name: 'Step-Ups',
      instruction: 'Quads + Glutes — step onto elevated surface', sets: '3-4', reps: '10-12 each',
      comment: 'Alt: Low Step-Up / Stair Step-Up',
      image_url: '/images/MUSCLE_FOCUS/legs/Step-Ups.png'
    },
  ],
}
