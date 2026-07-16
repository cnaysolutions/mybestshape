const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

const GOAL_ADJUSTMENT = {
  lose: -500,
  maintain: 0,
  gain: 300,
}

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'morning_snack', label: 'Morning Snack' },
  { value: 'afternoon_snack', label: 'Afternoon Snack' },
  { value: 'evening_snack', label: 'Evening Snack' },
]

export function mealTypeLabel(value) {
  return MEAL_TYPES.find(m => m.value === value)?.label || value
}

// Mifflin-St Jeor BMR, adjusted for activity level and goal.
export function dailyCalorieTarget(profile) {
  const { weight_kg, height_cm, age, sex, activity_level, goal } = profile
  const bmr = sex === 'male'
    ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
  const tdee = bmr * (ACTIVITY_FACTORS[activity_level] || 1.2)
  return Math.round(tdee + (GOAL_ADJUSTMENT[goal] || 0))
}
