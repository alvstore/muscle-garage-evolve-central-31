
import { supabase } from '@/integrations/supabase/client';
import { ClassType, adaptClassTypeFromDB } from '@/types/classes';
import { toast } from 'sonner';

export const classTypesService = {
  // Fetch all class types from Supabase, filtered by branch ID if provided
  async fetchClassTypes(branchId?: string): Promise<ClassType[]> {
    try {
      let query = supabase
        .from('class_types')
        .select('*')
        .order('name', { ascending: true });
        
      // Filter by branch ID if provided
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching class types:', error);
        throw new Error(error.message);
      }

      return data.map(adaptClassTypeFromDB) || [];
    } catch (error: any) {
      console.error('Error in fetchClassTypes:', error);
      toast.error(`Failed to fetch class types: ${error.message}`);
      return [];
    }
  },

  // Create a new class type in Supabase
  async createClassType(classType: Partial<ClassType>): Promise<ClassType> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .insert({
          name: classType.name,
          description: classType.description,
          is_active: classType.is_active !== undefined ? classType.is_active : true,
          level: classType.level || 'all',
          difficulty: classType.difficulty || 'all',
          branch_id: classType.branch_id,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating class type:', error);
        throw new Error(error.message);
      }

      return adaptClassTypeFromDB(data);
    } catch (error: any) {
      console.error('Error in createClassType:', error);
      toast.error(`Failed to create class type: ${error.message}`);
      throw error;
    }
  },

  // Update an existing class type in Supabase
  async updateClassType(id: string, updates: Partial<ClassType>): Promise<ClassType> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .update({
          name: updates.name,
          description: updates.description,
          is_active: updates.is_active,
          level: updates.level,
          difficulty: updates.difficulty,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating class type:', error);
        throw new Error(error.message);
      }

      return adaptClassTypeFromDB(data);
    } catch (error: any) {
      console.error('Error in updateClassType:', error);
      toast.error(`Failed to update class type: ${error.message}`);
      throw error;
    }
  },

  // Delete a class type from Supabase
  async deleteClassType(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting class type:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error in deleteClassType:', error);
      toast.error(`Failed to delete class type: ${error.message}`);
      throw error;
    }
  },

  // Fetch a single class type by ID
  async getClassTypeById(id: string): Promise<ClassType | null> {
    try {
      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found error
          return null;
        }
        console.error('Error fetching class type:', error);
        throw new Error(error.message);
      }

      return adaptClassTypeFromDB(data);
    } catch (error: any) {
      console.error('Error in getClassTypeById:', error);
      toast.error(`Failed to fetch class type: ${error.message}`);
      return null;
    }
  }
};
