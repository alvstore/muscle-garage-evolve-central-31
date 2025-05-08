import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from '@/types/crm';

export const crmService = {
  async getLeads(branchId: string | undefined): Promise<Lead[]> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Only filter by branch if a branchId is provided
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;

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
