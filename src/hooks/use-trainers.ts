
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

export interface Trainer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  user_id?: string;
  branch_id?: string;
  specializations?: string[];
  bio?: string;
  status?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

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
          user_id: item.id,
          branch_id: item.branch_id,
          specializations: item.department ? [item.department] : [],
          bio: '',
          status: 'active',
          created_at: item.created_at,
          updated_at: item.updated_at
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

  return {
    trainers,
    isLoading,
    error,
    fetchTrainers
  };
};
