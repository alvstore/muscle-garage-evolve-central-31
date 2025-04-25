
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnqgpucxlvubwqpkgstc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWdwdWN4bHZ1YndxcGtnc3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDgwNjQsImV4cCI6MjA2MDgyNDA2NH0.V5nFuGrJnTdFx60uI8hv46VKUmWoA2aAOx_jJjJFcUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to get the current user's branch
export const getCurrentUserBranch = async () => {
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

  return profile.branch_id;
};

// Function to check if user has access to a specific branch
export const userHasBranchAccess = async (branchId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('branch_id, accessible_branch_ids')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error checking branch access:', error);
    return false;
  }

  return (
    profile.branch_id === branchId || 
    profile.accessible_branch_ids?.includes(branchId) || 
    false
  );
};

// Function to get user role
export const getUserRole = async () => {
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

  return profile.role;
};

// Basic generic function for branched queries without the infinite recursion risk
export const branchSpecificQuery = async <T>(
  tableName: string,
  options: { 
    select?: string, 
    filterBranch?: boolean 
  } = {}
) => {
  const { select = '*', filterBranch = true } = options;
  
  let query = supabase.from(tableName).select(select);
  
  if (filterBranch) {
    const currentBranchId = await getCurrentUserBranch();
    if (currentBranchId) {
      query = query.eq('branch_id', currentBranchId);
    }
  }

  return query as any;
};
