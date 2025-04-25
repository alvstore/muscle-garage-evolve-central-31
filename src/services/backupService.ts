
import { supabase } from '@/services/supabaseClient';
import { formatISO } from 'date-fns';
import { BackupLogEntry } from '@/types/notification';

export const getBackupLogs = async (): Promise<BackupLogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('backup_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data as BackupLogEntry[];
  } catch (error) {
    console.error('Error fetching backup logs:', error);
    throw error;
  }
};

export const exportData = async (modules: string[], userId: string, userName: string): Promise<{ url: string, success: boolean }> => {
  try {
    const exportData: Record<string, any[]> = {};
    
    for (const module of modules) {
      // Fetch the data for each module
      const { data, error } = await supabase
        .from(module)
        .select('*');
        
      if (error) {
        console.error(`Error exporting ${module}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        exportData[module] = data;
      }
    }
    
    // Log the export activity
    const logEntry = {
      action: 'export',
      user_id: userId,
      user_name: userName,
      timestamp: formatISO(new Date()),
      modules,
      success: Object.keys(exportData).length > 0,
      total_records: Object.values(exportData).flat().length
    };
    
    await supabase.from('backup_logs').insert([logEntry]);
    
    // Convert to JSON string
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create URL for download
    const url = URL.createObjectURL(blob);
    
    return { url, success: true };
  } catch (error) {
    console.error('Export failed:', error);
    return { url: '', success: false };
  }
};

export const importData = async (fileContent: string, userId: string, userName: string): Promise<{ success: boolean, message: string }> => {
  try {
    let data: Record<string, any[]>;
    
    try {
      data = JSON.parse(fileContent);
    } catch (error) {
      throw new Error("Invalid JSON file");
    }
    
    const modules = Object.keys(data);
    if (modules.length === 0) {
      throw new Error("No data found in the file");
    }
    
    // Process each module
    let totalRecords = 0;
    let successCount = 0;
    
    for (const module of modules) {
      const records = data[module];
      if (!Array.isArray(records) || records.length === 0) continue;
      
      totalRecords += records.length;
      
      // Remove ids to let the database generate new ones
      const preparedRecords = records.map(record => {
        const { id, ...rest } = record;
        return {
          ...rest,
          imported_at: new Date().toISOString()
        };
      });
      
      const { data: insertedData, error } = await supabase
        .from(module)
        .insert(preparedRecords);
        
      if (error) {
        console.error(`Error importing ${module}:`, error);
      } else {
        successCount += insertedData ? insertedData.length : 0;
      }
    }
    
    // Log the import activity
    const logEntry = {
      action: 'import',
      user_id: userId,
      user_name: userName,
      timestamp: formatISO(new Date()),
      modules,
      success: successCount > 0,
      total_records: totalRecords,
      success_count: successCount,
      failed_count: totalRecords - successCount
    };
    
    await supabase.from('backup_logs').insert([logEntry]);
    
    return { 
      success: successCount > 0,
      message: `Successfully imported ${successCount} of ${totalRecords} records`
    };
    
  } catch (error: any) {
    console.error('Import failed:', error);
    return { success: false, message: error.message };
  }
};
