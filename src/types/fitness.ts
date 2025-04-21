
export interface BodyMeasurement {
  id?: string;
  memberId: string;
  measurementDate: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  recordedBy?: string;
  recordedByName?: string;
  branchId?: string;
  createdAt?: string;
}

export interface FitnessPlan {
  id: string;
  name: string;
  description?: string;
  type: 'workout' | 'diet';
  createdBy: string;
  createdByName?: string;
  isTemplate: boolean;
  memberId?: string;
  memberName?: string;
  startDate?: string;
  endDate?: string;
  days: FitnessPlanDay[];
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'completed' | 'draft';
  branchId?: string;
}

export interface FitnessPlanDay {
  id: string;
  planId: string;
  dayNumber: number;
  title: string;
  description?: string;
  items: FitnessPlanItem[];
}

export interface FitnessPlanItem {
  id: string;
  dayId: string;
  type: 'exercise' | 'meal';
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  imageUrl?: string;
  videoUrl?: string;
  notes?: string;
  sortOrder: number;
}

export interface Progress {
  id: string;
  memberId: string;
  date: string;
  type: 'weight' | 'workout' | 'diet' | 'measurement';
  value: number;
  notes?: string;
  recordedBy?: string;
}
