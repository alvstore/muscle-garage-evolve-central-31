
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { useState, useEffect } from 'react';

interface Class {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  schedule: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!currentBranch?.id) {
        setClasses([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('branch_id', currentBranch.id);

        if (error) throw error;

        const formattedClasses = data?.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          trainerId: c.trainer_id,
          schedule: c.recurrence || '',
          capacity: c.capacity,
          createdAt: c.created_at,
          updatedAt: c.updated_at
        })) || [];

        setClasses(formattedClasses);
      } catch (err: any) {
        console.error('Error fetching classes:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();

    // Set up real-time subscription
    if (currentBranch?.id) {
      const channel = supabase
        .channel('classes_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `branch_id=eq.${currentBranch.id}`
        }, () => {
          fetchClasses();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentBranch?.id]);

  return {
    classes,
    isLoading,
    error
  };
};
