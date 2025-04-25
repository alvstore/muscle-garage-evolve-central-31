
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

export const useBranchData = () => {
  const { currentBranch } = useBranch();

  const fetchBranchData = async <T>(
    table: string, 
    select: string = '*', 
    additionalFilters: Record<string, any> = {}
  ) => {
    try {
      let query = supabase
        .from(table)
        .select(select)
        .eq('branch_id', currentBranch?.id);

      // Apply any additional filters
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;

      if (error) throw error;
      return data as T[];
    } catch (error) {
      console.error(`Error fetching ${table} data:`, error);
      return [];
    }
  };

  const createBranchSpecificRecord = async <T>(
    table: string, 
    record: Partial<T>
  ) => {
    try {
      const recordWithBranch = {
        ...record,
        branch_id: currentBranch?.id
      };

      const { data, error } = await supabase
        .from(table)
        .insert(recordWithBranch)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error);
      return null;
    }
  };

  return {
    fetchBranchData,
    createBranchSpecificRecord
  };
};
