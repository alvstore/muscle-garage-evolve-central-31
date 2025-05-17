import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserBranch = () => {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserBranch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setBranchId(null);
          return;
        }

        const { data, error } = await supabase
          .from('branch_users')
          .select('branch_id')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setBranchId(data?.branch_id || null);
      } catch (error) {
        console.error('Error fetching user branch:', error);
        setBranchId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBranch();
  }, []);

  return {
    branchId,
    isLoading,
  };
};
