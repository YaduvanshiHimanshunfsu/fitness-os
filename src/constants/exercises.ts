export const EXERCISES = [
  // MONDAY: Chest, Arms, Forearms
  { id: 1, name: 'Push-Ups', muscleGroup: 'chest', imageUrl: '/images/chest/pushup.png', sets: 4, reps: '8-15', exerciseOrder: 1, day: 'monday' },
  { id: 2, name: 'Brick Chest Press', muscleGroup: 'chest', imageUrl: '/images/chest/Brick Chest Press.png', sets: 4, reps: '10-12', exerciseOrder: 2, day: 'monday' },
  { id: 3, name: 'Brick Chest Fly', muscleGroup: 'chest', imageUrl: '/images/chest/Brick Chest Fly.png', sets: 3, reps: '12', exerciseOrder: 3, day: 'monday' },
  { id: 4, name: 'Alternating Bicep Curl', muscleGroup: 'arms', imageUrl: '/images/arms/Alternating Bicep Curl.png', sets: 4, reps: '10-12', exerciseOrder: 4, day: 'monday' },
  { id: 5, name: 'Tricep Extension', muscleGroup: 'arms', imageUrl: '/images/arms/Tricep Extension.png', sets: 4, reps: '10-12', exerciseOrder: 5, day: 'monday' },
  { id: 6, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/arms/Hammer Curl.png', sets: 4, reps: '12', exerciseOrder: 6, day: 'monday' },
  { id: 7, name: 'Wrist Curl', muscleGroup: 'forearms', imageUrl: '/images/forearms/Wrist Curl.png', sets: 4, reps: '20', exerciseOrder: 7, day: 'monday' },
  { id: 8, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/forearms/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 8, day: 'monday' },

  // TUESDAY: Back + Shoulders
  { id: 9, name: 'Bent Over Rows', muscleGroup: 'back', imageUrl: '/images/back/Bent Over Row.png', sets: 4, reps: '10-12', exerciseOrder: 1, day: 'tuesday' },
  { id: 10, name: 'Decline Brick Press', muscleGroup: 'back', imageUrl: '/images/chest/Decline Brick Press.png', sets: 3, reps: '10', exerciseOrder: 2, day: 'tuesday' }, // Replaced Towel Rows
  { id: 11, name: 'Shoulder Press', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Shoulder Press.png', sets: 4, reps: '10-12', exerciseOrder: 3, day: 'tuesday' },
  { id: 12, name: 'Lateral Raises', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Lateral Raise.png', sets: 4, reps: '12-15', exerciseOrder: 4, day: 'tuesday' },
  { id: 13, name: 'Pike Push-Ups', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Pike Push-Up.png', sets: 3, reps: '8-12', exerciseOrder: 5, day: 'tuesday' },
  { id: 14, name: 'Rear Delt Fly', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Rear Delt Fly.png', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'tuesday' },
  { id: 15, name: 'Brick Squeeze Press', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Brick Squeeze Press.png', sets: 2, reps: '15', exerciseOrder: 7, day: 'tuesday' },

  // WEDNESDAY: Abs + Core
  { id: 16, name: 'Long Arm Crunches', muscleGroup: 'abs', imageUrl: '/images/abs/Long Arm Crunch.png', sets: 3, reps: '15', exerciseOrder: 1, day: 'wednesday' },
  { id: 17, name: 'Heel Taps', muscleGroup: 'abs', imageUrl: '/images/abs/Heel Taps.png', sets: 3, reps: '20', exerciseOrder: 2, day: 'wednesday' },
  { id: 18, name: 'Mountain Climbers', muscleGroup: 'abs', imageUrl: '/images/abs/Mountain Climber.png', sets: 3, reps: '30 sec', exerciseOrder: 3, day: 'wednesday' },
  { id: 19, name: 'Reverse Crunch', muscleGroup: 'abs', imageUrl: '/images/abs/Reverse Crunch.png', sets: 3, reps: '12', exerciseOrder: 4, day: 'wednesday' },
  { id: 20, name: 'Plank', muscleGroup: 'abs', imageUrl: '/images/abs/Plank.png', sets: 3, reps: '30-45 sec', exerciseOrder: 5, day: 'wednesday' },

  // FRIDAY: Legs + Knee Stability
  { id: 21, name: 'Squats', muscleGroup: 'legs', imageUrl: '/images/legs/Squat.png', sets: 4, reps: '12-15', exerciseOrder: 1, day: 'friday' },
  { id: 22, name: 'Backward Lunges', muscleGroup: 'legs', imageUrl: '/images/legs/Backward Lunge.png', sets: 3, reps: '10-12', exerciseOrder: 2, day: 'friday' },
  { id: 23, name: 'Glute Bridge', muscleGroup: 'legs', imageUrl: '/images/legs/Glute Bridge.png', sets: 3, reps: '15', exerciseOrder: 3, day: 'friday' },
  { id: 24, name: 'Side Lunges', muscleGroup: 'legs', imageUrl: '/images/legs/Side Lunge.png', sets: 3, reps: '10', exerciseOrder: 4, day: 'friday' },
  { id: 25, name: 'Calf Raises', muscleGroup: 'legs', imageUrl: '/images/legs/Calf Raise.png', sets: 4, reps: '20', exerciseOrder: 5, day: 'friday' },
  { id: 26, name: 'Wall Sit', muscleGroup: 'legs', imageUrl: '/images/legs/Wall Sit.png', sets: 2, reps: '45 sec', exerciseOrder: 6, day: 'friday' },

  // SATURDAY: Chest + Arms Variation
  { id: 27, name: 'Decline Push-Ups', muscleGroup: 'chest', imageUrl: '/images/chest/Decline Push Up.png', sets: 3, reps: '8-12', exerciseOrder: 1, day: 'saturday' },
  { id: 28, name: 'Hindu Push-Ups', muscleGroup: 'chest', imageUrl: '/images/chest/Hindu Push-Up.png', sets: 3, reps: '8-10', exerciseOrder: 2, day: 'saturday' },
  { id: 29, name: 'Brick Squeeze Press', muscleGroup: 'chest', imageUrl: '/images/shoulders/Brick Squeeze Press.png', sets: 3, reps: '12-15', exerciseOrder: 3, day: 'saturday' },
  { id: 30, name: 'Arnold Press', muscleGroup: 'shoulders', imageUrl: '/images/shoulders/Arnold Press.png', sets: 4, reps: '10', exerciseOrder: 4, day: 'saturday' },
  { id: 31, name: 'Tricep Dips', muscleGroup: 'arms', imageUrl: '/images/arms/Tricep Dip.png', sets: 3, reps: '12-15', exerciseOrder: 5, day: 'saturday' },
  { id: 32, name: 'Dumbbell Kickbacks', muscleGroup: 'arms', imageUrl: '/images/arms/Dumbbell Kickbacks.png', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'saturday' },
  { id: 33, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/arms/Hammer Curl.png', sets: 3, reps: '12', exerciseOrder: 7, day: 'saturday' },
  { id: 34, name: 'Reverse Wrist Curl', muscleGroup: 'forearms', imageUrl: '/images/forearms/Reverse Wrist Curl.png', sets: 4, reps: '20', exerciseOrder: 8, day: 'saturday' },
  { id: 35, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/forearms/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'saturday' },

  // SUNDAY: Full Body + Athletic
  { id: 36, name: 'Floor Press', muscleGroup: 'chest', imageUrl: '/images/chest/Floor Press.png', sets: 4, reps: '12', exerciseOrder: 1, day: 'sunday' },
  { id: 37, name: 'Bent Over Rows', muscleGroup: 'back', imageUrl: '/images/back/Bent Over Row.png', sets: 4, reps: '12', exerciseOrder: 2, day: 'sunday' },
  { id: 38, name: 'Step-Ups', muscleGroup: 'legs', imageUrl: '/images/legs/Step-Up.png', sets: 3, reps: '10', exerciseOrder: 3, day: 'sunday' },
  { id: 39, name: 'Backward Lunges', muscleGroup: 'legs', imageUrl: '/images/legs/Backward Lunge.png', sets: 3, reps: '10', exerciseOrder: 4, day: 'sunday' },
  { id: 40, name: 'Push-Ups', muscleGroup: 'chest', imageUrl: '/images/chest/Push-Up.png', sets: 3, reps: '10-15', exerciseOrder: 5, day: 'sunday' },
  { id: 41, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/arms/Hammer Curl.png', sets: 3, reps: '12', exerciseOrder: 6, day: 'sunday' },
  { id: 42, name: 'Plank', muscleGroup: 'abs', imageUrl: '/images/abs/Plank.png', sets: 3, reps: '45 sec', exerciseOrder: 7, day: 'sunday' },
  { id: 43, name: 'Burpees', muscleGroup: 'fullbody', imageUrl: '/images/warmup/Burpee.png', sets: 2, reps: '8', exerciseOrder: 8, day: 'sunday' },
  { id: 44, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/forearms/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'sunday' }
]
