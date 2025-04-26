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

export function useSupabaseQuery<T extends { id?: string }>({
  tableName,
  column,
  value,
  select = '*',
  orderBy,
  limit,
  filterBranch = true,
  additionalFilters = [],
  subscribeToChanges = false,
  branchId
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from(tableName).select(select);

      if (filterBranch && tableName !== 'branches') {
        if (branchId) {
          query = query.eq('branch_id', branchId);
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

      if (column && value !== undefined) {
        query = query.eq(column, value);
      }

      additionalFilters.forEach(filter => {
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

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data: resultData, error: resultError } = await query;

      if (resultError) {
        console.error(`Error fetching data from ${tableName}:`, resultError);
        setError(resultError.message);
        setData([]);
      } else {
        setData(resultData as T[]);
      }
    } catch (err: any) {
      console.error(`Unexpected error in useSupabaseQuery for ${tableName}:`, err);
      setError(err.message || 'An unexpected error occurred');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [tableName, column, value, select, orderBy, limit, filterBranch, additionalFilters, branchId]);

  useEffect(() => {
    if (subscribeToChanges) {
      const channel = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: tableName
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
  }, [tableName, subscribeToChanges, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (item: Omit<T, 'id'>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([item])
        .select();

      if (error) throw error;

      await fetchData();
      return data?.[0] as T || null;
    } catch (err: any) {
      console.error(`Error adding item to ${tableName}:`, err);
      setError(err.message);
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      await fetchData();
      return data?.[0] as T || null;
    } catch (err: any) {
      console.error(`Error updating item in ${tableName}:`, err);
      setError(err.message);
      return null;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      return true;
    } catch (err: any) {
      console.error(`Error deleting item from ${tableName}:`, err);
      setError(err.message);
      return false;
    }
  };

  return { data, isLoading, error, refreshData: fetchData, addItem, updateItem, deleteItem };
}
