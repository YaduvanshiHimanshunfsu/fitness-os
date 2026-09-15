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
  // MONDAY: Chest + Triceps (V7.0 — per monday.md)
  { id: 1,  name: 'Chest Press (Tube)',             muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Chest Press.png',                      sets: 3, reps: '10-15', exerciseOrder: 1, day: 'monday' },
  { id: 2,  name: 'Push-up Progression',            muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Push-up.png',                          sets: 3, reps: '5-10',  exerciseOrder: 2, day: 'monday' },
  { id: 3,  name: 'Incline Chest Press (Tube)',      muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Incline Chest Press.png',               sets: 3, reps: '10-15', exerciseOrder: 3, day: 'monday' },
  { id: 4,  name: 'Chest Fly (Tube)',                muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Chest Fly.png',                        sets: 3, reps: '12-15', exerciseOrder: 4, day: 'monday' },
  { id: 5,  name: 'Incline Chest Fly (Tube)',        muscleGroup: 'chest',    imageUrl: '/images/MONDAY/Incline Chest Fly.png',                 sets: 2, reps: '12-15', exerciseOrder: 5, day: 'monday' },
  { id: 6,  name: 'Triceps Pushdown (Tube)',         muscleGroup: 'triceps',  imageUrl: '/images/MONDAY/Triceps Pushdown.png',                  sets: 3, reps: '10-15', exerciseOrder: 6, day: 'monday' },
  { id: 7,  name: 'Overhead Triceps Extension (Tube)', muscleGroup: 'triceps', imageUrl: '/images/MONDAY/Overhead Triceps Extension.png',      sets: 3, reps: '10-15', exerciseOrder: 7, day: 'monday' },

  // TUESDAY: Back + Biceps + Forearms/Wrists (V7.0 — per tuesday.md)
  { id: 8,  name: 'Lat Pulldown (Tube)',          muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Lat Pulldown.png',           sets: 4, reps: '8-15',      exerciseOrder: 1,  day: 'tuesday' },
  { id: 9,  name: 'Bent-Over Row (Tube)',          muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Bent-Over Row.png',          sets: 4, reps: '8-15',      exerciseOrder: 2,  day: 'tuesday' },
  { id: 10, name: 'Seated Row (Tube)',             muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Seated Row.png',             sets: 3, reps: '10-15',     exerciseOrder: 3,  day: 'tuesday' },
  { id: 11, name: 'Straight-Arm Pushdown (Tube)', muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Straight-Arm Pushdown.png',  sets: 3, reps: '12-15',     exerciseOrder: 4,  day: 'tuesday' },
  { id: 12, name: 'Face Pull (Tube)',              muscleGroup: 'back',     imageUrl: '/images/TUESDAY/Face Pull.png',              sets: 3, reps: '12-20',     exerciseOrder: 5,  day: 'tuesday' },
  { id: 13, name: 'Biceps Curl (Tube)',            muscleGroup: 'biceps',   imageUrl: '/images/TUESDAY/Biceps Curl.png',            sets: 3, reps: '8-12',      exerciseOrder: 6,  day: 'tuesday' },
  { id: 14, name: 'Hammer Curl',                  muscleGroup: 'biceps',   imageUrl: '/images/TUESDAY/Hammer Curl.png',            sets: 3, reps: '10-15',     exerciseOrder: 7,  day: 'tuesday' },
  { id: 15, name: 'Supinating Curl (Alt)',         muscleGroup: 'biceps',   imageUrl: '/images/TUESDAY/Supinating Curl.png',        sets: 2, reps: '10-15/arm', exerciseOrder: 8,  day: 'tuesday' },
  { id: 16, name: 'Reverse Curl',                 muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Reverse Curl.png',           sets: 2, reps: '12-15',     exerciseOrder: 9,  day: 'tuesday' },
  { id: 17, name: 'Wrist Curl',                   muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Wrist Curl.png',             sets: 2, reps: '15-25',     exerciseOrder: 10, day: 'tuesday' },
  { id: 18, name: 'Reverse Wrist Curl',           muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Reverse Wrist Curl.png',     sets: 2, reps: '15-25',     exerciseOrder: 11, day: 'tuesday' },
  { id: 19, name: 'Farmer Hold',                  muscleGroup: 'forearms', imageUrl: '/images/TUESDAY/Farmer Hold.png',            sets: 3, reps: '30-60 sec', exerciseOrder: 12, day: 'tuesday' },
  { id: 20, name: 'Push-up Progression',          muscleGroup: 'chest',    imageUrl: '/images/TUESDAY/Incline Push-up.png',        sets: 2, reps: '6-10',      exerciseOrder: 13, day: 'tuesday' },

  // WEDNESDAY: Legs + Athletic Strength + Grip (V7.0 — per wednesday.md)
  { id: 21, name: 'Tube Squat',              muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Tube Squat.png',           sets: 4, reps: '8-15',      exerciseOrder: 1, day: 'wednesday' },
  { id: 22, name: 'Bulgarian Split Squat',   muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Bulgarian Split Squat.png', sets: 3, reps: '8-12/leg', exerciseOrder: 2, day: 'wednesday' },
  { id: 23, name: 'RDL (Tube)',              muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/RDL.png',                  sets: 4, reps: '10-15',     exerciseOrder: 3, day: 'wednesday' },
  { id: 24, name: 'Reverse Lunge',           muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Reverse Lunge.png',        sets: 3, reps: '8-12/leg', exerciseOrder: 4, day: 'wednesday' },
  { id: 25, name: 'Glute Bridge',            muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Glute Bridge.png',         sets: 3, reps: '12-20',     exerciseOrder: 5, day: 'wednesday' },
  { id: 26, name: 'Side Lunge',              muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Side Lunge.png',           sets: 2, reps: '10/side',   exerciseOrder: 6, day: 'wednesday' },
  { id: 27, name: 'Calf Raise',              muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Calf Raise.png',           sets: 4, reps: '15-25',     exerciseOrder: 7, day: 'wednesday' },
  { id: 28, name: 'Step-Ups (Athletic)',     muscleGroup: 'legs',     imageUrl: '/images/WEDNESDAY/Step-Ups.png',             sets: 3, reps: '30-40 sec', exerciseOrder: 8, day: 'wednesday' },
  { id: 29, name: 'Farmer Hold',             muscleGroup: 'forearms', imageUrl: '/images/WEDNESDAY/Farmer Hold.png',          sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'wednesday' },
  { id: 30, name: 'Wrist Curl',              muscleGroup: 'forearms', imageUrl: '/images/WEDNESDAY/Wrist Curl.png',           sets: 2, reps: '15-20',     exerciseOrder: 10, day: 'wednesday' },
  { id: 31, name: 'Reverse Wrist Curl',      muscleGroup: 'forearms', imageUrl: '/images/WEDNESDAY/Reverse Wrist Curl.png',   sets: 2, reps: '15-20',     exerciseOrder: 11, day: 'wednesday' },

  // FRIDAY: Shoulders + Chest + Triceps (V7.0 — per friday.md)
  { id: 32, name: 'Shoulder Press (Tube)',  muscleGroup: 'shoulders', imageUrl: '/images/FRIDAY/Shoulder Press.png',     sets: 4, reps: '8-12',  exerciseOrder: 1, day: 'friday' },
  { id: 33, name: 'Lateral Raise (Tube)',   muscleGroup: 'shoulders', imageUrl: '/images/FRIDAY/Lateral Raise.png',     sets: 4, reps: '12-20', exerciseOrder: 2, day: 'friday' },
  { id: 34, name: 'Arnold Press',           muscleGroup: 'shoulders', imageUrl: '/images/FRIDAY/Arnold Press.png',      sets: 3, reps: '8-12',  exerciseOrder: 3, day: 'friday' },
  { id: 35, name: 'Rear-Delt Fly',          muscleGroup: 'shoulders', imageUrl: '/images/FRIDAY/Rear-Delt Fly.png',     sets: 3, reps: '12-20', exerciseOrder: 4, day: 'friday' },
  { id: 36, name: 'Decline Chest Press',    muscleGroup: 'chest',     imageUrl: '/images/FRIDAY/Decline Chest Press.png', sets: 3, reps: '10-15', exerciseOrder: 5, day: 'friday' },
  { id: 37, name: 'Decline Chest Fly',      muscleGroup: 'chest',     imageUrl: '/images/FRIDAY/Decline Chest Fly.png',   sets: 3, reps: '12-15', exerciseOrder: 6, day: 'friday' },
  { id: 38, name: 'Triceps Pushdown (Tube)',muscleGroup: 'triceps',   imageUrl: '/images/FRIDAY/Triceps Pushdown.png',  sets: 3, reps: '10-15', exerciseOrder: 7, day: 'friday' },
  { id: 39, name: 'Push-up Progression',    muscleGroup: 'chest',     imageUrl: '/images/FRIDAY/Incline Push-up.png',   sets: 2, reps: '5-8',   exerciseOrder: 8, day: 'friday' },

  // SATURDAY: Back + Chest + Arms + Forearms (V7.0 — per saturday.md)
  { id: 40, name: 'Lat Pulldown (Tube)',        muscleGroup: 'back',      imageUrl: '/images/SATURDAY/Lat Pulldown.png',              sets: 4, reps: '8-15',      exerciseOrder: 1, day: 'saturday' },
  { id: 41, name: 'Bent-Over Row (Tube)',        muscleGroup: 'back',      imageUrl: '/images/SATURDAY/Bent-Over Row.png',             sets: 3, reps: '10-15',     exerciseOrder: 2, day: 'saturday' },
  { id: 42, name: 'Face Pull (Tube)',            muscleGroup: 'back',      imageUrl: '/images/SATURDAY/Face Pull.png',                 sets: 3, reps: '12-20',     exerciseOrder: 3, day: 'saturday' },
  { id: 43, name: 'Push-up Progression',        muscleGroup: 'chest',     imageUrl: '/images/SATURDAY/Push-up.png',                   sets: 3, reps: '5-10',      exerciseOrder: 4, day: 'saturday' },
  { id: 44, name: 'Chest Fly (Tube)',            muscleGroup: 'chest',     imageUrl: '/images/SATURDAY/Chest Fly.png',                 sets: 3, reps: '12-15',     exerciseOrder: 5, day: 'saturday' },
  { id: 45, name: 'Hammer Curl',                muscleGroup: 'biceps',    imageUrl: '/images/SATURDAY/Hammer Curl.png',               sets: 3, reps: '10-15',     exerciseOrder: 6, day: 'saturday' },
  { id: 46, name: 'Overhead Triceps Extension', muscleGroup: 'triceps',   imageUrl: '/images/SATURDAY/Overhead Triceps Extension.png',sets: 3, reps: '10-15',     exerciseOrder: 7, day: 'saturday' },
  { id: 47, name: 'Wrist Curl',                 muscleGroup: 'forearms',  imageUrl: '/images/SATURDAY/Wrist Curl.png',                sets: 2, reps: '15-20',     exerciseOrder: 8, day: 'saturday' },
  { id: 48, name: 'Reverse Wrist Curl',         muscleGroup: 'forearms',  imageUrl: '/images/SATURDAY/Reverse Wrist Curl.png',        sets: 2, reps: '15-20',     exerciseOrder: 9, day: 'saturday' },
  { id: 49, name: 'Farmer Hold',                muscleGroup: 'forearms',  imageUrl: '/images/SATURDAY/Farmer Hold.png',               sets: 3, reps: '30-60 sec', exerciseOrder: 10, day: 'saturday' },

  // SUNDAY: Full Body Athletic + Conditioning (V7.0 — per sunday.md)
  { id: 50, name: 'Lat Pulldown (Tube)',        muscleGroup: 'back',      imageUrl: '/images/SUNDAY/Lat Pulldown.png',            sets: 3, reps: '10-15',      exerciseOrder: 1, day: 'sunday' },
  { id: 51, name: 'Chest Press (Tube)',         muscleGroup: 'chest',     imageUrl: '/images/SUNDAY/Chest Press.png',             sets: 3, reps: '10-15',      exerciseOrder: 2, day: 'sunday' },
  { id: 52, name: 'RDL (Tube)',                 muscleGroup: 'legs',      imageUrl: '/images/SUNDAY/RDL.png',                     sets: 3, reps: '10-15',      exerciseOrder: 3, day: 'sunday' },
  { id: 53, name: 'Step-Ups',                   muscleGroup: 'legs',      imageUrl: '/images/SUNDAY/Step-Ups.png',                sets: 3, reps: '10/leg',     exerciseOrder: 4, day: 'sunday' },
  { id: 54, name: 'Shoulder/Lateral Raise (Tube)', muscleGroup: 'shoulders', imageUrl: '/images/SUNDAY/Lateral Raise.png',           sets: 3, reps: '12-20',      exerciseOrder: 5, day: 'sunday' },
  { id: 55, name: 'Push-up Progression',        muscleGroup: 'chest',     imageUrl: '/images/SUNDAY/Push-up.png',                 sets: 3, reps: '5-10',       exerciseOrder: 6, day: 'sunday' },
  { id: 56, name: 'Farmer Hold',                muscleGroup: 'forearms',  imageUrl: '/images/SUNDAY/Farmer Hold.png',             sets: 3, reps: '30-60 sec',  exerciseOrder: 7, day: 'sunday' }
];
