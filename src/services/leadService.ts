
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from '@/types/crm';

export const leadService = {
  async getLeads(branchId: string | undefined): Promise<Lead[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getLeads');
        return [];
      }
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching leads:', error);
        throw error;
      }
      
      return data as Lead[];
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
      return [];
    }
  },

  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> {
    try {
      if (!lead.branch_id) {
        toast.error('Branch ID is required to create a lead');
        return null;
      }
      
      const leadWithTimestamps = {
        ...lead,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert([leadWithTimestamps])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Lead created successfully');
      return data as Lead;
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast.error(`Failed to create lead: ${error.message}`);
      return null;
    }
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Lead updated successfully');
      return data as Lead;
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error(`Failed to update lead: ${error.message}`);
      return null;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Lead deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error(`Failed to delete lead: ${error.message}`);
      return false;
    }
  }
};

export default leadService;
