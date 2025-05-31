import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Supabase client (alias for compatibility)
export { supabase };
export { supabase as default };

/**
 * Get the current user's branch information
 * @returns Branch ID if found, null otherwise
 */
export const getCurrentUserBranch = async (): Promise<string | null> => {
  try {
    // First check if there's an active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If no session or error getting session, return null
    if (sessionError || !session) {
      return null;
    }
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError?.message || 'No user found');
      return null;
    }
    
    // Get the user's profile to find their branch_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('branch_id')
      .eq('id', user.id)
      .single();
      
    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError?.message || 'No profile found');
      return null;
    }
    
    return profile.branch_id;
  } catch (error) {
    console.error('Error getting current user branch:', error);
    return null;
  }
};
