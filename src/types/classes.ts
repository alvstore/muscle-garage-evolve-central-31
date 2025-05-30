// Class types (alias for compatibility)
export * from './class';
export type { ClassType, Class, ClassBooking, ClassSchedule } from './class';

// Add adapter function for class types
export const adaptClassTypeFromDB = (data: any): ClassType => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    level: data.level,
    difficulty: data.difficulty,
    branch_id: data.branch_id,
    is_active: data.is_active,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
