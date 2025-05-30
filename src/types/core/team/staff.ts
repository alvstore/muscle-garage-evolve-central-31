
// Staff management types
export interface Staff {
  id: string;
  user_id: string;
  branch_id: string;
  employee_id?: string;
  department?: string;
  position?: string;
  salary?: number;
  hire_date?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    account_holder_name: string;
  };
  is_active: boolean;
  is_branch_manager?: boolean;
  permissions?: string[];
  created_at: string;
  updated_at: string;
  // From joined user data
  full_name?: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface CreateStaffInput {
  user_id: string;
  branch_id: string;
  employee_id?: string;
  department?: string;
  position?: string;
  salary?: number;
  hire_date?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    account_holder_name: string;
  };
  is_active?: boolean;
  is_branch_manager?: boolean;
  permissions?: string[];
}

export interface UpdateStaffInput extends Partial<CreateStaffInput> {}
