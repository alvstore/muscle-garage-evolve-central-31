
import { useState, useEffect } from 'react';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useBranch } from './use-branch';

interface UseSupabaseQueryOptions<T> {
  table: string;
  select?: string;
  filters?: (query: PostgrestFilterBuilder<any, any, any[]>) => PostgrestFilterBuilder<any, any, any[]>;
  branchScoped?: boolean;
  realtimeEnabled?: boolean;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}

export function useSupabaseQuery<T>({
  table,
  select = '*',
  filters,
  branchScoped = true,
  realtimeEnabled = true,
  orderBy,
  limit
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!user) {
        if (isMounted) {
          setData([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        let query = supabase.from(table).select(select);
        
        // Apply branch filtering if needed
        if (branchScoped && currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        // Apply custom filters
        if (filters) {
          query = filters(query);
        }
        
        // Apply ordering
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }
        
        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        if (isMounted) {
          setData(data || []);
        }
      } catch (err) {
        console.error(`Error fetching data from ${table}:`, err);
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Set up realtime subscription if enabled
    let subscription: any;
    
    if (realtimeEnabled) {
      subscription = supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table 
          }, 
          (payload) => {
            handleRealtimeUpdate(payload);
          }
        )
        .subscribe();
    }
    
    return () => {
      isMounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, select, currentBranch?.id, user?.id, realtimeEnabled]);

  const handleRealtimeUpdate = (payload: SupabaseRealtimePayload<any>) => {
    if (!payload || !payload.new) return;
    
    const { eventType } = payload;
    
    // Apply branch filtering to realtime updates
    if (branchScoped && currentBranch?.id && payload.new.branch_id !== currentBranch.id) {
      return;
    }

    switch (eventType) {
      case 'INSERT':
        setData(prev => [payload.new, ...prev]);
        break;
      case 'UPDATE':
        setData(prev => 
          prev.map(item => 
            item.id === payload.new.id ? payload.new : item
          )
        );
        break;
      case 'DELETE':
        setData(prev => 
          prev.filter(item => item.id !== payload.old.id)
        );
        break;
      default:
        break;
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from(table).select(select);
      
      if (branchScoped && currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      if (filters) {
        query = filters(query);
      }
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setData(data || []);
    } catch (err) {
      console.error(`Error refreshing data from ${table}:`, err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, refresh };
}

export default useSupabaseQuery;
