
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GenericStringError } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseSupabaseQueryOptions<T> {
  tableName: string;
  column?: string;
  value?: string | number;
  select?: string;
  orderBy?: {
    column: string;
    ascending: boolean;
  };
  limit?: number;
  filterBranch?: boolean;
  additionalFilters?: {
    column: string;
    value: any;
    operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike' | 'is';
  }[];
  subscribeToChanges?: boolean;
  branchId?: string;
}

export function useSupabaseQuery<T>(
  tableName: string,
  options: {
    select?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    branchScoped?: boolean;
  } = {}
) {
  const { currentBranch } = useBranch();
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from(tableName)
        .select(options.select || '*');
      
      // Apply branch scoping if needed
      if (options.branchScoped && currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply ordering
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true
        });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setData(data as T[]);
    } catch (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [tableName, options, currentBranch?.id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, error, isLoading, refetch: fetchData };
}
