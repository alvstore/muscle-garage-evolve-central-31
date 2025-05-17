
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UseSupabaseQueryOptions<T> {
  tableName: string;
  select?: string;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  filters?: Array<{
    column: string;
    operator: string;
    value: any;
  }>;
  enabled?: boolean;
}

export function useSupabaseQuery<T>({
  tableName,
  select = '*',
  orderBy,
  filters = [],
  enabled = true
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from(tableName)
        .select(select);

      // Apply filters if provided
      filters.forEach(filter => {
        if (filter.operator === 'eq') {
          query = query.eq(filter.column, filter.value) as any;
        } else if (filter.operator === 'neq') {
          query = query.neq(filter.column, filter.value) as any;
        } else if (filter.operator === 'gt') {
          query = query.gt(filter.column, filter.value) as any;
        } else if (filter.operator === 'gte') {
          query = query.gte(filter.column, filter.value) as any;
        } else if (filter.operator === 'lt') {
          query = query.lt(filter.column, filter.value) as any;
        } else if (filter.operator === 'lte') {
          query = query.lte(filter.column, filter.value) as any;
        } else if (filter.operator === 'like') {
          query = query.like(filter.column, filter.value) as any;
        } else if (filter.operator === 'ilike') {
          query = query.ilike(filter.column, filter.value) as any;
        }
      });

      // Apply ordering if provided
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true
        });
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result as T);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tableName, select, orderBy, filters, enabled]);

  // Initial data fetching
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add necessary methods for CRUD operations
  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([item])
        .select();

      if (error) throw error;
      await fetchData(); // Refresh data
      return data[0];
    } catch (err) {
      console.error(`Error adding item to ${tableName}:`, err);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchData(); // Refresh data
      return data[0];
    } catch (err) {
      console.error(`Error updating item in ${tableName}:`, err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error(`Error deleting item from ${tableName}:`, err);
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    refreshData: fetchData,  // Alias for consistency
    addItem,
    updateItem,
    deleteItem
  };
}
