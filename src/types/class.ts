
// Class and scheduling types
export interface Class {
  id: string;
  name: string;
  type?: string;
  description?: string;
  trainer_id?: string;
  trainer?: string;
  location?: string;
  capacity: number;
  enrolled: number;
  start_time: string;
  end_time: string;
  recurrence?: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'in_progress';
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  type: string;
  description?: string;
  trainer_id: string;
  location: string;
  difficulty: string;
  capacity: number;
  enrolled: number;
  start_time: string;
  end_time: string;
  recurring: boolean;
  recurring_pattern?: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'in_progress';
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassBooking {
  id: string;
  class_id: string;
  member_id: string;
  status: 'confirmed' | 'cancelled' | 'waitlist';
  attended: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  level?: string;
  difficulty?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassFormData {
  name: string;
  type: string;
  description?: string;
  trainer_id: string;
  location: string;
  difficulty: string;
  capacity: number;
  start_time: string;
  end_time: string;
  recurring: boolean;
  recurring_pattern?: string;
  branch_id?: string;
}
