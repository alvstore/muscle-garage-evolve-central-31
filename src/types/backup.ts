
export interface BackupLogEntry {
  id: string;
  action: 'backup' | 'restore';
  user_id?: string;
  user_name?: string;
  modules: string[];
  timestamp: string;
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
}
