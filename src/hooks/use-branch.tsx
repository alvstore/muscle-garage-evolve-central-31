
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Branch, BranchFormValues } from '@/types/branch';
import { toast } from 'sonner';

export const useBranch = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setBranches(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      setError(error.message || 'Failed to fetch branches');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBranchById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error(`Error fetching branch with ID ${id}:`, error);
      setError(error.message || `Failed to fetch branch with ID ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBranch = useCallback(async (branchData: Omit<Branch, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Make sure required fields are present
      if (!branchData.name) {
        throw new Error('Branch name is required');
      }
      
      const { data, error } = await supabase
        .from('branches')
        .insert([
          {
            name: branchData.name,
            address: branchData.address || '',
            city: branchData.city || null,
            state: branchData.state || null,
            country: branchData.country || 'India',
            email: branchData.email || null,
            phone: branchData.phone || null,
            is_active: branchData.is_active ?? true,
            manager_id: branchData.manager_id || null,
            branch_code: branchData.branch_code || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the branches list
      setBranches(prev => [...prev, data]);
      
      toast.success('Branch created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating branch:', error);
      setError(error.message || 'Failed to create branch');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBranch = useCallback(async (id: string, branchUpdates: Partial<Branch>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('branches')
        .update({
          ...branchUpdates,
          is_active: branchUpdates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the branches list
      setBranches(prev => prev.map(branch => branch.id === id ? data : branch));
      
      toast.success('Branch updated successfully');
      return data;
    } catch (error: any) {
      console.error(`Error updating branch with ID ${id}:`, error);
      setError(error.message || `Failed to update branch with ID ${id}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBranch = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the branches list
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
      toast.success('Branch deleted successfully');
      return true;
    } catch (error: any) {
      console.error(`Error deleting branch with ID ${id}:`, error);
      setError(error.message || `Failed to delete branch with ID ${id}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    isLoading,
    error,
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch,
    deleteBranch
  };
};
