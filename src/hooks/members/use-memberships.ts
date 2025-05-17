
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast-manager';

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  branch_id?: string;
}

export function useMemberships(branchId?: string) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('memberships').select('*');
        
        if (branchId) {
          // If branch ID is provided, filter by it
          query = query.eq('branch_id', branchId);
        }
        
        // Include active memberships without branch ID (global memberships)
        const { data, error } = await query.eq('is_active', true);
        
        if (error) {
          console.error('Error fetching memberships:', error);
          setError(`Failed to fetch memberships: ${error.message}`);
          return;
        }
        
        setMemberships(data || []);
      } catch (err: any) {
        console.error('Error in useMemberships:', err);
        setError(`An error occurred: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberships();
  }, [branchId]);
  
  const createMembership = async (membership: Omit<Membership, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('memberships')
        .insert({
          ...membership,
          is_active: membership.is_active !== undefined ? membership.is_active : true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating membership:', error);
        toast.error(`Failed to create membership: ${error.message}`);
        return null;
      }
      
      // Refresh the list
      setMemberships(prev => [...prev, data]);
      toast.success('Membership created successfully');
      
      return data;
    } catch (err: any) {
      console.error('Error in createMembership:', err);
      toast.error(`An error occurred: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateMembership = async (id: string, updates: Partial<Membership>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('memberships')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating membership:', error);
        toast.error(`Failed to update membership: ${error.message}`);
        return false;
      }
      
      // Update the local state
      setMemberships(prev => 
        prev.map(membership => 
          membership.id === id ? data : membership
        )
      );
      
      toast.success('Membership updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error in updateMembership:', err);
      toast.error(`An error occurred: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteMembership = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('memberships')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting membership:', error);
        toast.error(`Failed to delete membership: ${error.message}`);
        return false;
      }
      
      // Update the local state
      setMemberships(prev => 
        prev.filter(membership => membership.id !== id)
      );
      
      toast.success('Membership deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error in deleteMembership:', err);
      toast.error(`An error occurred: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    memberships,
    isLoading,
    error,
    createMembership,
    updateMembership,
    deleteMembership
  };
}
