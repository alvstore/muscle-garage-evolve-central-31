
import { supabase } from '@/integrations/supabase/client';

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

export const measurementService = {
  async getMeasurementHistory(memberId: string): Promise<BodyMeasurement[]> {
    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .select('*')
        .eq('member_id', memberId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching measurement history:", error);
      throw error;
    }
  },
  
  async saveMeasurement(measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> {
    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .insert({
          member_id: measurement.memberId,
          date: measurement.date,
          weight: measurement.weight,
          body_fat_percentage: measurement.body_fat_percentage,
          muscle_mass: measurement.bmi, // Assuming BMI is stored as muscle_mass for now
          workout_completion: 0, // Default value
          diet_adherence: 0, // Default value
          notes: measurement.notes,
          created_by: measurement.addedBy?.id,
          branch_id: measurement.branch_id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as unknown as BodyMeasurement;
    } catch (error) {
      console.error("Error saving measurement:", error);
      throw error;
    }
  }
};
