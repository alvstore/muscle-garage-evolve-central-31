import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseDataHookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useSupabaseData hook
 *
 * A generic hook for fetching data from Supabase tables with filtering.
 *
 * @param {string} table - The name of the Supabase table to fetch data from.
 * @param {string} filterField - The field to filter by.
 * @param {any} filterValue - The value to filter for.
 * @param {string} [fields] - Optional. The fields to select. Defaults to '*'.
 * @returns {SupabaseDataHookResult<T>} An object containing the data, loading state, and error (if any).
 *
 * @example
 * // Usage:
 * const { data: products, loading, error } = useSupabaseData<Product>('products', 'category_id', categoryId);
 */
export function useSupabaseData<T>(
  table: string,
  filterField: string,
  filterValue: any,
  fields?: string
): SupabaseDataHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(table as any)
          .select(fields || '*')
          .eq(filterField, filterValue);

        if (error) {
          throw error;
        }

        setData(data as T);
        setError(null);
      } catch (err: any) {
        setError(err);
        setData(null);
        console.error(`Error fetching data from Supabase table "${table}":`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, filterField, filterValue, fields]);

  return { data, loading, error };
}

/**
 * useSupabaseQuery hook
 *
 * A generic hook for fetching data from Supabase using a custom query.
 *
 * @param {string} table - The name of the Supabase table to fetch data from.
 * @param {string} query - The Supabase query string.
 * @returns {SupabaseDataHookResult<T>} An object containing the data, loading state, and error (if any).
 *
 * @example
 * // Usage:
 * const { data: products, loading, error } = useSupabaseQuery<Product>('products', '*, categories(name)');
 */
export function useSupabaseQuery<T>(
  table: string,
  query: string
): SupabaseDataHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(table as any)
          .select(query);

        if (error) {
          throw error;
        }

        setData(data as T);
        setError(null);
      } catch (err: any) {
        setError(err);
        setData(null);
        console.error(`Error fetching data from Supabase table "${table}" with query "${query}":`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, query]);

  return { data, loading, error };
}

/**
 * useSupabaseList hook
 *
 * A generic hook for fetching a list of data from Supabase tables.
 *
 * @param {string} tableName - The name of the Supabase table to fetch data from.
 * @param {string} [fields] - Optional. The fields to select. Defaults to '*'.
 * @returns {SupabaseDataHookResult<T[]>} An object containing the data, loading state, and error (if any).
 *
 * @example
 * // Usage:
 * const { data: products, loading, error } = useSupabaseList<Product>('products');
 */
export function useSupabaseList<T>(
  tableName: string,
  fields?: string
): SupabaseDataHookResult<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName as any)
          .select(fields || '*');

        if (error) {
          throw error;
        }

        setData(data as T[]);
        setError(null);
      } catch (err: any) {
        setError(err);
        setData(null);
        console.error(`Error fetching data from Supabase table "${tableName}":`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, fields]);

  return { data, loading, error };
}
