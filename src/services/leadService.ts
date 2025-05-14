
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/crm';

export const leadService = {
  getLeads: async (branchId?: string) => {
    let query = supabase.from('leads').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getLeadById: async (id: string) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
    
    return data;
  },
  
  createLead: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    
    return data;
  },
  
  updateLead: async (id: string, updates: Partial<Lead>) => {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
    
    return data;
  },
  
  deleteLead: async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
    
    return true;
  },
  
  // Add refetch method to fix error in LeadsList.tsx
  refetch: async () => {
    return await leadService.getLeads();
  }
};
