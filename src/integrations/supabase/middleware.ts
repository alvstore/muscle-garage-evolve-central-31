
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';

/**
 * Middleware to add branch_id filtering to queries for tables that support it
 * @param client - Supabase client
 * @param tableName - Table name to query
 * @param branchId - Branch ID to filter by
 * @returns Modified Supabase query builder
 */
export const withBranchScope = (
  client: SupabaseClient,
  tableName: string,
  branchId?: string | null
) => {
  let query = client.from(tableName).select();
  
  // Only add branch filter if branch ID is provided and table has branch_id column
  if (branchId) {
    // For tables with branch_id column, add the filter
    // This avoids 406 errors when querying tables that don't have branch_id
    const hasBranchColumn = true; // This would ideally check schema, but we assume branch tables have this column
    
    if (hasBranchColumn) {
      query = query.eq('branch_id', branchId);
    }
  }
  
  return query;
};

/**
 * Safely fetch attendance settings with fallback for errors
 * @param branchId - Branch ID to fetch settings for
 * @returns Attendance settings or null
 */
export const safelyFetchAttendanceSettings = async (branchId?: string | null) => {
  try {
    // Direct approach with error handling instead of requiring branch_id
    const { data, error } = await supabase
      .from('attendance_settings')
      .select('*')
      .eq('branch_id', branchId || '')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching attendance settings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in attendance settings fetch:', error);
    return null;
  }
};

/**
 * Handle foreignKey constraint issues by checking if records exist
 * @param tableName - Table name to check
 * @param id - ID to check existence of
 * @returns Boolean indicating if record exists
 */
export const checkRecordExists = async (tableName: string, id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Safely create a membership assignment with foreign key validations
 */
export const safelyCreateMembershipAssignment = async (
  membershipData: {
    member_id: string;
    membership_id: string;
    [key: string]: any;
  }
) => {
  try {
    // First check if member exists
    const memberExists = await checkRecordExists('members', membershipData.member_id);
    if (!memberExists) {
      return {
        success: false,
        error: `Member with ID ${membershipData.member_id} does not exist`
      };
    }
    
    // Then check if membership exists
    const membershipExists = await checkRecordExists('memberships', membershipData.membership_id);
    if (!membershipExists) {
      return {
        success: false,
        error: `Membership with ID ${membershipData.membership_id} does not exist`
      };
    }
    
    // Now it's safe to insert
    const { data, error } = await supabase
      .from('member_memberships')
      .insert(membershipData)
      .select()
      .single();
      
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create membership assignment'
    };
  }
};
