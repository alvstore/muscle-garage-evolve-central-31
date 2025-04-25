
import { supabase } from '@/integrations/supabase/client';
import { ClassType, adaptClassTypeFromDB } from '@/types/classes';

// Mock data for class types since this table doesn't exist in the database yet
const mockClassTypes: ClassType[] = [
  {
    id: "1",
    name: "Yoga",
    description: "Traditional yoga classes focusing on balance, flexibility, and mental well-being",
    is_active: true,
    branch_id: "branch-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "HIIT",
    description: "High Intensity Interval Training to build strength and burn calories",
    is_active: true,
    branch_id: "branch-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Pilates",
    description: "Core strengthening and stability exercises",
    is_active: true,
    branch_id: "branch-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const classTypesService = {
  // Simulates fetching class types
  async fetchClassTypes(): Promise<ClassType[]> {
    // In a real implementation, we would fetch from the database
    // For now, we're returning mock data
    return mockClassTypes;
  },

  // Simulates creating a class type
  async createClassType(classType: Partial<ClassType>): Promise<ClassType> {
    const newClassType: ClassType = {
      id: Date.now().toString(),
      name: classType.name || '',
      description: classType.description,
      is_active: classType.is_active !== undefined ? classType.is_active : true,
      branch_id: classType.branch_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real implementation, we would save to the database
    return newClassType;
  },

  // Simulates updating a class type
  async updateClassType(id: string, updates: Partial<ClassType>): Promise<ClassType> {
    // In a real implementation, we would update in the database
    const updatedClassType: ClassType = {
      id,
      name: updates.name || '',
      description: updates.description,
      is_active: updates.is_active !== undefined ? updates.is_active : true,
      branch_id: updates.branch_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return updatedClassType;
  },

  // Simulates deleting a class type
  async deleteClassType(id: string): Promise<void> {
    // In a real implementation, we would delete from the database
    console.log(`Class type ${id} deleted (simulated)`);
  }
};
