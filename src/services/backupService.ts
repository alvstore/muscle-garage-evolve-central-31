
import { supabase } from "@/services/supabaseClient";
import { BackupLogEntry } from '@/types/backup';

// Function to create a backup log entry
const createBackupLog = async (logData: Omit<BackupLogEntry, 'id' | 'timestamp'>) => {
  try {
    const { data, error } = await supabase
      .from('backup_logs')
      .insert({
        action: logData.action,
        user_id: logData.user_id,
        user_name: logData.user_name,
        modules: logData.modules,
        success: logData.success,
        total_records: logData.total_records,
        success_count: logData.success_count,
        failed_count: logData.failed_count
      })
      .select();

    if (error) throw error;
    return data[0] as BackupLogEntry;

  } catch (error) {
    console.error("Error creating backup log:", error);
    throw error;
  }
};

// Function to get backup logs
const getBackupLogs = async (filters?: {
  action?: 'backup' | 'restore';
  startDate?: string;
  endDate?: string;
  success?: boolean;
}) => {
  try {
    let query = supabase
      .from('backup_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (filters) {
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.success !== undefined) {
        query = query.eq('success', filters.success);
      }

      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as BackupLogEntry[];

  } catch (error) {
    console.error("Error fetching backup logs:", error);
    throw error;
  }
};

// Function to export data from a specific table
const exportTableData = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) throw error;
    return data;

  } catch (error) {
    console.error(`Error exporting data from ${tableName}:`, error);
    throw error;
  }
};

// Function to import data into a specific table
const importTableData = async (
  tableName: string, 
  data: any[], 
  options?: { upsert?: boolean }
) => {
  try {
    const { data: result, error } = options?.upsert 
      ? await supabase.from(tableName).upsert(data)
      : await supabase.from(tableName).insert(data);

    if (error) throw error;
    return result;

  } catch (error) {
    console.error(`Error importing data into ${tableName}:`, error);
    throw error;
  }
};

// Function to create a full backup
const createFullBackup = async (
  userId: string, 
  userName: string, 
  includeModules: string[]
) => {
  const exportedData: Record<string, any[]> = {};
  let totalRecords = 0;
  let successCount = 0;
  let failedCount = 0;
  let success = true;

  try {
    for (const module of includeModules) {
      try {
        const data = await exportTableData(module);
        exportedData[module] = data;
        totalRecords += data.length;
        successCount += data.length;
      } catch (error) {
        failedCount += 1;
        console.error(`Failed to export ${module}:`, error);
      }
    }

    // Create backup log
    await createBackupLog({
      action: 'backup',
      user_id: userId,
      user_name: userName,
      modules: includeModules,
      success: failedCount === 0,
      total_records: totalRecords,
      success_count: successCount,
      failed_count: failedCount
    });

    return { 
      success: true,
      data: exportedData, 
      totalRecords,
      successCount,
      failedCount
    };
  } catch (error) {
    console.error("Error creating full backup:", error);
    
    // Log the failure
    await createBackupLog({
      action: 'backup',
      user_id: userId,
      user_name: userName,
      modules: includeModules,
      success: false,
      total_records: totalRecords,
      success_count: successCount,
      failed_count: failedCount
    });
    
    return { 
      success: false, 
      error: error, 
      totalRecords,
      successCount,
      failedCount
    };
  }
};

// Function to restore from a backup
const restoreFromBackup = async (
  backupData: Record<string, any[]>,
  userId: string,
  userName: string,
  options?: { upsert?: boolean }
) => {
  const modules = Object.keys(backupData);
  let totalRecords = 0;
  let successCount = 0;
  let failedCount = 0;

  try {
    for (const module of modules) {
      try {
        const data = backupData[module];
        totalRecords += data.length;
        
        if (data.length > 0) {
          await importTableData(module, data, options);
          successCount += data.length;
        }
      } catch (error) {
        failedCount += data.length;
        console.error(`Failed to import ${module}:`, error);
      }
    }

    // Create restore log
    await createBackupLog({
      action: 'restore',
      user_id: userId,
      user_name: userName,
      modules,
      success: failedCount === 0,
      total_records: totalRecords,
      success_count: successCount,
      failed_count: failedCount
    });

    return { 
      success: true, 
      totalRecords,
      successCount,
      failedCount
    };
  } catch (error) {
    console.error("Error restoring from backup:", error);
    
    // Log the failure
    await createBackupLog({
      action: 'restore',
      user_id: userId,
      user_name: userName,
      modules,
      success: false,
      total_records: totalRecords,
      success_count: successCount,
      failed_count: failedCount
    });
    
    return { 
      success: false, 
      error, 
      totalRecords,
      successCount,
      failedCount
    };
  }
};

export const backupService = {
  createBackupLog,
  getBackupLogs,
  exportTableData,
  importTableData,
  createFullBackup,
  restoreFromBackup
};

export default backupService;
