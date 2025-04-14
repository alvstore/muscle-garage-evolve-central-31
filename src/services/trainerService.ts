
import api from './api';
import { Trainer, Member, WorkoutPlan, DietPlan } from '@/types/index';
import { toast } from 'sonner';

export const trainerService = {
  // Fetch all trainers
  async getTrainers(): Promise<Trainer[]> {
    try {
      const response = await api.get<Trainer[]>('/trainers');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trainers';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch a specific trainer by ID
  async getTrainerById(trainerId: string): Promise<Trainer | null> {
    try {
      const response = await api.get<Trainer>(`/trainers/${trainerId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trainer details';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Fetch trainer's schedule
  async getTrainerSchedule(trainerId: string, startDate?: string, endDate?: string): Promise<any[]> {
    try {
      const params = { startDate, endDate };
      const response = await api.get<any[]>(`/trainers/${trainerId}/schedule`, { params });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trainer schedule';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Get available slots for a trainer on a specific date
  async getTrainerAvailability(trainerId: string, date: string): Promise<any[]> {
    try {
      const response = await api.get<any[]>(`/trainers/${trainerId}/availability`, { 
        params: { date } 
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trainer availability';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Book a session with a trainer
  async bookTrainerSession(trainerId: string, memberId: string, date: string, timeSlot: string): Promise<any | null> {
    try {
      const response = await api.post<any>('/trainer-sessions', {
        trainerId,
        memberId,
        date,
        timeSlot
      });
      toast.success('Trainer session booked successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to book trainer session';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Assign a trainer to a member
  async assignTrainerToMember(trainerId: string, memberId: string): Promise<boolean> {
    try {
      await api.post('/member-trainer-assignments', {
        trainerId,
        memberId
      });
      toast.success('Trainer assigned successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to assign trainer';
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Get members assigned to a trainer
  async getAssignedMembers(trainerId: string): Promise<Member[]> {
    try {
      const response = await api.get<Member[]>(`/trainers/${trainerId}/members`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch assigned members';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Create or update a workout plan for a member
  async createWorkoutPlan(plan: WorkoutPlan): Promise<WorkoutPlan | null> {
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
  
  // Create or update a diet plan for a member
  async createDietPlan(plan: DietPlan): Promise<DietPlan | null> {
    try {
      const response = await api.post<DietPlan>('/diet-plans', plan);
      toast.success('Diet plan created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create diet plan';
      toast.error(errorMessage);
      return null;
    }
  }
};
