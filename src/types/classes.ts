
export interface ClassType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  // Optional camelCase aliases for UI compatibility
  isActive?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  description?: string;
  trainer_id: string;
  branch_id?: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled?: number;
  location: string;
  recurring: boolean;
  recurring_pattern?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClassBooking {
  id: string;
  class_id: string;
  member_id: string;
  status: 'confirmed' | 'cancelled' | 'waitlisted';
  attended: boolean;
  created_at?: string;
  updated_at?: string;
}

export function adaptClassTypeFromDB(dbClassType: any): ClassType {
  return {
    id: dbClassType.id,
    name: dbClassType.name,
    description: dbClassType.description,
    is_active: dbClassType.is_active,
    branch_id: dbClassType.branch_id,
    created_at: dbClassType.created_at,
    updated_at: dbClassType.updated_at,
    // Add camelCase aliases
    isActive: dbClassType.is_active,
    branchId: dbClassType.branch_id,
    createdAt: dbClassType.created_at,
    updatedAt: dbClassType.updated_at,
  };
}
