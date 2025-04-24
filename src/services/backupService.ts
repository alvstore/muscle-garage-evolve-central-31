
import { BackupLogEntry } from '@/types/notification';
import { supabase } from './supabaseClient';

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

    // Map database fields to BackupLogEntry type
    return (data || []).map(item => ({
      id: item.id,
      action: item.action as 'export' | 'import',
      userId: item.user_id,
      userName: item.user_name,
      timestamp: item.timestamp,
      modules: item.modules || [],
      success: item.success,
      totalRecords: item.total_records,
      successCount: item.success_count,
      failedCount: item.failed_count
    }));
  } catch (error) {
    console.error('Failed to fetch backup logs:', error);
    return [];
  }
}

/**
 * Creates a new backup record
 */
export const createBackupLog = async (backupData: Omit<BackupLogEntry, 'id'>): Promise<BackupLogEntry | null> => {
  try {
    // Map BackupLogEntry to database schema
    const { data, error } = await supabase
      .from('backup_logs')
      .insert({
        action: backupData.action,
        user_id: backupData.userId,
        user_name: backupData.userName,
        timestamp: backupData.timestamp,
        modules: backupData.modules,
        success: backupData.success,
        total_records: backupData.totalRecords,
        success_count: backupData.successCount,
        failed_count: backupData.failedCount
      })
      .select()
      .single();
    
    if (error) throw error;

    // Map response back to BackupLogEntry type
    return {
      id: data.id,
      action: data.action,
      userId: data.user_id,
      userName: data.user_name,
      timestamp: data.timestamp,
      modules: data.modules || [],
      success: data.success,
      totalRecords: data.total_records,
      successCount: data.success_count,
      failedCount: data.failed_count
    };
  } catch (error) {
    console.error('Failed to create backup log:', error);
    return null;
  }
}
