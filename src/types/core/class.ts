
// Class and schedule types
export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ClassDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlist';

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  difficulty: ClassDifficulty;
  level?: string;
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
  branch_id?: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  location: string;
  difficulty: ClassDifficulty;
  status: ClassStatus;
  recurring: boolean;
  recurring_pattern?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassBooking {
  id: string;
  class_id: string;
  member_id: string;
  status: BookingStatus;
  attended: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClassInput {
  name: string;
  type: string;
  description?: string;
  trainer_id: string;
  branch_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  location: string;
  difficulty: ClassDifficulty;
  recurring?: boolean;
  recurring_pattern?: string;
}
