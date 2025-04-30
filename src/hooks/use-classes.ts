
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface ClassSchedule {
  id: string;
  name: string;
  type: string;
  description?: string;
  start_time: string;
  end_time: string;
  trainer_id: string;
  branch_id?: string;
  capacity: number;
  enrolled?: number;
  status?: string;
  recurring?: boolean;
  recurring_pattern?: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only fetch if we have a branch
      if (!currentBranch?.id) {
        setClasses([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('class_schedules')
        .select(`
          id,
          name,
          type,
          description,
          start_time,
          end_time,
          trainer_id,
          branch_id,
          capacity,
          enrolled,
          status,
          recurring,
          recurring_pattern
        `)
        .eq('branch_id', currentBranch.id);

      if (fetchError) throw fetchError;
      
      setClasses(data || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setClasses([]);
      setIsLoading(false);
      return;
    }
    
    fetchClasses();
    
    // Set up real-time subscription for class_schedules table
    const channel = supabase
      .channel('classes_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'class_schedules',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Classes data changed:', payload);
          fetchClasses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses
  };
};
