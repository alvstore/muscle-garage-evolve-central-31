
// Types for body measurements and progress tracking

export interface BodyMeasurement {
  id: string;
  memberId: string;
  date: string;
  height?: number; // cm
  weight?: number; // kg
  bmi?: number; // auto-calculated
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  biceps?: number; // cm
  thighs?: number; // cm
  bodyFat?: number; // percentage
  addedBy: {
    id: string;
    role: "admin" | "staff" | "trainer" | "member";
    name: string;
  };
  notes?: string;
}

export interface PTPlan {
  id: string;
  memberId: string;
  trainerId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ProgressTimeframe {
  value: "7days" | "30days" | "3months" | "6months" | "1year" | "all";
  label: string;
}

export const PROGRESS_TIMEFRAMES: ProgressTimeframe[] = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last Year" },
  { value: "all", label: "All Time" }
];
