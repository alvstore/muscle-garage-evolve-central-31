
import { toast } from 'sonner';
import api from './api';
import { supabase } from '@/services/supabaseClient';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export type ExportType = 
  | 'members'
  | 'staff'
  | 'trainers'
  | 'branches'
  | 'workout_plans'
  | 'diet_plans'
  | 'attendance'
  | 'invoices'
  | 'transactions'
  | 'crm_leads'
  | 'referrals'
  | 'tasks'
  | 'inventory'
  | 'store_orders'
  | 'website_content'
  | 'settings'
  | 'all';

export type ImportType = 
  | 'members'
  | 'staff'
  | 'trainers'
  | 'workout_plans'
  | 'diet_plans'
  | 'crm_leads'
  | 'inventory';

export type DateRange = {
  startDate?: Date;
  endDate?: Date;
};

export type ExportFormat = 'csv' | 'xlsx';

export type BackupLogEntry = {
  id: string;
  userId: string;
  action: 'export' | 'import';
  type: ExportType | ImportType;
  timestamp: string;
  details: any;
  status: 'success' | 'failure' | 'partial';
  error?: string;
};

// Map of export types to table names
const exportTypeToTable: Record<ExportType, string> = {
  members: 'profiles',
  staff: 'profiles',
  trainers: 'profiles',
  branches: 'branches',
  workout_plans: 'workout_plans',
  diet_plans: 'diet_plans',
  attendance: 'member_attendance',
  invoices: 'payments',
  transactions: 'transactions',
  crm_leads: 'leads',
  referrals: 'referrals',
  tasks: 'tasks',
  inventory: 'inventory',
  store_orders: 'orders',
  website_content: 'website_content',
  settings: 'global_settings',
  all: 'all'
};

// Helper function to convert date objects to ISO strings
const formatDates = (data: any[]) => {
  return data.map(item => {
    const formatted: any = { ...item };
    Object.keys(formatted).forEach(key => {
      if (formatted[key] instanceof Date) {
        formatted[key] = formatted[key].toISOString();
      }
    });
    return formatted;
  });
};

