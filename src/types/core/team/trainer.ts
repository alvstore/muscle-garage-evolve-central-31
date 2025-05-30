
// Trainer management types
export type TrainerSpecialization = 'strength' | 'cardio' | 'yoga' | 'pilates' | 'crossfit' | 'martial_arts' | 'dance' | 'nutrition';

export interface Trainer {
  id: string;
  profile_id: string;
  branch_id?: string;
  specializations?: TrainerSpecialization[];
  experience_years?: number;
  certifications?: string[];
  bio?: string;
  hourly_rate?: number;
  rating_average?: number;
  rating_count?: number;
  is_active: boolean;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  created_at: string;
  updated_at: string;
  // From joined profile data
  profile?: {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface TrainerDocument {
  id: string;
  trainer_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainerSchedule {
  id: string;
  trainer_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainerInput {
  profile_id: string;
  branch_id?: string;
  specializations?: TrainerSpecialization[];
  experience_years?: number;
  certifications?: string[];
  bio?: string;
  hourly_rate?: number;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface UpdateTrainerInput extends Partial<CreateTrainerInput> {
  is_active?: boolean;
}
