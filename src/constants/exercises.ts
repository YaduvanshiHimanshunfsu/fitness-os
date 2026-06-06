export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  imageUrl: string;
  sets: number;
  reps: string;
  exerciseOrder: number;
  day: string;
}

export const EXERCISES: Exercise[] = [
  // MONDAY: Chest, Arms, Forearms
  { id: 1, name: 'Push-Ups', muscleGroup: 'chest', imageUrl: '/images/MONDAY/pushup.png', sets: 4, reps: '8-15', exerciseOrder: 1, day: 'monday' },
  { id: 2, name: 'Brick Chest Press', muscleGroup: 'chest', imageUrl: '/images/MONDAY/Brick Chest Press.png', sets: 4, reps: '10-12', exerciseOrder: 2, day: 'monday' },
  { id: 3, name: 'Brick Chest Fly', muscleGroup: 'chest', imageUrl: '/images/MONDAY/Brick Chest Fly.png', sets: 3, reps: '12', exerciseOrder: 3, day: 'monday' },
  { id: 4, name: 'Alternating Bicep Curl', muscleGroup: 'arms', imageUrl: '/images/MONDAY/Alternating Bicep Curl.png', sets: 4, reps: '10-12', exerciseOrder: 4, day: 'monday' },
  { id: 5, name: 'Tricep Extension', muscleGroup: 'arms', imageUrl: '/images/MONDAY/Tricep Extension.png', sets: 4, reps: '10-12', exerciseOrder: 5, day: 'monday' },
  { id: 6, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/MONDAY/Hammer Curl.png', sets: 4, reps: '12', exerciseOrder: 6, day: 'monday' },
  { id: 7, name: 'Wrist Curl', muscleGroup: 'forearms', imageUrl: '/images/MONDAY/Wrist Curl.png', sets: 4, reps: '20', exerciseOrder: 7, day: 'monday' },
  { id: 8, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/MONDAY/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 8, day: 'monday' },

  // TUESDAY: Back + Shoulders
  { id: 9, name: 'Bent Over Rows', muscleGroup: 'back', imageUrl: '/images/TUESDAY/Bent Over Row.png', sets: 4, reps: '10-12', exerciseOrder: 1, day: 'tuesday' },
  { id: 10, name: 'Decline Brick Press', muscleGroup: 'back', imageUrl: '/images/TUESDAY/Decline Brick Press.png', sets: 3, reps: '10', exerciseOrder: 2, day: 'tuesday' },
  { id: 11, name: 'Shoulder Press', muscleGroup: 'shoulders', imageUrl: '/images/TUESDAY/Shoulder Press.png', sets: 4, reps: '10-12', exerciseOrder: 3, day: 'tuesday' },
  { id: 12, name: 'Lateral Raises', muscleGroup: 'shoulders', imageUrl: '/images/TUESDAY/Lateral Raise.png', sets: 4, reps: '12-15', exerciseOrder: 4, day: 'tuesday' },
  { id: 13, name: 'Pike Push-Ups', muscleGroup: 'shoulders', imageUrl: '/images/TUESDAY/Pike Push-Up.png', sets: 3, reps: '8-12', exerciseOrder: 5, day: 'tuesday' },
  { id: 14, name: 'Rear Delt Fly', muscleGroup: 'shoulders', imageUrl: '/images/TUESDAY/Rear Delt Fly.png', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'tuesday' },
  { id: 15, name: 'Brick Squeeze Press', muscleGroup: 'shoulders', imageUrl: '/images/TUESDAY/Brick Squeeze Press.png', sets: 2, reps: '15', exerciseOrder: 7, day: 'tuesday' },

  // WEDNESDAY: Abs + Core
  { id: 16, name: 'Long Arm Crunches', muscleGroup: 'abs', imageUrl: '/images/WEDNESDAY/Long Arm Crunch.png', sets: 3, reps: '15', exerciseOrder: 1, day: 'wednesday' },
  { id: 17, name: 'Heel Taps', muscleGroup: 'abs', imageUrl: '/images/WEDNESDAY/Heel Taps.png', sets: 3, reps: '20', exerciseOrder: 2, day: 'wednesday' },
  { id: 18, name: 'Mountain Climbers', muscleGroup: 'abs', imageUrl: '/images/WEDNESDAY/Mountain Climber.png', sets: 3, reps: '30 sec', exerciseOrder: 3, day: 'wednesday' },
  { id: 19, name: 'Reverse Crunch', muscleGroup: 'abs', imageUrl: '/images/WEDNESDAY/Reverse Crunch.png', sets: 3, reps: '12', exerciseOrder: 4, day: 'wednesday' },
  { id: 20, name: 'Plank', muscleGroup: 'abs', imageUrl: '/images/WEDNESDAY/Plank.png', sets: 3, reps: '30-45 sec', exerciseOrder: 5, day: 'wednesday' },

  // FRIDAY: Legs + Knee Stability
  { id: 21, name: 'Squats', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Squat.png', sets: 4, reps: '12-15', exerciseOrder: 1, day: 'friday' },
  { id: 22, name: 'Backward Lunges', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Backward Lunge.png', sets: 3, reps: '10-12', exerciseOrder: 2, day: 'friday' },
  { id: 23, name: 'Glute Bridge', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Glute Bridge.png', sets: 3, reps: '15', exerciseOrder: 3, day: 'friday' },
  { id: 24, name: 'Side Lunges', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Side Lunge.png', sets: 3, reps: '10', exerciseOrder: 4, day: 'friday' },
  { id: 25, name: 'Calf Raises', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Calf Raise.png', sets: 4, reps: '20', exerciseOrder: 5, day: 'friday' },
  { id: 26, name: 'Wall Sit', muscleGroup: 'legs', imageUrl: '/images/FRIDAY/Wall Sit.png', sets: 2, reps: '45 sec', exerciseOrder: 6, day: 'friday' },

  // SATURDAY: Chest + Arms Variation
  { id: 27, name: 'Decline Push-Ups', muscleGroup: 'chest', imageUrl: '/images/SATURDAY/Decline Push Up.png', sets: 3, reps: '8-12', exerciseOrder: 1, day: 'saturday' },
  { id: 28, name: 'Hindu Push-Ups', muscleGroup: 'chest', imageUrl: '/images/SATURDAY/Hindu Push-Up.png', sets: 3, reps: '8-10', exerciseOrder: 2, day: 'saturday' },
  { id: 29, name: 'Brick Squeeze Press', muscleGroup: 'chest', imageUrl: '/images/SATURDAY/Brick Squeeze Press.png', sets: 3, reps: '12-15', exerciseOrder: 3, day: 'saturday' },
  { id: 30, name: 'Arnold Press', muscleGroup: 'shoulders', imageUrl: '/images/SATURDAY/Arnold Press.png', sets: 4, reps: '10', exerciseOrder: 4, day: 'saturday' },
  { id: 31, name: 'Tricep Dips', muscleGroup: 'arms', imageUrl: '/images/SATURDAY/Tricep Dip.png', sets: 3, reps: '12-15', exerciseOrder: 5, day: 'saturday' },
  { id: 32, name: 'Dumbbell Kickbacks', muscleGroup: 'arms', imageUrl: '/images/SATURDAY/Dumbbell Kickbacks.png', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'saturday' },
  { id: 33, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/SATURDAY/Hammer Curl.png', sets: 3, reps: '12', exerciseOrder: 7, day: 'saturday' },
  { id: 34, name: 'Reverse Wrist Curl', muscleGroup: 'forearms', imageUrl: '/images/SATURDAY/Reverse Wrist Curl.png', sets: 4, reps: '20', exerciseOrder: 8, day: 'saturday' },
  { id: 35, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/SATURDAY/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'saturday' },

  // SUNDAY: Full Body + Athletic
  { id: 36, name: 'Floor Press', muscleGroup: 'chest', imageUrl: '/images/SUNDAY/Floor Press.png', sets: 4, reps: '12', exerciseOrder: 1, day: 'sunday' },
  { id: 37, name: 'Bent Over Rows', muscleGroup: 'back', imageUrl: '/images/SUNDAY/Bent Over Row.png', sets: 4, reps: '12', exerciseOrder: 2, day: 'sunday' },
  { id: 38, name: 'Step-Ups', muscleGroup: 'legs', imageUrl: '/images/SUNDAY/Step-Up.png', sets: 3, reps: '10', exerciseOrder: 3, day: 'sunday' },
  { id: 39, name: 'Backward Lunges', muscleGroup: 'legs', imageUrl: '/images/SUNDAY/Backward Lunge.png', sets: 3, reps: '10', exerciseOrder: 4, day: 'sunday' },
  { id: 40, name: 'Push-Ups', muscleGroup: 'chest', imageUrl: '/images/SUNDAY/Push-Up.png', sets: 3, reps: '10-15', exerciseOrder: 5, day: 'sunday' },
  { id: 41, name: 'Hammer Curl', muscleGroup: 'arms', imageUrl: '/images/SUNDAY/Hammer Curl.png', sets: 3, reps: '12', exerciseOrder: 6, day: 'sunday' },
  { id: 42, name: 'Plank', muscleGroup: 'abs', imageUrl: '/images/SUNDAY/Plank.png', sets: 3, reps: '45 sec', exerciseOrder: 7, day: 'sunday' },
  { id: 43, name: 'Burpees', muscleGroup: 'fullbody', imageUrl: '/images/SUNDAY/Burpee.png', sets: 2, reps: '8', exerciseOrder: 8, day: 'sunday' },
  { id: 44, name: 'Farmer Hold', muscleGroup: 'forearms', imageUrl: '/images/SUNDAY/Farmer Hold.png', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'sunday' }
];
