export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  avatar?: string;
  branch_id?: string;
  
  // Add these properties to match usage in EditStaffForm
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  gender?: string;
  is_branch_manager?: boolean;
}

export interface FileOptions {
  // Add onUploadProgress for backward compatibility
  onUploadProgress?: (progress: number) => void;
}
