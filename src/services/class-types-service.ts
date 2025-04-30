
import { supabase } from '@/integrations/supabase/client';
import { ClassType } from '@/types/classes';

export const classTypesService = {
  // Fetch class types from the database
  async fetchClassTypes(): Promise<ClassType[]> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching class types:", error);
      throw error;
    }
  },

  // Create a class type
  async createClassType(classType: Partial<ClassType>): Promise<ClassType> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .insert({
          name: classType.name,
          description: classType.description,
          is_active: classType.is_active,
          branch_id: classType.branch_id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error creating class type:", error);
      throw error;
    }
  },

  // Update a class type
  async updateClassType(id: string, updates: Partial<ClassType>): Promise<ClassType> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .update({
          name: updates.name,
          description: updates.description,
          is_active: updates.is_active
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error updating class type:", error);
      throw error;
    }
  },

  // Delete a class type
  async deleteClassType(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting class type:", error);
      throw error;
    }
  }
};
