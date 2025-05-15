
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  trainerId?: string; // For backward compatibility
  member_id?: string;
  memberId?: string; // For backward compatibility
  is_custom?: boolean;
  isCustom?: boolean; // For backward compatibility
  is_global?: boolean;
  isGlobal?: boolean; // For backward compatibility
  difficulty?: string;
  created_at?: string;
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  updatedAt?: string; // For backward compatibility
  notes?: string;
  target_goals?: string[]; // For compatibility with WorkoutPlanForm
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  workout_plan_id: string;
  day_label?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  workout_day_id: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  rest_time?: string;
  notes?: string;
  muscle_group_tag?: string;
  media_url?: string;
  created_at?: string;
  updated_at?: string;
}
