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

export const validateImportData = async (data: any) => {
  // Basic validation of imported data structure
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }
  return true;
};

export const importData = async (data: any[]) => {
  // Implementation of data import
  // This is a placeholder - implement actual import logic
  return {
    success: true,
    count: data.length
  };
};

export const logBackupActivity = async (entry: Omit<BackupLogEntry, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from('backup_logs')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
};
