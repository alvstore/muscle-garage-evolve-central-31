
import { supabase } from './supabaseClient';
import { BackupLogEntry } from '@/types/notification';

/**
 * Retrieves backup logs from the database
 */
export const getBackupLogs = async (): Promise<BackupLogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('backup_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []) as BackupLogEntry[];
  } catch (error) {
    console.error('Failed to fetch backup logs:', error);
    return [];
  }
}

/**
 * Creates a new backup record
 */
export const createBackupLog = async (backupData: Omit<BackupLogEntry, 'id' | 'created_at' | 'updated_at'>): Promise<BackupLogEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('backup_logs')
      .insert([backupData])
      .select()
      .single();
    
    if (error) throw error;
    return data as BackupLogEntry;
  } catch (error) {
    console.error('Failed to create backup log:', error);
    return null;
  }
}

/**
 * Validates imported data structure
 * @param data Data to validate
 * @returns Object containing validation result
 */
export const validateImportData = async (data: any): Promise<boolean> => {
  try {
    // Basic validation of imported data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format: Expected an object');
    }
    
    // Check if data contains at least one valid module
    const validModules = ['members', 'classes', 'trainers', 'announcements', 'reminder_rules', 'motivational_messages', 'feedback'];
    const hasValidModule = Object.keys(data).some(key => validModules.includes(key));
    
    if (!hasValidModule) {
      throw new Error('No valid modules found in import data');
    }
    
    // Check if each module contains an array
    Object.entries(data).forEach(([module, records]) => {
      if (!Array.isArray(records)) {
        throw new Error(`Module "${module}" should contain an array of records`);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};

/**
 * Imports data into the database
 * @param data Data to import
 * @returns Object with success status and count of imported records
 */
export const importData = async (data: any): Promise<{ success: boolean; count: number }> => {
  try {
    // Validate data first
    await validateImportData(data);
    
    let totalCount = 0;
    
    // Process each module
    for (const [module, records] of Object.entries(data)) {
      if (Array.isArray(records) && records.length > 0) {
        // Insert records into database
        const { error } = await supabase
          .from(module as any)
          .insert(records);
          
        if (error) {
          console.error(`Error importing ${module}:`, error);
          throw error;
        }
        
        totalCount += records.length;
      }
    }
    
    return {
      success: true,
      count: totalCount
    };
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

/**
 * Logs backup activity in the database
 * @param entry Backup log entry
 * @returns Created backup log entry
 */
export const logBackupActivity = async (entry: Omit<BackupLogEntry, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from('backup_logs')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
};
