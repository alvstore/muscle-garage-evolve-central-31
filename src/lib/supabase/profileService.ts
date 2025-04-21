
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const createProfile = async (userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email!,
    password: userData.password!, // You'll need to add password to your User type
    options: {
      data: {
        full_name: userData.name,
        role: userData.role,
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
