
export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: 'staff';
  phone?: string;
  position?: string;
  department?: string;
  branchId?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  branchId?: string;
}
