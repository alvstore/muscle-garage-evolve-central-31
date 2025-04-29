
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('branches')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBranches(data as Branch[]);
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err);
      toast.error('Failed to fetch branches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBranch = async (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      const newBranch = {
        ...branch,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('branches')
        .insert(newBranch)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBranches(prevBranches => [data as Branch, ...prevBranches]);
        toast.success('Branch created successfully');
        return data as Branch;
      }
    } catch (err: any) {
      console.error('Error creating branch:', err);
      toast.error('Failed to create branch');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranch = async (id: string, updates: Partial<Branch>) => {
    try {
      setIsLoading(true);
      
      const updatedBranch = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('branches')
        .update(updatedBranch)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBranches(prevBranches => 
          prevBranches.map(branch => 
            branch.id === id ? data as Branch : branch
          )
        );
        toast.success('Branch updated successfully');
        return data as Branch;
      }
    } catch (err: any) {
      console.error('Error updating branch:', err);
      toast.error('Failed to update branch');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setBranches(prevBranches => 
        prevBranches.filter(branch => branch.id !== id)
      );
      toast.success('Branch deleted successfully');
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      toast.error('Failed to delete branch');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    isLoading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch
  };
};
