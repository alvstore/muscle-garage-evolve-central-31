import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { toast } from 'sonner';

// List of tables to include in the export
const TABLES = [
  'branches',
  'members',
  'trainers',
  'staff',
  'classes',
  'class_bookings',
  'announcements',
  'feedback',
  'invoices',
  'payments',
  'member_memberships',
  'memberships',
  'body_measurements',
  'diet_plans',
  'workout_plans',
  'inventory_items',
  'leads',
  'motivational_messages',
  'reminder_rules',
];

interface BackupMetadata {
  timestamp: string;
  tables: string[];
  recordCounts: Record<string, number>;
  totalRecords: number;
  version: string;
}

export const exportData = async () => {
  try {
    const zip = new JSZip();
    const metadata: BackupMetadata = {
      timestamp: new Date().toISOString(),
      tables: TABLES,
      recordCounts: {},
      totalRecords: 0,
      version: '1.0.0',
    };
    
    let totalRecords = 0;
    
    // Export each table to a separate JSON file in the ZIP archive
    for (const table of TABLES) {
      const { data, error } = await supabase
        .from(table as any)
        .select('*');
        
      if (error) {
        console.error(`Error exporting ${table}:`, error);
        continue;
      }
      
      if (!data) {
        continue;
      }
      
      // Add the data to the zip file
      zip.file(`${table}.json`, JSON.stringify(data, null, 2));
      
      // Update metadata
      metadata.recordCounts[table] = data.length;
      totalRecords += data.length;
    }
    
    // Update total records in metadata
    metadata.totalRecords = totalRecords;
    
    // Add metadata file to the zip
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    
    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Save the zip file
    const formattedDate = format(new Date(), 'yyyy-MM-dd_HH-mm');
    saveAs(zipBlob, `gym_crm_backup_${formattedDate}.zip`);
    
    // Log the backup
    await supabase
      .from('backup_logs')
      .insert({
        type: 'export',
        timestamp: new Date().toISOString(),
        records_exported: totalRecords,
        tables_exported: TABLES,
      });
      
    return {
      success: true,
      timestamp: metadata.timestamp,
      totalRecords,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

export const importData = async (file: File) => {
  try {
    // Read the zip file
    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    
    // Extract metadata
    const metadataFile = zip.file('metadata.json');
    if (!metadataFile) {
      throw new Error('Invalid backup file: missing metadata');
    }
    
    const metadataText = await metadataFile.async('text');
    const metadata: BackupMetadata = JSON.parse(metadataText);
    
    // Validate the backup version
    if (metadata.version !== '1.0.0') {
      throw new Error(`Unsupported backup version: ${metadata.version}`);
    }
    
    // Import each table
    let totalImported = 0;
    
    // First, clear all existing data (in reverse order to respect foreign keys)
    for (const table of [...metadata.tables].reverse()) {
      await supabase
        .from(table as any)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except system records
    }
    
    // Then import the data (in forward order to respect foreign keys)
    for (const table of metadata.tables) {
      const tableFile = zip.file(`${table}.json`);
      if (!tableFile) {
        console.warn(`Missing table in backup: ${table}`);
        continue;
      }
      
      const tableText = await tableFile.async('text');
      const tableData = JSON.parse(tableText);
      
      if (tableData.length > 0) {
        const { error } = await supabase
          .from(table as any)
          .insert(tableData);
          
        if (error) {
          console.error(`Error importing ${table}:`, error);
          throw new Error(`Failed to import ${table}: ${error.message}`);
        }
        
        totalImported += tableData.length;
      }
    }
    
    // Log the import
    await supabase
      .from('backup_logs')
      .insert({
        type: 'import',
        timestamp: new Date().toISOString(),
        records_imported: totalImported,
        tables_imported: metadata.tables,
      });
      
    return {
      success: true,
      timestamp: metadata.timestamp,
      totalRecords: totalImported,
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error(`Failed to import data: ${(error as Error).message}`);
  }
};

export const getBackupLogs = async (): Promise<BackupLogEntry[]> => {
  // In a real app, you'd fetch this from the database
  return [
    {
      id: '1',
      user_name: 'Admin User',
      action: 'backup',
      modules: ['members', 'invoices'],
      timestamp: new Date().toISOString(),
      success: true,
      total_records: 250,
      success_count: 250,
      failed_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_name: 'Admin User',
      action: 'restore',
      modules: ['members'],
      timestamp: new Date().toISOString(),
      success: false,
      total_records: 150,
      success_count: 130,
      failed_count: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
};

export const createBackup = async (modules: string[]): Promise<boolean> => {
  // Placeholder implementation
  console.log('Creating backup for modules:', modules);
  return true;
};

export const restoreBackup = async (backupId: string): Promise<boolean> => {
  // Placeholder implementation
  console.log('Restoring backup with ID:', backupId);
  return true;
};
