
export interface BodyMeasurement {
  id: string;
  member_id: string;
  measurement_date: string;
  height?: number;
  weight?: number;
  bmi?: number;
  body_fat_percentage?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  hips?: number;
  thighs?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  branch_id?: string;
  recorded_by?: string;
}

export interface MeasurementFormData {
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  hips?: number;
  thighs?: number;
  body_fat_percentage?: number;
  notes?: string;
}
