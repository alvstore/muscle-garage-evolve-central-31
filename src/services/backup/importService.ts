
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { supabase } from '@/services/supabaseClient';
import { ImportType } from './types';
import { exportTypeToTable, importTemplates } from './constants';
import { validateImportData } from './utils';
import { logsService } from './logsService';

export const importService = {
  async importData(type: ImportType, file: File) {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            if (!data) throw new Error('Failed to read file');
            
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
            
            resolve({
              success: true,
              message: `Found ${parsedData.length} records to import`,
              preview: parsedData.slice(0, 5)
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
      await logsService.logBackupAction('import', type, 'failure', { 
        error: (error as Error).message 
      });
      return {
        success: false,
        message: (error as Error).message || 'Failed to import data'
      };
    }
  },

  async confirmImport(type: ImportType, file: File) {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            if (!data) throw new Error('Failed to read file');
            
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
            
            const validationResult = validateImportData(type, parsedData);
            if (!validationResult.success) {
              throw new Error(validationResult.message);
            }
            
            const tableName = exportTypeToTable[type];
            const importResults = {
              successful: 0,
              failed: 0,
              errors: [] as string[]
            };
            
            const batchSize = 50;
            const batches = [];
            
            for (let i = 0; i < parsedData.length; i += batchSize) {
              batches.push(parsedData.slice(i, i + batchSize));
            }
            
            for (const batch of batches) {
              const { data, error } = await supabase
                .from(tableName)
                .upsert(batch, { onConflict: 'id' });
              
              if (error) {
                importResults.failed += batch.length;
                importResults.errors.push(error.message);
              } else {
                importResults.successful += batch.length;
              }
            }
            
            const status = importResults.failed === 0 ? 'success' : 
              importResults.successful > 0 ? 'partial' : 'failure';
            
            await logsService.logBackupAction('import', type, status, {
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
      await logsService.logBackupAction('import', type, 'failure', { 
        error: (error as Error).message 
      });
      return {
        success: false,
        message: (error as Error).message || 'Failed to import data'
      };
    }
  },

  getImportTemplate(type: ImportType) {
    const template = importTemplates[type];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const filename = `${type}_import_template.xlsx`;
    saveAs(blob, filename);
    return filename;
  }
};
