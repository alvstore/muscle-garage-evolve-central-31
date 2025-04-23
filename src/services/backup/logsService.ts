
import { supabase } from '@/services/supabaseClient';
import { ExportType, ImportType, BackupLogEntry } from './types';

export const logsService = {
  async logBackupAction(
    action: 'export' | 'import',
    type: ExportType | ImportType,
    status: 'success' | 'failure' | 'partial',
    details: any
  ) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        console.error('User not found for logging backup action');
        return;
      }
      
      const logEntry = {
        user_id: userData.user.id,
        action,
        type,
        timestamp: new Date().toISOString(),
        details,
        status
      };
      
      const { error } = await supabase
        .from('backup_logs')
        .insert([logEntry]);
      
      if (error) {
        console.error('Failed to log backup action:', error);
      }
    } catch (error) {
      console.error('Error logging backup action:', error);
    }
  },

  async getBackupLogs(): Promise<BackupLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching backup logs:', error);
      return [];
    }
  }
};
