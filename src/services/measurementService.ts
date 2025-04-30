
import { supabase } from '@/integrations/supabase/client';
import { BodyMeasurement, PTPlan } from '@/types/measurements';

export const measurementService = {
  async getMeasurementHistory(memberId: string): Promise<BodyMeasurement[]> {
    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .select('*')
        .eq('member_id', memberId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        memberId: item.member_id,
        date: item.date,
        weight: item.weight,
        body_fat_percentage: item.body_fat_percentage,
        bmi: item.muscle_mass, // Using muscle_mass field as bmi for now
        notes: item.notes,
        branch_id: item.branch_id,
        recorded_by: item.created_by
      })) || [];
    } catch (error) {
      console.error("Error fetching measurement history:", error);
      throw error;
    }
  },

  async getAllMeasurements(memberId: string): Promise<BodyMeasurement[]> {
    // This is just an alias for getMeasurementHistory to match our hook
    return this.getMeasurementHistory(memberId);
  },
  
  async saveMeasurement(measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> {
    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .insert({
          member_id: measurement.memberId,
          date: measurement.date,
          weight: measurement.weight ? Number(measurement.weight) : null,
          body_fat_percentage: measurement.body_fat_percentage ? Number(measurement.body_fat_percentage) : null,
          muscle_mass: measurement.bmi ? Number(measurement.bmi) : null, // Using muscle_mass field as bmi for now
          workout_completion: 0, // Default value
          diet_adherence: 0, // Default value
          notes: measurement.notes,
          created_by: measurement.addedBy?.id,
          branch_id: measurement.branch_id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        memberId: data.member_id,
        date: data.date,
        weight: data.weight,
        body_fat_percentage: data.body_fat_percentage,
        bmi: data.muscle_mass,
        notes: data.notes,
        branch_id: data.branch_id,
        recorded_by: data.created_by
      };
    } catch (error) {
      console.error("Error saving measurement:", error);
      throw error;
    }
  },

  async updateMeasurement(id: string, measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> {
    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .update({
          member_id: measurement.memberId,
          date: measurement.date,
          weight: measurement.weight ? Number(measurement.weight) : null,
          body_fat_percentage: measurement.body_fat_percentage ? Number(measurement.body_fat_percentage) : null,
          muscle_mass: measurement.bmi ? Number(measurement.bmi) : null,
          notes: measurement.notes,
          branch_id: measurement.branch_id
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        memberId: data.member_id,
        date: data.date,
        weight: data.weight,
        body_fat_percentage: data.body_fat_percentage,
        bmi: data.muscle_mass,
        notes: data.notes,
        branch_id: data.branch_id,
        recorded_by: data.created_by
      };
    } catch (error) {
      console.error("Error updating measurement:", error);
      throw error;
    }
  },

  async deleteMeasurement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('fitness_progress')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting measurement:", error);
      throw error;
    }
  },

  async getActivePTPlan(memberId: string): Promise<PTPlan | null> {
    try {
      // Assuming we have a PT plan table, if not this will need to be created
      const { data, error } = await supabase
        .from('trainer_assignments')
        .select('*, trainers:trainer_id(name)')
        .eq('member_id', memberId)
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // Code for no rows returned
          return null;
        }
        throw error;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        trainerId: data.trainer_id,
        memberId: data.member_id,
        startDate: data.start_date,
        endDate: data.end_date || '',
        isActive: data.is_active,
        name: data.trainers?.name || 'Personal Training Plan',
        description: 'Active training plan'
      };
    } catch (error) {
      console.error("Error fetching active PT plan:", error);
      // Return null instead of throwing to make the hook more resilient
      return null;
    }
  }
};
