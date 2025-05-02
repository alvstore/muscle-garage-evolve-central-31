
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { Trainer } from '@/types/trainer';

export const useTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchTrainers = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, cannot fetch trainers');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')
        .eq('branch_id', currentBranch.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedTrainers: Trainer[] = data.map(item => ({
          id: item.id,
          name: item.full_name || '',
          email: item.email,
          phone: item.phone,
          specializations: item.department ? [item.department] : [],
          specialization: item.department, // For backwards compatibility
          bio: '',
          isAvailable: true,
          branchId: item.branch_id,
          avatar: item.avatar_url,
          ratingValue: 0,
          rating: 0
        }));
        
        setTrainers(formattedTrainers);
      }
    } catch (err: any) {
      console.error('Error fetching trainers:', err);
      setError(err);
      toast.error('Failed to fetch trainers');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTrainers();
    }
  }, [fetchTrainers, currentBranch?.id]);

  // Add the missing methods
  const refetch = fetchTrainers;

  const deleteTrainer = async (id: string) => {
    try {
      setIsLoading(true);
      
      // First check if the trainer has any active assignments
      const { data: assignments, error: checkError } = await supabase
        .from('trainer_assignments')
        .select('id')
        .eq('trainer_id', id)
        .eq('is_active', true);
      
      if (checkError) throw checkError;
      
      if (assignments && assignments.length > 0) {
        toast.error('Cannot delete trainer with active member assignments');
        return false;
      }
      
      // Delete the trainer profile
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Trainer deleted successfully');
      await fetchTrainers();
      return true;
    } catch (err: any) {
      console.error('Error deleting trainer:', err);
      toast.error(err.message || 'Failed to delete trainer');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trainers,
    isLoading,
    error,
    fetchTrainers,
    refetch,
    deleteTrainer
  };
};
