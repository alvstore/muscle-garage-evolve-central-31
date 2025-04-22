
import api from './api';
import { DietPlan, DietAssignment } from '@/types/diet';
import { toast } from 'sonner';
import { Member } from '@/types';

export const dietPlanService = {
  // Fetch all diet plans created by a trainer
  async getTrainerDietPlans(trainerId?: string): Promise<DietPlan[]> {
    try {
      const response = await api.get<DietPlan[]>('/diet-plans', {
        params: { trainerId }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch diet plans';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch a specific diet plan by ID
  async getDietPlanById(planId: string): Promise<DietPlan | null> {
    try {
      const response = await api.get<DietPlan>(`/diet-plans/${planId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch diet plan details';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Create a new diet plan
  async createDietPlan(plan: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DietPlan | null> {
    try {
      const response = await api.post<DietPlan>('/diet-plans', plan);
      toast.success('Diet plan created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create diet plan';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Update an existing diet plan
  async updateDietPlan(planId: string, plan: Partial<DietPlan>): Promise<DietPlan | null> {
    try {
      const response = await api.put<DietPlan>(`/diet-plans/${planId}`, plan);
      toast.success('Diet plan updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update diet plan';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Delete a diet plan
  async deleteDietPlan(planId: string): Promise<boolean> {
    try {
      await api.delete(`/diet-plans/${planId}`);
      toast.success('Diet plan deleted successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete diet plan';
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Assign a diet plan to a member
  async assignDietPlanToMember(
    planId: string,
    memberId: string,
    trainerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<DietAssignment | null> {
    try {
      const response = await api.post<DietAssignment>('/diet-assignments', {
        planId,
        memberId,
        trainerId,
        startDate,
        endDate,
        isActive: true
      });
      toast.success('Diet plan assigned successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to assign diet plan';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Get diet plan assignments for a member
  async getMemberDietPlanAssignments(memberId: string): Promise<DietAssignment[]> {
    try {
      const response = await api.get<DietAssignment[]>('/diet-assignments', {
        params: { memberId, isActive: true }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch diet plan assignments';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Get members assigned to a trainer for diet planning
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
  
  // Generate a PDF for a diet plan
  async generateDietPlanPDF(planId: string): Promise<string | null> {
    try {
      const response = await api.get<{ url: string }>(`/diet-plans/${planId}/pdf`);
      return response.data.url;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate PDF';
      toast.error(errorMessage);
      return null;
    }
  }
};
