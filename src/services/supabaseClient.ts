
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = 'https://rnqgpucxlvubwqpkgstc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWdwdWN4bHZ1YndxcGtnc3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDgwNjQsImV4cCI6MjA2MDgyNDA2NH0.V5nFuGrJnTdFx60uI8hv46VKUmWoA2aAOx_jJjJFcUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
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

// Define schemas for database tables
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'staff', 'trainer', 'member']),
  branch_id: z.string().uuid().nullable(),
  // Add other profile fields
});

export type Profile = z.infer<typeof ProfileSchema>;

// Create a wrapper for Supabase operations with schema validation
export const validateData = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Schema validation error:', error);
    throw new Error(`Invalid data structure: ${error.message}`);
  }
};
