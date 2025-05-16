
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnqgpucxlvubwqpkgstc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWdwdWN4bHZ1YndxcGtnc3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDgwNjQsImV4cCI6MjA2MDgyNDA2NH0.V5nFuGrJnTdFx60uI8hv46VKUmWoA2aAOx_jJjJFcUA';

// Custom fetch implementation that suppresses logs only for Supabase requests
const createCustomFetch = (baseUrl: string) => {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof URL ? input.href : typeof input === 'string' ? input : input.url;
    
    // Only modify behavior for Supabase requests
    if (url && url.includes(new URL(baseUrl).hostname)) {
      // Save original console methods
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
      };

      // Override console methods with no-ops
      const noop = () => {};
      console.log = noop;
      console.info = noop;
      console.warn = noop;
      console.error = noop;
      console.debug = noop;

      try {
        const response = await fetch(input, init);
        return response;
      } finally {
        // Restore original console methods
        console.log = originalConsole.log;
        console.info = originalConsole.info;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.debug = originalConsole.debug;
      }
    }
    
    // For non-Supabase requests, use the original fetch
    return fetch(input, init);
  };
};

// Create custom fetch instance for Supabase
const customFetch = createCustomFetch(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
    headers: {
      'apikey': supabaseAnonKey
    }
  },
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Prevent URL detection causing refreshes
  }
});

// Function to get the current user's branch
export const getCurrentUserBranch = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('branch_id')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user branch:', error);
      return null;
    }

    return profile?.branch_id;
  } catch (error) {
    console.error('Error in getCurrentUserBranch:', error);
    return null;
  }
};

// Function to check if user has access to a specific branch
export const userHasBranchAccess = async (branchId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('branch_id, accessible_branch_ids, role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking branch access:', error);
      return false;
    }

    // Admin has access to all branches
    if (profile?.role === 'admin') return true;
    
    // User has access to their own branch
    if (profile?.branch_id === branchId) return true;

    // Branch manager or staff with multiple branch access
    if (profile?.accessible_branch_ids?.includes(branchId)) return true;

    // Default: no access
    return false;
  } catch (error) {
    console.error('Error in userHasBranchAccess:', error);
    return false;
  }
};

// Function to get user role
export const getUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return profile?.role;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
};

// Basic generic function for branched queries
export const branchSpecificQuery = async <T>(
  tableName: string,
  options: { 
    select?: string, 
    filterBranch?: boolean 
  } = {}
) => {
  const { select = '*', filterBranch = true } = options;
  
  try {
    let query = supabase.from(tableName).select(select);
    
    if (filterBranch) {
      const currentBranchId = await getCurrentUserBranch();
      if (currentBranchId) {
        query = query.eq('branch_id', currentBranchId);
      }
    }

    return query;
  } catch (error) {
    console.error(`Error in branchSpecificQuery for ${tableName}:`, error);
    throw error;
  }
};
