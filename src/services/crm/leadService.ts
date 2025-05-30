
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/crm/crm';

export const leadService = {
  getLeads: async (branchId?: string): Promise<Lead[]> => {
    try {
      let query = supabase
        .from('leads')
        .select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },
  
  getLeadById: async (id: string, branchId?: string): Promise<Lead | null> => {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      throw error;
    }
  },
  
  createLead: async (lead: Partial<Lead>): Promise<Lead> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },
  
  updateLead: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      throw error;
    }
  },
  
  deleteLead: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      throw error;
    }
  }
};

export default leadService;
