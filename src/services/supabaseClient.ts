
import { createClient } from '@supabase/supabase-js';

// Supabase credentials from the Supabase integration
const supabaseUrl = "https://rnqgpucxlvubwqpkgstc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWdwdWN4bHZ1YndxcGtnc3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDgwNjQsImV4cCI6MjA2MDgyNDA2NH0.V5nFuGrJnTdFx60uI8hv46VKUmWoA2aAOx_jJjJFcUA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription helpers
export const subscribeToTable = (
  tableName: string, 
  callback: (payload: any) => void, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  const channel = supabase.channel(`public:${tableName}`);
  
  return channel
    .on(
      'broadcast',
      { 
        event: event
      },
      callback
    )
    .subscribe();
};

export const subscribeToTableWithFilter = (
  tableName: string,
  filterColumn: string,
  filterValue: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  const channel = supabase.channel(`public:${tableName}:${filterColumn}:${filterValue}`);
  
  return channel
    .on(
      'broadcast',
      {
        event: event,
        filter: `${filterColumn}=eq.${filterValue}`,
      },
      callback
    )
    .subscribe();
};

export default supabase;
