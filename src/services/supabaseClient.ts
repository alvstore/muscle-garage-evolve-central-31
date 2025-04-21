
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please connect your Lovable project to Supabase using the Supabase integration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription helpers
export const subscribeToTable = (
  tableName: string, 
  callback: (payload: any) => void, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  return supabase
    .channel(`public:${tableName}`)
    .on('postgres_changes', { 
      event: event, 
      schema: 'public', 
      table: tableName 
    }, callback)
    .subscribe();
};

export const subscribeToTableWithFilter = (
  tableName: string,
  filterColumn: string,
  filterValue: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  return supabase
    .channel(`public:${tableName}:${filterColumn}:${filterValue}`)
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: tableName,
        filter: `${filterColumn}=eq.${filterValue}`,
      },
      callback
    )
    .subscribe();
};

export default supabase;
