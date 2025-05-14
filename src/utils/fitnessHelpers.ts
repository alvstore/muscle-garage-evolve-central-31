
import { WorkoutPlan, WorkoutDay } from '@/types/fitness';

/**
 * Helper function to safely get workout days from a workout plan
 */
export const getWorkoutDays = (plan: WorkoutPlan): WorkoutDay[] => {
  if (!plan) return [];
  
  // Handle different variants of the workout days property
  if (Array.isArray(plan.workout_days)) {
    return plan.workout_days;
  }
  
  if (Array.isArray(plan.days)) {
    return plan.days;
  }
  
  return [];
};

/**
 * Helper function to safely get plan target goals
 */
export const getPlanTargetGoals = (plan: WorkoutPlan): string[] => {
  if (!plan) return [];
  
  if (Array.isArray(plan.targetGoals)) {
    return plan.targetGoals;
  }
  
  if (Array.isArray(plan.target_goals)) {
    return plan.target_goals;
  }
  
  return [];
};
