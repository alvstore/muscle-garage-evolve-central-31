
import api from './api';
import { Trainer } from '@/types/index';
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
  }
};
