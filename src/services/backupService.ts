
import { exportService } from './backup/exportService';
import { importService } from './backup/importService';
import { logsService } from './backup/logsService';
import type { 
  ExportType, 
  ImportType, 
  DateRange, 
  ExportFormat, 
  BackupLogEntry 
} from './backup/types';

export {
  ExportType,
  ImportType,
  DateRange,
  ExportFormat,
  BackupLogEntry
};

export const backupService = {
  // Export operations
  exportData: exportService.exportData.bind(exportService),
  exportSingleType: exportService.exportSingleType.bind(exportService),
  
  // Import operations
  importData: importService.importData.bind(importService),
  confirmImport: importService.confirmImport.bind(importService),
  getImportTemplate: importService.getImportTemplate.bind(importService),
  
  // Logs operations
  getBackupLogs: logsService.getBackupLogs.bind(logsService),
  logBackupAction: logsService.logBackupAction.bind(logsService)
};

export default backupService;
