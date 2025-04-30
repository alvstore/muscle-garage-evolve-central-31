
import { BodyMeasurement, PTPlan } from '@/types/measurements';
import api from './api';
import { toast } from 'sonner';

export const measurementService = {
  /**
   * Get all measurements for a member
   */
  getAllMeasurements: async (memberId: string): Promise<BodyMeasurement[]> => {
    try {
      const response = await api.get(`/measurements/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      throw error;
    }
  },

  /**
   * Get measurement history for a member (alias for getAllMeasurements)
   */
  getMeasurementHistory: async (memberId: string): Promise<BodyMeasurement[]> => {
    return measurementService.getAllMeasurements(memberId);
  },

  /**
   * Get a specific measurement by ID
   */
  getMeasurement: async (id: string): Promise<BodyMeasurement> => {
    try {
      const response = await api.get(`/measurements/detail/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching measurement:', error);
      throw error;
    }
  },

  /**
   * Create a new measurement
   */
  addMeasurement: async (measurement: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement> => {
    try {
      const response = await api.post('/measurements', measurement);
      return response.data;
    } catch (error) {
      console.error('Error adding measurement:', error);
      throw error;
    }
  },

  /**
   * Save a measurement (create or update)
   */
  saveMeasurement: async (measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    try {
      if (measurement.id) {
        // Update existing measurement
        const response = await api.put(`/measurements/${measurement.id}`, measurement);
        return response.data;
      } else {
        // Create new measurement
        const response = await api.post('/measurements', measurement);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw error;
    }
  },

  /**
   * Update an existing measurement
   */
  updateMeasurement: async (id: string, measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    try {
      const response = await api.put(`/measurements/${id}`, measurement);
      return response.data;
    } catch (error) {
      console.error('Error updating measurement:', error);
      throw error;
    }
  },

  /**
   * Delete a measurement
   */
  deleteMeasurement: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/measurements/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting measurement:', error);
      return false;
    }
  },

  // PT Plan methods
  
  /**
   * Get all PT plans for a member
   */
  getPTPlans: async (memberId: string): Promise<PTPlan[]> => {
    try {
      const response = await api.get(`/pt-plans/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching PT plans:', error);
      return [];
    }
  },
  
  /**
   * Get the active PT plan for a member
   */
  getActivePTPlan: async (memberId: string): Promise<PTPlan | null> => {
    try {
      const plans = await measurementService.getPTPlans(memberId);
      const activePlan = plans.find(plan => plan.isActive);
      return activePlan || null;
    } catch (error) {
      console.error('Error getting active PT plan:', error);
      return null;
    }
  },
  
  /**
   * Check if a member has an active PT plan
   */
  hasActivePTPlan: async (memberId: string): Promise<boolean> => {
    try {
      const plans = await measurementService.getPTPlans(memberId);
      return plans.some(plan => plan.isActive);
    } catch (error) {
      console.error('Error checking PT plan status:', error);
      return false;
    }
  },
  
  /**
   * Add a new PT plan
   */
  addPTPlan: async (plan: Omit<PTPlan, 'id'>): Promise<PTPlan> => {
    try {
      const response = await api.post('/pt-plans', plan);
      toast.success('PT plan created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating PT plan:', error);
      toast.error('Failed to create PT plan');
      throw error;
    }
  },
  
  /**
   * Update a PT plan
   */
  updatePTPlan: async (id: string, plan: Partial<PTPlan>): Promise<PTPlan> => {
    try {
      const response = await api.put(`/pt-plans/${id}`, plan);
      toast.success('PT plan updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating PT plan:', error);
      toast.error('Failed to update PT plan');
      throw error;
    }
  },
  
  /**
   * Delete a PT plan
   */
  deletePTPlan: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/pt-plans/${id}`);
      toast.success('PT plan deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting PT plan:', error);
      toast.error('Failed to delete PT plan');
      return false;
    }
  }
};
