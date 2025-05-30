
// Supabase service types
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface RealtimePayload<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: T;
  old?: T;
  errors?: SupabaseError[];
}

export interface DatabaseFunction {
  name: string;
  args?: Record<string, any>;
}

export interface RLSPolicy {
  table: string;
  policy: string;
  roles: UserRole[];
}
