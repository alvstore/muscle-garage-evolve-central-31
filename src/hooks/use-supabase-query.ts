
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { GenericStringError, convertErrorToGenericError } from '@/types';
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

export function useSupabaseQuery<T>(options: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from(options.tableName).select(options.select);

      if (options.filterBranch && options.tableName !== 'branches') {
        if (options.branchId) {
          query = query.eq('branch_id', options.branchId);
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('role, branch_id')
              .eq('id', user.id)
              .single();

            if (userProfile) {
              if (userProfile.role !== 'admin') {
                query = query.eq('branch_id', userProfile.branch_id);
              }
            }
          }
        }
      }

      if (options.column && options.value !== undefined) {
        query = query.eq(options.column, options.value);
      }

      if (options.additionalFilters && options.additionalFilters.length > 0) {
        options.additionalFilters.forEach(filter => {
          const { column, value, operator = 'eq' } = filter;
          if (operator === 'eq') query = query.eq(column, value);
          else if (operator === 'neq') query = query.neq(column, value);
          else if (operator === 'gt') query = query.gt(column, value);
          else if (operator === 'lt') query = query.lt(column, value);
          else if (operator === 'gte') query = query.gte(column, value);
          else if (operator === 'lte') query = query.lte(column, value);
          else if (operator === 'like') query = query.like(column, value);
          else if (operator === 'ilike') query = query.ilike(column, value);
          else if (operator === 'is') query = query.is(column, value);
        });
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: resultData, error: resultError } = await query;

      if (resultError) {
        console.error('Supabase query error:', resultError);
        setError(resultError.message || 'An error occurred while fetching data');
      } else {
        // Type assertion to ensure the data matches the generic type T
        setData(resultData as T[] || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Unexpected error in useSupabaseQuery:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.tableName, options.column, options.value, options.select, options.orderBy, options.limit, options.filterBranch, options.additionalFilters, options.branchId]);

  useEffect(() => {
    if (options.subscribeToChanges) {
      const channel = supabase
        .channel(`${options.tableName}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: options.tableName
        }, (payload) => {
          fetchData();
        })
        .subscribe();

      setSubscription(channel);

      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [options.tableName, options.subscribeToChanges, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Type-safe CRUD operations
  const addItem = async (item: Omit<T, 'id'>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(options.tableName)
        .insert([item])
        .select();

      if (error) throw error;

      await fetchData();
      return data?.[0] as T || null;
    } catch (err: any) {
      console.error(`Error adding item to ${options.tableName}:`, err);
      setError(err.message);
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(options.tableName)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      await fetchData();
      return data?.[0] as T || null;
    } catch (err: any) {
      console.error(`Error updating item in ${options.tableName}:`, err);
      setError(err.message);
      return null;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(options.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      return true;
    } catch (err: any) {
      console.error(`Error deleting item from ${options.tableName}:`, err);
      setError(err.message);
      return false;
    }
  };

  return { data, isLoading, error, refreshData: fetchData, addItem, updateItem, deleteItem };
}
