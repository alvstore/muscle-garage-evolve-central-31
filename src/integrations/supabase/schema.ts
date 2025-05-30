
// Supabase database schema types for reference
// This file is auto-generated, do not edit manually

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          role: string;
          branch_id?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          zip_code?: string;
          gender?: string;
          accessible_branch_ids?: string[];
          is_branch_manager?: boolean;
        };
        Insert: {
          id: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          role?: string;
          branch_id?: string;
          is_active?: boolean;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          zip_code?: string;
          gender?: string;
          accessible_branch_ids?: string[];
          is_branch_manager?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string;
          role?: string;
          branch_id?: string;
          is_active?: boolean;
          updated_at?: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          zip_code?: string;
          gender?: string;
          accessible_branch_ids?: string[];
          is_branch_manager?: boolean;
        };
      };
      branches: {
        Row: {
          id: string;
          name: string;
          address?: string;
          city?: string;
          state?: string;
          country: string;
          phone?: string;
          email?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          manager_id?: string;
          branch_code?: string;
          max_capacity?: number;
          opening_hours?: string;
          closing_hours?: string;
          region?: string;
          tax_rate?: number;
          timezone?: string;
        };
      };
      members: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          gender?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          zip_code?: string;
          date_of_birth?: string;
          avatar?: string;
          goal?: string;
          occupation?: string;
          blood_group?: string;
          id_type?: string;
          id_number?: string;
          trainer_id?: string;
          membership_id?: string;
          membership_status: string;
          membership_start_date?: string;
          membership_end_date?: string;
          status: string;
          branch_id: string;
          created_at: string;
          updated_at?: string;
        };
      };
      // Add other table types as needed for development reference
    };
  };
}
