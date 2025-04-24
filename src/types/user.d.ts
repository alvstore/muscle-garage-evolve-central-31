
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User extends SupabaseUser {
  full_name?: string;
  role?: string;
  branch_id?: string;
  accessible_branch_ids?: string[];
  is_branch_manager?: boolean;
  avatar_url?: string;
  department?: string;
  email?: string;
  phone?: string;
}
