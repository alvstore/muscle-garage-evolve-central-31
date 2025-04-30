
export const PROGRESS_TIMEFRAMES = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "All Time", value: "all" }
];

export interface BodyMeasurement {
  id?: string;
  memberId: string;
  date: string;
  weight?: number;
  height?: number;
  bmi?: number;
  body_fat_percentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  recorded_by?: string;
  branch_id?: string;
  addedBy?: {
    id: string;
    role: string;
    name: string;
  };
}

export interface PTPlan {
  id: string;
  trainerId: string;
  memberId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  name: string;
  description?: string;
}
