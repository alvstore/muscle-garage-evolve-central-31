
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching branches:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Branch service error:', err);
      toast.error('Failed to load branches');
      return [];
    }
  },
  
  getBranch: async (id: string): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching branch:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Branch service error:', err);
      toast.error('Failed to load branch details');
      return null;
    }
  },
  
  createBranch: async (branch: Omit<Branch, 'id'>): Promise<Branch> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branch])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating branch:', error);
        throw error;
      }
      
      toast.success('Branch created successfully');
      return data;
    } catch (err) {
      console.error('Branch service error:', err);
      toast.error('Failed to create branch');
      throw err;
    }
  },
  
  updateBranch: async (branchId: string, updates: Partial<Branch>): Promise<Branch> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', branchId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating branch:', error);
        throw error;
      }
      
      toast.success('Branch updated successfully');
      return data;
    } catch (err) {
      console.error('Branch service error:', err);
      toast.error('Failed to update branch');
      throw err;
    }
  },
  
  deleteBranch: async (branchId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);
      
      if (error) {
        console.error('Error deleting branch:', error);
        throw error;
      }
      
      toast.success('Branch deleted successfully');
      return true;
    } catch (err) {
      console.error('Branch service error:', err);
      toast.error('Failed to delete branch');
      return false;
    }
  }
};
