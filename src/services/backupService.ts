
import { supabase } from "@/services/supabaseClient";
import { BackupLogEntry } from '@/types/backup';
import { toast } from 'sonner';

// Function to create a backup log entry
const createBackupLog = async (logData: Omit<BackupLogEntry, 'id' | 'timestamp' | 'created_at' | 'updated_at'>) => {
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
    return { data: data as BackupLogEntry[], error: null };

  } catch (error) {
    console.error("Error fetching backup logs:", error);
    return { data: null, error };
  }
};

// Valid table names - to ensure type safety
const validTables = [
  'members', 'announcements', 'branches', 'backup_logs', 
  'body_measurements', 'class_bookings', 'classes',
  'class_schedules', 'diet_plans', 'email_settings',
  'exercises', 'expense_categories', 'feedback',
  'global_settings', 'income_categories', 'inventory_items',
  'invoices', 'meal_items', 'meal_plans',
  'measurements', 'member_attendance', 'member_memberships',
  'member_progress', 'memberships', 'motivational_messages',
  'orders', 'payment_gateway_settings', 'payment_settings',
  'payments', 'profiles', 'promo_codes',
  'referrals', 'reminder_rules', 'staff_attendance',
  'store_products', 'trainer_assignments', 'transactions',
  'webhook_logs', 'workout_days', 'workout_plans'
] as const;

type ValidTable = typeof validTables[number];

// Function to export data from a specific table
const exportTableData = async (tableName: ValidTable) => {
  try {
    // Use validated table name to ensure type safety
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
  tableName: ValidTable, 
  tableData: any[], 
  options?: { upsert?: boolean }
) => {
  try {
    const { data, error } = options?.upsert 
      ? await supabase.from(tableName).upsert(tableData)
      : await supabase.from(tableName).insert(tableData);

    if (error) throw error;
    return data;

  } catch (error) {
    console.error(`Error importing data into ${tableName}:`, error);
    throw error;
  }
};

// Function to create a full backup
const createFullBackup = async (
  userId: string, 
  userName: string, 
  includeModules: ValidTable[]
) => {
  const exportedData: Record<string, any[]> = {};
  let totalRecords = 0;
  let successCount = 0;
  let failedCount = 0;
  let success = true;

  try {
    for (const module of includeModules) {
      try {
        const tableData = await exportTableData(module);
        exportedData[module] = tableData;
        totalRecords += tableData.length;
        successCount += tableData.length;
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
  const modules = Object.keys(backupData) as ValidTable[];
  let totalRecords = 0;
  let successCount = 0;
  let failedCount = 0;

  try {
    for (const module of modules) {
      try {
        const tableData = backupData[module];
        totalRecords += tableData.length;
        
        if (tableData.length > 0) {
          await importTableData(module, tableData, options);
          successCount += tableData.length;
        }
      } catch (error) {
        failedCount += backupData[module].length;
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

// Export all functions
const backupService = {
  createBackupLog,
  getBackupLogs,
  exportTableData,
  importTableData,
  createFullBackup,
  restoreFromBackup
};

export default backupService;
