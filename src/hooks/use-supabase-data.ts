
import { useState, useEffect } from 'react';
import { supabase } from "@/services/supabaseClient";
import { toast } from 'sonner';

export function useSupabaseData<T>(
  tableName: string,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    orderBy?: string;
    limit?: number;
    branchId?: string | null;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Use type assertion to handle dynamic table names
      let query = supabase
        .from(tableName as any)
        .select(options.columns || '*', { count: 'exact' });
      
      // Apply branch filtering if needed
      if (options.branchId) {
        query = query.eq('branch_id', options.branchId);
      }

      // Apply custom filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setData(data as T[]);
      setCount(count || 0);
      setError(null);
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      setError(error as Error);
      toast.error(`Failed to load data from ${tableName}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, JSON.stringify(options)]); // Re-fetch when table or options change

  const refresh = () => {
    fetchData();
  };

  return { data, loading, error, count, refresh };
}

export function useSingleSupabaseRecord<T>(
  tableName: string,
  recordId: string | null | undefined,
  options: {
    columns?: string;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!recordId) {
        setData(null);
        return;
      }

      try {
        setLoading(true);
        
        // Use type assertion to handle dynamic table names
        const { data, error } = await supabase
          .from(tableName as any)
          .select(options.columns || '*')
          .eq('id', recordId)
          .maybeSingle();

        if (error) throw error;

        setData(data as T);
        setError(null);
      } catch (error) {
        console.error(`Error fetching record from ${tableName}:`, error);
        setError(error as Error);
        toast.error(`Failed to load record from ${tableName}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, recordId, options.columns]);

  const refresh = async () => {
    if (!recordId) return;
    
    try {
      setLoading(true);
      
      // Use type assertion to handle dynamic table names
      const { data, error } = await supabase
        .from(tableName as any)
        .select(options.columns || '*')
        .eq('id', recordId)
        .maybeSingle();

      if (error) throw error;

      setData(data as T);
      setError(null);
    } catch (error) {
      console.error(`Error refreshing record from ${tableName}:`, error);
      setError(error as Error);
      toast.error(`Failed to refresh record from ${tableName}`);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}
