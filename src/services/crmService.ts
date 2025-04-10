
import api from './api';
import { Lead, FollowUpTemplate, FollowUpHistory, FunnelStage } from '@/types/crm';
import { toast } from 'sonner';

export const crmService = {
  // Fetch all leads
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await api.get<Lead[]>('/leads');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch leads';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Create a new lead
  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | null> {
    try {
      const response = await api.post<Lead>('/leads', lead);
      toast.success('Lead created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create lead';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Update an existing lead
  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead | null> {
    try {
      const response = await api.put<Lead>(`/leads/${id}`, lead);
      toast.success('Lead updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update lead';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Update lead funnel stage
  async updateLeadStage(id: string, stage: FunnelStage): Promise<Lead | null> {
    try {
      const response = await api.patch<Lead>(`/leads/${id}/stage`, { funnelStage: stage });
      toast.success('Lead stage updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update lead stage';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Delete a lead
  async deleteLead(id: string): Promise<boolean> {
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete lead';
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Import leads from CSV
  async importLeads(file: File): Promise<{ success: number; failed: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<{ success: number; failed: number }>('/leads/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(`Successfully imported ${response.data.success} leads`);
      if (response.data.failed > 0) {
        toast.warning(`${response.data.failed} leads failed to import`);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to import leads';
      toast.error(errorMessage);
      return { success: 0, failed: 0 };
    }
  },
  
  // Fetch follow-up templates
  async getFollowUpTemplates(): Promise<FollowUpTemplate[]> {
    try {
      const response = await api.get<FollowUpTemplate[]>('/follow-up-templates');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch follow-up templates';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Create a follow-up template
  async createFollowUpTemplate(template: Omit<FollowUpTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FollowUpTemplate | null> {
    try {
      const response = await api.post<FollowUpTemplate>('/follow-up-templates', template);
      toast.success('Template created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create template';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Schedule a follow-up
  async scheduleFollowUp(leadId: string, templateId: string, scheduledAt: string): Promise<any | null> {
    try {
      const response = await api.post<any>('/follow-ups/schedule', {
        leadId,
        templateId,
        scheduledAt
      });
      toast.success('Follow-up scheduled successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to schedule follow-up';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Get follow-up history for a lead
  async getFollowUpHistory(leadId: string): Promise<FollowUpHistory[]> {
    try {
      const response = await api.get<FollowUpHistory[]>(`/leads/${leadId}/follow-ups`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch follow-up history';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Send immediate follow-up
  async sendFollowUp(leadId: string, type: string, content: string): Promise<boolean> {
    try {
      await api.post('/follow-ups/send', {
        leadId,
        type,
        content
      });
      toast.success('Follow-up sent successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send follow-up';
      toast.error(errorMessage);
      return false;
    }
  }
};
