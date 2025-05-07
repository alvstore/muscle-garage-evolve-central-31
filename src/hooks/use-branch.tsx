import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserBranch } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';
import { useAuth } from './use-auth';

export const useBranch = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching branches:', error);
        setError('Failed to load branches');
        toast.error('Failed to load branches');
        return;
      }

      setBranches(data);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches');
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch current branch
  const fetchCurrentBranch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const branchId = await getCurrentUserBranch();

      if (!branchId) {
        setCurrentBranch(null);
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .single();

      if (error) {
        console.error('Error fetching current branch:', error);
        setError('Failed to load current branch');
        toast.error('Failed to load current branch');
        return;
      }

      setCurrentBranch(data);
    } catch (err) {
      console.error('Error fetching current branch:', err);
      setError('Failed to load current branch');
      toast.error('Failed to load current branch');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new branch
  const createBranch = async (branch: Omit<Branch, 'id'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branch])
        .select()
        .single();

      if (error) {
        console.error('Error creating branch:', error);
        setError('Failed to create branch');
        toast.error('Failed to create branch');
        return null;
      }

      setBranches(prev => [...prev, data]);
      toast.success('Branch created successfully');
      return data;
    } catch (err) {
      console.error('Error creating branch:', err);
      setError('Failed to create branch');
      toast.error('Failed to create branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing branch
  const updateBranch = async (id: string, updates: Partial<Branch>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating branch:', error);
        setError('Failed to update branch');
        toast.error('Failed to update branch');
        return null;
      }

      setBranches(prev => prev.map(branch => branch.id === id ? data : branch));
      setCurrentBranch(prev => prev?.id === id ? { ...prev, ...data } : prev);
      toast.success('Branch updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating branch:', err);
      setError('Failed to update branch');
      toast.error('Failed to update branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a branch
  const deleteBranch = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting branch:', error);
        setError('Failed to delete branch');
        toast.error('Failed to delete branch');
        return false;
      }

      setBranches(prev => prev.filter(branch => branch.id !== id));
      toast.success('Branch deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError('Failed to delete branch');
      toast.error('Failed to delete branch');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getImageUrl = (bucket: string, path: string) => {
    if (!supabase) return '';
    
    // Using the correct way to access Supabase storage URLs
    return `${supabase.storageClient.url}/object/public/${bucket}/${path}`;
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    if (user) {
      fetchCurrentBranch();
    }
  }, [user, fetchCurrentBranch]);

  return {
    branches,
    currentBranch,
    setCurrentBranch,
    isLoading,
    error,
    fetchBranches,
    fetchCurrentBranch,
    createBranch,
    updateBranch,
    deleteBranch,
	getImageUrl
  };
};
