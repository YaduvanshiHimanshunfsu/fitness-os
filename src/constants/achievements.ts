export interface Achievement {
  id: number
  name: string
  description: string
  conditionType: string
  conditionValue: number
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 1,  name: 'First Step',       description: 'Complete your first workout',         conditionType: 'total_workouts', conditionValue: 1,    icon: '👟' },
  { id: 2,  name: '7 Day Streak',     description: 'Work out 7 days in a row',            conditionType: 'streak',         conditionValue: 7,    icon: '🔥' },
  { id: 3,  name: '30 Day Streak',    description: 'Work out 30 days in a row',           conditionType: 'streak',         conditionValue: 30,   icon: '🔥' },
  { id: 4,  name: '90 Day Streak',    description: 'Work out 90 days in a row',           conditionType: 'streak',         conditionValue: 90,   icon: '🔥' },
  { id: 5,  name: '100 Sets',         description: 'Complete 100 total sets',             conditionType: 'total_sets',     conditionValue: 100,  icon: '💯' },
  { id: 6,  name: '1000 Sets',        description: 'Complete 1,000 total sets',           conditionType: 'total_sets',     conditionValue: 1000, icon: '💪' },
  { id: 7,  name: '10,000 Sets',      description: 'Complete 10,000 total sets',          conditionType: 'total_sets',     conditionValue: 10000,icon: '🏆' },
  { id: 8,  name: '10 Workouts',      description: 'Complete 10 workouts',                conditionType: 'total_workouts', conditionValue: 10,   icon: '⭐' },
  { id: 9,  name: '50 Workouts',      description: 'Complete 50 workouts',                conditionType: 'total_workouts', conditionValue: 50,   icon: '🌟' },
  { id: 10, name: '100 Workouts',     description: 'Complete 100 workouts',               conditionType: 'total_workouts', conditionValue: 100,  icon: '👑' },
  { id: 11, name: 'Perfect Week',     description: 'Complete every workout in a week',    conditionType: 'perfect_week',   conditionValue: 1,    icon: '✅' },
  { id: 12, name: '4 Perfect Weeks',  description: 'Complete 4 perfect weeks',            conditionType: 'perfect_week',   conditionValue: 4,    icon: '🎯' },
]
