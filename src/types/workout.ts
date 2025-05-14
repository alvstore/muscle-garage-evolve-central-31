
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest_time?: number;
  notes?: string;
  video_url?: string;
  image_url?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  day_number: number;
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  member_id?: string;
  days: WorkoutDay[];
  is_template: boolean;
  created_at: string;
  updated_at: string;
}
