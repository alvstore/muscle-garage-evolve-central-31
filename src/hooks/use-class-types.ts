
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useClassTypes = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchClassTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only fetch if we have a branch
      if (!currentBranch?.id) {
        setClassTypes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('class_types')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true);

      if (fetchError) throw fetchError;
      
      setClassTypes(data || []);
    } catch (err) {
      console.error('Error fetching class types:', err);
      setError('Failed to load class types');
      toast.error('Failed to load class types');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setClassTypes([]);
      setIsLoading(false);
      return;
    }
    
    fetchClassTypes();
    
    // Set up real-time subscription for class_types table
    const channel = supabase
      .channel('class_types_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'class_types',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Class types data changed:', payload);
          fetchClassTypes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    classTypes,
    isLoading,
    error,
    refetch: fetchClassTypes
  };
};
