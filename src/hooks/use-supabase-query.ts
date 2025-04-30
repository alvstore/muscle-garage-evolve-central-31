
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface GenericStringError {
  message: string;
}

export function useSupabaseQuery<T>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, any>;
    limit?: number;
    order?: { column: string; ascending: boolean };
    initialData?: T[];
    deps?: any[];
    onError?: (error: PostgrestError) => void;
    onSuccess?: (data: T[]) => void;
  } = {}
) {
  const {
    select = '*',
    filters = {},
    limit,
    order,
    initialData = [] as T[],
    deps = [],
    onError,
    onSuccess
  } = options;

  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply ordering
      if (order) {
        query = query.order(order.column, { ascending: order.ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: responseData, error: responseError } = await query;

      if (responseError) {
        throw responseError;
      }

      setData(responseData as T[]);
      
      if (onSuccess) {
        onSuccess(responseData as T[]);
      }

    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      
      const typedError = err as PostgrestError;
      setError(typedError);
      
      if (onError) {
        onError(typedError);
      } else {
        toast.error(`Failed to load ${table}: ${typedError.message}`);
      }
      
      // Set data to initialData on error to recover
      setData(initialData);
    } finally {
      setIsLoading(false);
    }
  }, [table, select, JSON.stringify(filters), limit, JSON.stringify(order), ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData
  };
}
