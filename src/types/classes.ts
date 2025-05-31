// Re-export all types from class.ts
export * from './class';

// Import ClassType for the adapter function
import type { ClassType } from './class';

/**
 * Adapts a class type from database format to application format
 * @param data Raw class type data from database
 * @returns Formatted ClassType object
 */
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
