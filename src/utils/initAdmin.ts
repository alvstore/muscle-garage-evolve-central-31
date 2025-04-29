
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function createInitialAdmin() {
  try {
    console.log("Checking for existing admin account...");
    
    // Check if an admin account already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    
    if (checkError) {
      console.error("Error checking for existing admin:", checkError);
      return null;
    }
    
    // If at least one admin exists, no need to create a new one
    if (existingAdmins && existingAdmins.length > 0) {
      console.log("Admin account already exists");
      return null;
    }
    
    // Admin credentials - only used for initial setup
    const email = "rajat.lekhari@alvstore.in";
    const password = "Rajat@3003";
    
    console.log("Creating admin account with email:", email);
    
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
    toast.success("Admin account created successfully");
    
    // Ensure profile has admin role
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.error("Error updating admin profile:", profileError);
        toast.error("Error finalizing admin account setup");
      }
    }
    
    return data.user;
  } catch (error) {
    console.error("Unexpected error creating admin account:", error);
    toast.error("Unexpected error during initialization");
    return null;
  }
}
