
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

// Real-time subscriptions
export const subscribeToTable = (tableName: string, callback: Function) => {
  const channel = supabase
    .channel(`table:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Example subscription to a specific record
export const subscribeToRecord = (tableName: string, recordId: string, callback: Function) => {
  const channel = supabase
    .channel(`record:${tableName}:${recordId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: tableName,
      filter: `id=eq.${recordId}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Data fetching helper
export const fetchData = async (tableName: string, query = {}) => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .match(query);

  if (error) throw error;
  return data;
};

// Data insertion helper
export const insertData = async (tableName: string, data: any) => {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();

  if (error) throw error;
  return result;
};

// Data update helper
export const updateData = async (tableName: string, id: string, data: any) => {
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result;
};

// Data deletion helper
export const deleteData = async (tableName: string, id: string) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
