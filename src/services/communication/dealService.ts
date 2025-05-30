
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contact: string;
  contact_id?: string;
  closing_date?: string;
  created_at: string;
  updated_at?: string;
  branch_id?: string;
  owner_id?: string;
  notes?: string;
}

export const dealService = {
  async getDeals(branchId: string | undefined): Promise<Deal[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getDeals');
        return [];
      }
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching deals:', error);
        toast.error('Failed to load deals');
        return [];
      }
      
      return data as Deal[];
    } catch (error: any) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
      return [];
    }
  },
  
  async createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal | null> {
    try {
      if (!deal.branch_id) {
        toast.error('Branch ID is required to create a deal');
        return null;
      }
      
      const { data, error } = await supabase
        .from('deals')
        .insert([deal])
        .select()
        .single();

      if (error) {
        console.error('Error creating deal:', error);
        toast.error(`Failed to create deal: ${error.message}`);
        return null;
      }
      
      toast.success('Deal created successfully');
      return data as Deal;
    } catch (error: any) {
      console.error('Error creating deal:', error);
      toast.error(`Failed to create deal: ${error.message}`);
      return null;
    }
  },
  
  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating deal:', error);
        toast.error(`Failed to update deal: ${error.message}`);
        return null;
      }
      
      toast.success('Deal updated successfully');
      return data as Deal;
    } catch (error: any) {
      console.error('Error updating deal:', error);
      toast.error(`Failed to update deal: ${error.message}`);
      return null;
    }
  },
  
  async deleteDeal(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting deal:', error);
        toast.error(`Failed to delete deal: ${error.message}`);
        return false;
      }
      
      toast.success('Deal deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      toast.error(`Failed to delete deal: ${error.message}`);
      return false;
    }
  }
};
