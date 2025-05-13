
export interface User {
  id: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  full_name?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
  app_metadata?: {
    role?: string;
  };
}
