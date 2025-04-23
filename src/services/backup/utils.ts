
import { ImportType } from './types';

export const formatDates = (data: any[]) => {
  return data.map(item => {
    const formatted: any = { ...item };
    Object.keys(formatted).forEach(key => {
      if (formatted[key] instanceof Date) {
        formatted[key] = formatted[key].toISOString();
      }
    });
    return formatted;
  });
};

export const validateRequiredFields = (data: any[], requiredFields: string[]) => {
  if (data.length === 0) return false;
  const firstRow = data[0];
  return requiredFields.every(field => Object.keys(firstRow).includes(field));
};

export const validateImportData = (type: ImportType, data: any[]) => {
  try {
    switch(type) {
      case 'members':
        if (!validateRequiredFields(data, ['full_name', 'email'])) {
          return { success: false, message: 'Missing required fields: full_name, email' };
        }
        break;
      case 'staff':
      case 'trainers':
        if (!validateRequiredFields(data, ['full_name', 'email', 'role'])) {
          return { success: false, message: 'Missing required fields: full_name, email, role' };
        }
        break;
      case 'workout_plans':
      case 'diet_plans':
        if (!validateRequiredFields(data, ['name', 'trainer_id'])) {
          return { success: false, message: 'Missing required fields: name, trainer_id' };
        }
        break;
      case 'crm_leads':
        if (!validateRequiredFields(data, ['name', 'status'])) {
          return { success: false, message: 'Missing required fields: name, status' };
        }
        break;
      case 'inventory':
        if (!validateRequiredFields(data, ['name', 'quantity', 'price'])) {
          return { success: false, message: 'Missing required fields: name, quantity, price' };
        }
        break;
      default:
        return { success: false, message: `Unknown import type: ${type}` };
    }
    return { success: true, message: 'Validation successful' };
  } catch (error) {
    return { success: false, message: (error as Error).message || 'Validation failed' };
  }
};