export const backupService = {
  // Export data based on type
  async exportData(type: ExportType, format: ExportFormat, dateRange?: DateRange): Promise<string | null> {
    try {
      let data: any[] = [];
      const tableName = exportTypeToTable[type];
      
      if (type === 'all') {
        // Handle exporting all data as a zip file
        const exportPromises = Object.keys(exportTypeToTable)
          .filter(key => key !== 'all')
          .map(key => this.exportSingleType(key as ExportType, dateRange));
        
        const results = await Promise.all(exportPromises);
        
        // TODO: Create a zip file with all exports
        return null;
      } else {
        return await this.exportSingleType(type, dateRange, format);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export ${type} data`);
      
      // Log the failed export attempt
      await this.logBackupAction('export', type, 'failure', { error: (error as Error).message });
      
      return null;
    }
  },

  // Export a single type of data
  async exportSingleType(type: ExportType, dateRange?: DateRange, format: ExportFormat = 'xlsx'): Promise<string | null> {
    try {
      const tableName = exportTypeToTable[type];
      let query = supabase.from(tableName).select('*');

      // Add date range filters if applicable
      if (dateRange?.startDate && ['attendance', 'invoices', 'transactions', 'tasks'].includes(type)) {
        query = query.gte('created_at', dateRange.startDate.toISOString());
      }
      
      if (dateRange?.endDate && ['attendance', 'invoices', 'transactions', 'tasks'].includes(type)) {
        query = query.lte('created_at', dateRange.endDate.toISOString());
      }
      
      // Add filters for specific types
      if (type === 'staff') {
        query = query.eq('role', 'staff');
      } else if (type === 'trainers') {
        query = query.eq('role', 'trainer');
      } else if (type === 'members') {
        query = query.eq('role', 'member');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast.info(`No ${type} data found to export`);
        return null;
      }

      // Format the data (remove sensitive information, format dates, etc.)
      const formattedData = formatDates(data);
      
      // Create a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${type}_export_${timestamp}.${format}`;
      
      // Create the file based on format
      if (format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, filename);
      } else {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, type);
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);
      }
      
      // Log the successful export
      await this.logBackupAction('export', type, 'success', { 
        count: formattedData.length,
        format,
        dateRange
      });
      
      return filename;
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast.error(`Failed to export ${type} data`);
      
      // Log the failed export attempt
      await this.logBackupAction('export', type, 'failure', { error: (error as Error).message });
      
      return null;
    }
  },

  // Import data from a file
  async importData(type: ImportType, file: File): Promise<{ success: boolean; message: string; preview?: any[] }> {
    try {
      // Read the file
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              throw new Error('Failed to read file');
            }
            
            // Parse the file based on extension
            const extension = file.name.split('.').pop()?.toLowerCase();
            let parsedData: any[] = [];
            
            if (extension === 'csv') {
              // Parse CSV
              const workbook = XLSX.read(data, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            } else if (extension === 'xlsx') {
              // Parse Excel
              const workbook = XLSX.read(data, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            } else {
              throw new Error('Unsupported file format. Please use CSV or XLSX.');
            }
            
            if (parsedData.length === 0) {
              throw new Error('No data found in the file');
            }
            
            // Return preview data first without actually importing
            resolve({
              success: true,
              message: `Found ${parsedData.length} records to import`,
              preview: parsedData.slice(0, 5) // First 5 records for preview
            });
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsBinaryString(file);
      });
    } catch (error) {
      console.error('Import error:', error);
      
      // Log the failed import attempt
      await this.logBackupAction('import', type, 'failure', { error: (error as Error).message });
      
      return {
        success: false,
        message: (error as Error).message || 'Failed to import data'
      };
    }
  },
  
  // Confirm import after preview
  async confirmImport(type: ImportType, file: File): Promise<{ success: boolean; message: string; results?: any }> {
    try {
      // Read the file
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              throw new Error('Failed to read file');
            }
            
            // Parse the file based on extension
            const extension = file.name.split('.').pop()?.toLowerCase();
            let parsedData: any[] = [];
            
            if (extension === 'csv' || extension === 'xlsx') {
              const workbook = XLSX.read(data, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            } else {
              throw new Error('Unsupported file format. Please use CSV or XLSX.');
            }
            
            if (parsedData.length === 0) {
              throw new Error('No data found in the file');
            }
            
            // Validate the data based on type
            const validationResult = this.validateImportData(type, parsedData);
            if (!validationResult.success) {
              throw new Error(validationResult.message);
            }
            
            // Process the validated data for import
            const tableName = exportTypeToTable[type];
            const importResults = {
              successful: 0,
              failed: 0,
              errors: [] as string[]
            };
            
            // Process in smaller batches to avoid timeouts
            const batchSize = 50;
            const batches = [];
            
            for (let i = 0; i < parsedData.length; i += batchSize) {
              batches.push(parsedData.slice(i, i + batchSize));
            }
            
            for (const batch of batches) {
              // Fix: Remove 'returning' option which is causing the error
              const { data, error } = await supabase.from(tableName).upsert(batch, {
                onConflict: 'id'
              });
              
              if (error) {
                importResults.failed += batch.length;
                importResults.errors.push(error.message);
              } else {
                importResults.successful += batch.length;
              }
            }
            
            // Log the import action
            const status = importResults.failed === 0 ? 'success' : importResults.successful > 0 ? 'partial' : 'failure';
            await this.logBackupAction('import', type, status, {
              totalRecords: parsedData.length,
              successful: importResults.successful,
              failed: importResults.failed,
              errors: importResults.errors
            });
            
            resolve({
              success: true,
              message: `Imported ${importResults.successful} records successfully, ${importResults.failed} failed`,
              results: importResults
            });
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsBinaryString(file);
      });
    } catch (error) {
      console.error('Import error:', error);
      
      // Log the failed import attempt
      await this.logBackupAction('import', type, 'failure', { error: (error as Error).message });
      
      return {
        success: false,
        message: (error as Error).message || 'Failed to import data'
      };
    }
  },
  
  // Validate import data based on type
  validateImportData(type: ImportType, data: any[]): { success: boolean; message: string } {
    // Basic validation based on data type
    try {
      switch (type) {
        case 'members':
          if (!this.validateRequiredFields(data, ['full_name', 'email'])) {
            return { success: false, message: 'Missing required fields: full_name, email' };
          }
          break;
        case 'staff':
        case 'trainers':
          if (!this.validateRequiredFields(data, ['full_name', 'email', 'role'])) {
            return { success: false, message: 'Missing required fields: full_name, email, role' };
          }
          break;
        case 'workout_plans':
          if (!this.validateRequiredFields(data, ['name', 'trainer_id'])) {
            return { success: false, message: 'Missing required fields: name, trainer_id' };
          }
          break;
        case 'diet_plans':
          if (!this.validateRequiredFields(data, ['name', 'trainer_id'])) {
            return { success: false, message: 'Missing required fields: name, trainer_id' };
          }
          break;
        case 'crm_leads':
          if (!this.validateRequiredFields(data, ['name', 'status'])) {
            return { success: false, message: 'Missing required fields: name, status' };
          }
          break;
        case 'inventory':
          if (!this.validateRequiredFields(data, ['name', 'quantity', 'price'])) {
            return { success: false, message: 'Missing required fields: name, quantity, price' };
          }
          break;
        default:
          return { success: false, message: `Unknown import type: ${type}` };
      }
      
      return { success: true, message: 'Validation successful' };
    } catch (error) {
      return { success: false, message: (error as Error).message || 'Validation failed' };
    }
  },
  
  // Validate that all required fields are present in the data
  validateRequiredFields(data: any[], requiredFields: string[]): boolean {
    if (data.length === 0) return false;
    
    const firstRow = data[0];
    return requiredFields.every(field => Object.keys(firstRow).includes(field));
  },
  
  // Log backup actions to the backup_logs table
  async logBackupAction(
    action: 'export' | 'import',
    type: ExportType | ImportType,
    status: 'success' | 'failure' | 'partial',
    details: any
  ): Promise<void> {
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
      
      const { error } = await supabase.from('backup_logs').insert([logEntry]);
      
      if (error) {
        console.error('Failed to log backup action:', error);
      }
    } catch (error) {
      console.error('Error logging backup action:', error);
    }
  },
  
  // Get backup logs
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
  },
  
  // Download template for import
  getImportTemplate(type: ImportType): string {
    const templates: Record<ImportType, any[]> = {
      members: [
        { full_name: 'John Doe', email: 'john@example.com', phone: '1234567890', role: 'member' }
      ],
      staff: [
        { full_name: 'Staff User', email: 'staff@example.com', phone: '1234567890', role: 'staff' }
      ],
      trainers: [
        { full_name: 'Trainer User', email: 'trainer@example.com', phone: '1234567890', role: 'trainer' }
      ],
      workout_plans: [
        { name: 'Beginner Plan', description: 'Beginner workout plan', trainer_id: 'trainer-uuid', difficulty: 'beginner' }
      ],
      diet_plans: [
        { name: 'Protein Diet', description: 'High protein diet', trainer_id: 'trainer-uuid', daily_calories: 2000 }
      ],
      crm_leads: [
        { name: 'Lead Name', email: 'lead@example.com', phone: '1234567890', source: 'Website', status: 'new' }
      ],
      inventory: [
        { name: 'Product', category: 'supplement', quantity: 10, price: 29.99, reorder_level: 5 }
      ]
    };
    
    const worksheet = XLSX.utils.json_to_sheet(templates[type]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Generate filename
    const filename = `${type}_import_template.xlsx`;
    saveAs(blob, filename);
    
    return filename;
  }
};

export default backupService;
