
import { Lead } from '@/types/crm';
import { supabase } from './supabaseClient';

class LeadService {
  async getLeads(branchId?: string) {
    try {
      let query = supabase.from('leads').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  async updateLead(id: string, updates: Partial<Lead>) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data?.[0] as Lead;
    } catch (error) {
      console.error('Error updating lead:', error);
      return null;
    }
  }

  async deleteLead(id: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  }
}

export const leadService = new LeadService();
