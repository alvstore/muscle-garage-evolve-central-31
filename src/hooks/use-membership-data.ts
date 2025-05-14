
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any[];
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMemberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchMemberships = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only proceed if a branch is selected
      if (!currentBranch?.id) {
        setMemberships([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', currentBranch.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMemberships(data as Membership[]);
      }
    } catch (err: any) {
      console.error('Error fetching memberships:', err);
      setError(err);
      toast.error('Failed to fetch memberships');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createMembership = async (membership: Omit<Membership, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      const newMembership = {
        ...membership,
        branch_id: membership.branch_id || currentBranch?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('memberships')
        .insert(newMembership)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMemberships(prevMemberships => [data as Membership, ...prevMemberships]);
        toast.success('Membership created successfully');
        return data as Membership;
      }
    } catch (err: any) {
      console.error('Error creating membership:', err);
      toast.error('Failed to create membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMembership = async (id: string, updates: Partial<Membership>) => {
    try {
      setIsLoading(true);
      
      const updatedMembership = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('memberships')
        .update(updatedMembership)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMemberships(prevMemberships => 
          prevMemberships.map(membership => 
            membership.id === id ? data as Membership : membership
          )
        );
        toast.success('Membership updated successfully');
        return data as Membership;
      }
    } catch (err: any) {
      console.error('Error updating membership:', err);
      toast.error('Failed to update membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMembership = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setMemberships(prevMemberships => 
        prevMemberships.filter(membership => membership.id !== id)
      );
      toast.success('Membership deleted successfully');
    } catch (err: any) {
      console.error('Error deleting membership:', err);
      toast.error('Failed to delete membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  return {
    memberships,
    isLoading,
    error,
    fetchMemberships,
    createMembership,
    updateMembership,
    deleteMembership
  };
};
