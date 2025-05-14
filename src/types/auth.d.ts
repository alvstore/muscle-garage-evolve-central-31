
export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
  branch_id?: string;
  // Add these properties needed by components
  full_name?: string;
  avatar_url?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}
