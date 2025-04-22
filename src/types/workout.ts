
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  notes?: string;
  restTime?: string;  // Added this property
  videoUrl?: string;
  imageUrl?: string;
  muscleGroupTag?: string;
  mediaUrl?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;  // Added this property
  dayLabel?: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;  // Ensure this property exists
  description?: string;  // Ensure this property exists
  trainerId: string;
  workoutDays: WorkoutDay[];
  targetGoals?: string[];  // Ensure this property exists
  difficulty: 'beginner' | 'intermediate' | 'advanced';  // Ensure this property exists
  isGlobal: boolean;  // Ensure this property exists
  createdAt: string;
  updatedAt: string;
  memberId?: string;
  createdBy?: string;
  days?: WorkoutDay[];
  isCommon?: boolean;
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
