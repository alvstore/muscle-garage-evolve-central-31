
import { supabase } from '@/integrations/supabase/client';

export async function createInitialAdmin() {
  try {
    const email = "Rajat.lekhari@hotmail.com";
    const password = "Rajat@3003";
    
    // Check if the admin account already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('role', 'admin');
    
    if (checkError) {
      console.error("Error checking for existing admin:", checkError);
      return null;
    }
    
    // If admin account already exists, no need to create a new one
    if (existingUsers && existingUsers.length > 0) {
      console.log("Admin account already exists");
      return null;
    }
    
    // Create the admin account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: "Rajat Lekhari",
          role: "admin"
        }
      }
    });
    
    if (error) {
      console.error("Error creating admin account:", error);
      return null;
    }
    
    console.log("Admin account created successfully");
    
    // Ensure profile has admin role
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.error("Error updating admin profile:", profileError);
      }
    }
    
    return data.user;
  } catch (error) {
    console.error("Unexpected error creating admin account:", error);
    return null;
  }
}
