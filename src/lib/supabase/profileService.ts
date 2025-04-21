import { supabase } from '@/services/supabaseClient';
import { User } from '@/types';

export const createProfile = async (userData: Partial<User> & { password?: string }) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.name,
        role: userData.role,
        branch_id: userData.branchId || userData.primaryBranchId
      }
    }
  });

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: userData.name,
      email: userData.email,
      phone: userData.phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};
