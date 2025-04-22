
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  notes?: string;
  restTime?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  workoutDays: WorkoutDay[];
  targetGoals?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
  memberId?: string;
}

export interface WorkoutAssignment {
  id: string;
  planId: string;
  memberId: string;
  trainerId: string;
  assignedAt: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}
