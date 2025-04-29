import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

export function useSupabaseData<T>(
  tableName: string,
  options: {
    select?: string;
    filterBranch?: boolean;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    filters?: Record<string, any>;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from(tableName)
        .select(options.select || '*');
      
      // Apply branch filter if needed
      if (options.filterBranch && currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      // Apply additional filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data: result, error: supabaseError } = await query;
      
      if (supabaseError) throw supabaseError;
      
      setData(result as T[]);
    } catch (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [currentBranch?.id]);
  
  return { data, isLoading, error, refetch: fetchData };
}