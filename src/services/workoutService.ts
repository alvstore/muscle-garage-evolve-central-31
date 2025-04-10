
import api from './api';
import { WorkoutPlan, MemberWorkout, WorkoutDay, Exercise } from '@/types/class';
import { toast } from 'sonner';

export const workoutService = {
  // Fetch all workout plans
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      const response = await api.get<WorkoutPlan[]>('/workout-plans');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch workout plans';
      toast.error(errorMessage);
      return [];
    }
  },

  // Fetch common workout plans
  async getCommonWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      const response = await api.get<WorkoutPlan[]>('/workout-plans?isCommon=true');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch common workout plans';
      toast.error(errorMessage);
      return [];
    }
  },

  // Create a new workout plan
  async createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutPlan | null> {
    try {
      const response = await api.post<WorkoutPlan>('/workout-plans', plan);
      toast.success('Workout plan created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create workout plan';
      toast.error(errorMessage);
      return null;
    }
  },

  // Update an existing workout plan
  async updateWorkoutPlan(id: string, plan: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> {
    try {
      const response = await api.put<WorkoutPlan>(`/workout-plans/${id}`, plan);
      toast.success('Workout plan updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update workout plan';
      toast.error(errorMessage);
      return null;
    }
  },

  // Delete a workout plan
  async deleteWorkoutPlan(id: string): Promise<boolean> {
    try {
      await api.delete(`/workout-plans/${id}`);
      toast.success('Workout plan deleted successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete workout plan';
      toast.error(errorMessage);
      return false;
    }
  },

  // Assign a workout plan to a member
  async assignWorkoutPlan(memberWorkout: Omit<MemberWorkout, 'id' | 'assignedAt'>): Promise<MemberWorkout | null> {
    try {
      const response = await api.post<MemberWorkout>('/member-workouts', memberWorkout);
      toast.success('Workout plan assigned successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to assign workout plan';
      toast.error(errorMessage);
      return null;
    }
  },

  // Get a member's assigned workout plans
  async getMemberWorkouts(memberId: string): Promise<MemberWorkout[]> {
    try {
      const response = await api.get<MemberWorkout[]>(`/member-workouts?memberId=${memberId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch member workout plans';
      toast.error(errorMessage);
      return [];
    }
  },

  // Get a specific workout plan
  async getWorkoutPlanById(id: string): Promise<WorkoutPlan | null> {
    try {
      const response = await api.get<WorkoutPlan>(`/workout-plans/${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch workout plan details';
      toast.error(errorMessage);
      return null;
    }
  }
};
