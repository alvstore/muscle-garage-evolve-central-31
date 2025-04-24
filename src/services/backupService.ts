
import { BackupLogEntry } from '@/types/notification';
import { supabase } from '@/services/supabaseClient';

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
