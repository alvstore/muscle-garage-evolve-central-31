
export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type ClassDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  level?: string;
  difficulty?: ClassDifficulty;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  type?: string;
  trainer_id?: string;
  trainer?: string;
  capacity: number;
  enrolled?: number;
  start_time: string;
  end_time: string;
  location?: string;
  status?: ClassStatus;
  recurrence?: string;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassBooking {
  id: string;
  class_id: string;
  member_id: string;
  status: 'confirmed' | 'cancelled' | 'waitlist';
  attended?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressMetrics {
  weight?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  date: string;
}

// For backward compatibility
export type { ClassType as adaptClassTypeFromDB };
