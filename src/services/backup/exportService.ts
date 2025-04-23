
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { supabase } from '@/services/supabaseClient';
import { ExportType, DateRange, ExportFormat } from './types';
import { exportTypeToTable } from './constants';
import { formatDates } from './utils';
import { logsService } from './logsService';

export const exportService = {
  async exportData(type: ExportType, format: ExportFormat, dateRange?: DateRange) {
    try {
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
      await logsService.logBackupAction('export', type, 'failure', { error: (error as Error).message });
      return null;
    }
  },

  async exportSingleType(type: ExportType, dateRange?: DateRange, format: ExportFormat = 'xlsx') {
    try {
      const tableName = exportTypeToTable[type];
      let query = supabase.from(tableName).select('*');

      if (dateRange?.startDate && ['attendance', 'invoices', 'transactions', 'tasks'].includes(type)) {
        query = query.gte('created_at', dateRange.startDate.toISOString());
      }
      
      if (dateRange?.endDate && ['attendance', 'invoices', 'transactions', 'tasks'].includes(type)) {
        query = query.lte('created_at', dateRange.endDate.toISOString());
      }
      
      if (type === 'staff') {
        query = query.eq('role', 'staff');
      } else if (type === 'trainers') {
        query = query.eq('role', 'trainer');
      } else if (type === 'members') {
        query = query.eq('role', 'member');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.info(`No ${type} data found to export`);
        return null;
      }

      const formattedData = formatDates(data);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${type}_export_${timestamp}.${format}`;
      
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
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, filename);
      }
      
      await logsService.logBackupAction('export', type, 'success', {
        count: formattedData.length,
        format,
        dateRange
      });
      
      return filename;
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast.error(`Failed to export ${type} data`);
      await logsService.logBackupAction('export', type, 'failure', { 
        error: (error as Error).message 
      });
      return null;
    }
  }
};
