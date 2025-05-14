
export type UserRole = 'admin' | 'manager' | 'trainer' | 'staff' | 'member';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  branch_id?: string;
}

export interface Trainer extends User {
  role: 'trainer';
  specialization: string;
  bio?: string;
  available_slots?: { day: string; slots: string[] }[];
}

export interface Staff extends User {
  role: 'staff';
  position: string;
  department?: string;
}

export interface Admin extends User {
  role: 'admin';
  is_super_admin?: boolean;
}
