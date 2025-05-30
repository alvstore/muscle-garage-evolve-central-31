
// Backup and restore types
export interface BackupLogEntry {
  id: string;
  action: 'export' | 'import' | 'backup' | 'restore';
  user_id?: string;
  user_name?: string;
  timestamp: string;
  modules: string[];
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BackupModule {
  name: string;
  label: string;
  description: string;
  table: string;
  dependencies?: string[];
  enabled: boolean;
}

export interface ExportOptions {
  modules: string[];
  format: 'json' | 'csv' | 'sql';
  dateRange?: {
    start: string;
    end: string;
  };
  includeMedia?: boolean;
}

export interface ImportOptions {
  file: File;
  module: string;
  format: 'json' | 'csv' | 'sql';
  overwrite: boolean;
  validateData?: boolean;
}

export interface BackupStatus {
  inProgress: boolean;
  currentModule?: string;
  progress: number;
  estimatedTime?: number;
  error?: string;
}
