
import { supabase } from '@/services/supabaseClient';
import { User } from '@/types/user';

/**
 * Register a new member with Supabase Auth and create profile
 */
export const registerMember = async (userData: Partial<User> & { password?: string }) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }

  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
          role: 'member',
          branchId: userData.branchId || userData.primaryBranchId,
          ...userData,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // No need to explicitly create a profile record as it's handled by the database trigger
    return authData.user;
  } catch (error: any) {
    console.error('Error registering member:', error);
    throw error;
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
