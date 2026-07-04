export const MUSCLE_FOCUS_CATEGORIES = [
  { id: 'chest_focus', title: 'Chest Focus' },
  { id: 'arms_focus', title: 'Arms Focus' },
  { id: 'abs_core', title: 'Abs and Core' },
  { id: 'legs', title: 'Legs' },
  { id: 'back_shoulder', title: 'Back and Shoulder' }
];

export const MUSCLE_FOCUS_TEMPLATES: Record<string, any[]> = {
  chest_focus: [
    { id: 'cf_1', name: 'Push-Ups', instruction: 'Standard push-ups', sets: '3-4', reps: '10-12', comment: 'Alt: Wall Push-Up / Incline Push-Up', image_url: '/images/MUSCLE_FOCUS/chest_focus/Push-Ups.png' },
    { id: 'cf_2', name: 'Brick Chest Press', instruction: 'Press with bricks', sets: '3-4', reps: '10-12', comment: 'Alt: Floor Press with Bricks', image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Chest Press.png' },
    { id: 'cf_3', name: 'Brick Chest Fly', instruction: 'Fly motion with bricks', sets: '3-4', reps: '10-12', comment: 'Alt: Squeeze Press with Bricks', image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Chest Fly.png' },
    { id: 'cf_4', name: 'Decline Push-Ups', instruction: 'Feet elevated', sets: '3-4', reps: '10-12', comment: 'Alt: Normal Push-Up / Incline Push-Up', image_url: '/images/MUSCLE_FOCUS/chest_focus/Decline Push-Ups.png' },
    { id: 'cf_5', name: 'Hindu Push-Ups', instruction: 'Dive bomber style', sets: '3-4', reps: '10-12', comment: 'Alt: Incline Hindu Push-Up / Cobra Push-Up', image_url: '/images/MUSCLE_FOCUS/chest_focus/Hindu Push-Ups.png' },
    { id: 'cf_6', name: 'Brick Squeeze Press', instruction: 'Press while squeezing bricks together', sets: '3-4', reps: '10-12', comment: 'Alt: Isometric Chest Squeeze', image_url: '/images/MUSCLE_FOCUS/chest_focus/Brick Squeeze Press.png' },
    { id: 'cf_7', name: 'Floor Press', instruction: 'Press from the floor', sets: '3-4', reps: '10-12', comment: 'Alt: Brick Chest Press', image_url: '/images/MUSCLE_FOCUS/chest_focus/Floor Press.png' }
  ],
  arms_focus: [
    { id: 'af_1', name: 'Alternating Bicep Curl', instruction: 'Biceps Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Two-Hand Curl', image_url: '/images/MUSCLE_FOCUS/arms_focus/Alternating Bicep Curl.png' },
    { id: 'af_2', name: 'Hammer Curl', instruction: 'Biceps Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Regular Curl', image_url: '/images/MUSCLE_FOCUS/arms_focus/Hammer Curl.png' },
    { id: 'af_3', name: 'Tricep Extension', instruction: 'Triceps Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Overhead Band Extension', image_url: '/images/MUSCLE_FOCUS/arms_focus/Tricep Extension.png' },
    { id: 'af_4', name: 'Tricep Dips', instruction: 'Triceps Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Bench/Chair Assisted Dips', image_url: '/images/MUSCLE_FOCUS/arms_focus/Tricep Dips.png' },
    { id: 'af_5', name: 'Dumbbell Kickbacks (Brick/Bottle)', instruction: 'Triceps Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Band Kickback', image_url: '/images/MUSCLE_FOCUS/arms_focus/Dumbbell Kickbacks (Brick_Bottle).png' },
    { id: 'af_6', name: 'Wrist Curl', instruction: 'Forearms & Grip Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Band Wrist Curl', image_url: '/images/MUSCLE_FOCUS/arms_focus/Wrist Curl.png' },
    { id: 'af_7', name: 'Reverse Wrist Curl', instruction: 'Forearms & Grip Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Band Reverse Wrist Curl', image_url: '/images/MUSCLE_FOCUS/arms_focus/Reverse Wrist Curl.png' },
    { id: 'af_8', name: 'Farmer Hold', instruction: 'Forearms & Grip Focus', sets: '3-4', reps: '30 sec', comment: 'Alt: Suitcase Hold with One Brick', image_url: '/images/MUSCLE_FOCUS/arms_focus/Farmer Hold.png' }
  ],
  back_shoulder: [
    { id: 'bs_1', name: 'Bent Over Rows', instruction: 'Back Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Single-Arm Brick Row', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Bent Over Rows.png' },
    { id: 'bs_2', name: 'Decline Brick Press (Pullover Variation)', instruction: 'Back Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Brick Pullover', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Decline Brick Press.png' },
    { id: 'bs_3', name: 'Shoulder Press', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Seated Shoulder Press', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Shoulder Press.png' },
    { id: 'bs_4', name: 'Lateral Raises', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Band Lateral Raise', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Lateral Raises.png' },
    { id: 'bs_5', name: 'Pike Push-Ups', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Incline Pike Push-Up', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Pike Push-Ups.png' },
    { id: 'bs_6', name: 'Rear Delt Fly', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Band Rear Fly', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Rear Delt Fly.png' },
    { id: 'bs_7', name: 'Brick Squeeze Press', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Chest Squeeze Hold', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Brick Squeeze Press.png' },
    { id: 'bs_8', name: 'Arnold Press', instruction: 'Shoulders Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Normal Shoulder Press', image_url: '/images/MUSCLE_FOCUS/back_shoulder/Arnold Press.png' }
  ],
  abs_core: [
    { id: 'ac_1', name: 'Long Arm Crunches', instruction: 'Abs & Core Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Normal Crunches', image_url: '/images/MUSCLE_FOCUS/abs_core/Long Arm Crunches.png' },
    { id: 'ac_2', name: 'Heel Taps', instruction: 'Abs & Core Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Side Crunches', image_url: '/images/MUSCLE_FOCUS/abs_core/Heel Taps.png' },
    { id: 'ac_3', name: 'Mountain Climbers', instruction: 'Abs & Core Focus', sets: '3-4', reps: '30 sec', comment: 'Alt: Slow Mountain Climbers', image_url: '/images/MUSCLE_FOCUS/abs_core/Mountain Climbers.png' },
    { id: 'ac_4', name: 'Reverse Crunch', instruction: 'Abs & Core Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Bent Knee Leg Raise', image_url: '/images/MUSCLE_FOCUS/abs_core/Reverse Crunch.png' },
    { id: 'ac_5', name: 'Plank', instruction: 'Abs & Core Focus', sets: '3-4', reps: '30-60 sec', comment: 'Alt: Knee Plank', image_url: '/images/MUSCLE_FOCUS/abs_core/Plank.png' },
    { id: 'ac_6', name: 'Burpees', instruction: 'Abs & Core Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Half Burpee / Squat Thrust', image_url: '/images/MUSCLE_FOCUS/abs_core/Burpees.png' }
  ],
  legs: [
    { id: 'l_1', name: 'Squats', instruction: 'Legs Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Chair Squats', image_url: '/images/MUSCLE_FOCUS/legs/Squats.png' },
    { id: 'l_2', name: 'Backward Lunges', instruction: 'Legs Focus', sets: '3-4', reps: '10-12 each', comment: 'Alt: Static Split Squat / Reverse Step Tap', image_url: '/images/MUSCLE_FOCUS/legs/Backward Lunges.png' },
    { id: 'l_3', name: 'Glute Bridge', instruction: 'Legs Focus', sets: '3-4', reps: '10-12', comment: 'Alt: Hip Bridge Hold', image_url: '/images/MUSCLE_FOCUS/legs/Glute Bridge.png' },
    { id: 'l_4', name: 'Side Lunges', instruction: 'Legs Focus', sets: '3-4', reps: '10-12 each', comment: 'Alt: Side Step Squat', image_url: '/images/MUSCLE_FOCUS/legs/Side Lunges.png' },
    { id: 'l_5', name: 'Calf Raises', instruction: 'Legs Focus', sets: '3-4', reps: '15-20', comment: 'Alt: Supported Calf Raises', image_url: '/images/MUSCLE_FOCUS/legs/Calf Raises.png' },
    { id: 'l_6', name: 'Step-Ups', instruction: 'Legs Focus', sets: '3-4', reps: '10-12 each', comment: 'Alt: Low Step-Up / Stair Step-Up', image_url: '/images/MUSCLE_FOCUS/legs/Step-Ups.png' }
  ]
};
