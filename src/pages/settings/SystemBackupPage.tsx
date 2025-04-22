
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download,
  Upload,
  Calendar,
  FileDown,
  FileUp,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { toast } from 'sonner';
import { backupService, ExportType, ImportType, DateRange, ExportFormat, BackupLogEntry } from '@/services/backupService';
import { format } from 'date-fns';

// File upload component for imports
const FileUpload: React.FC<{
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
}> = ({ onFileSelect, accept, label }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button type="button" onClick={handleButtonClick} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Select File
        </Button>
      </div>
    </div>
  );
};

// Preview table for import data
const ImportPreview: React.FC<{
  data: any[];
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ data, onConfirm, onCancel }) => {
  if (!data || data.length === 0) {
    return <div>No data to preview</div>;
  }
  
  const headers = Object.keys(data[0]);
  
  return (
    <div className="mt-4 space-y-4">
      <CardTitle>Data Preview</CardTitle>
      <div className="border rounded-md overflow-auto max-h-60">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm">
                    {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirm Import
        </Button>
      </div>
    </div>
  );
};

// Backup logs display
const BackupLogs: React.FC<{ logs: BackupLogEntry[] }> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <div className="text-center py-8 text-gray-500">No backup logs found</div>;
  }
  
  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-medium">Recent Actions</h3>
      <div className="overflow-auto max-h-60">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {log.action === 'export' ? (
                    <span className="inline-flex items-center">
                      <FileDown className="h-4 w-4 mr-1 text-blue-500" />
                      Export
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <FileUp className="h-4 w-4 mr-1 text-green-500" />
                      Import
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{log.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {log.status === 'success' ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Success
                    </span>
                  ) : log.status === 'partial' ? (
                    <span className="inline-flex items-center text-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Partial
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Failed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SystemBackupPage: React.FC = () => {
  const { isSystemAdmin } = usePermissions();
  const [exportType, setExportType] = useState<ExportType>('members');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');
  const [dateRange, setDateRange] = useState<DateRange>({});
  
  const [importType, setImportType] = useState<ImportType>('members');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [logs, setLogs] = useState<BackupLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch backup logs
  const fetchLogs = async () => {
    setIsLoading(true);
    const backupLogs = await backupService.getBackupLogs();
    setLogs(backupLogs);
    setIsLoading(false);
  };
  
  React.useEffect(() => {
    fetchLogs();
  }, []);
  
  // Handle export
  const handleExport = async () => {
    if (!isSystemAdmin()) {
      toast.error('Only system administrators can export data');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const filename = await backupService.exportData(exportType, exportFormat, dateRange);
      
      if (filename) {
        toast.success(`Successfully exported ${exportType} data to ${filename}`);
      } else {
        toast.error(`No data available to export for ${exportType}`);
      }
      
      // Refresh logs
      fetchLogs();
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export ${exportType} data: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle date range changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      startDate: e.target.value ? new Date(e.target.value) : undefined
    });
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      endDate: e.target.value ? new Date(e.target.value) : undefined
    });
  };
  
  // Handle file upload for import
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewData(null); // Clear previous preview
  };
  
  // Preview import data
  const handlePreviewImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    if (!isSystemAdmin()) {
      toast.error('Only system administrators can import data');
      return;
    }
    
    setIsImporting(true);
    
    try {
      const result = await backupService.importData(importType, selectedFile);
      
      if (result.success && result.preview) {
        setPreviewData(result.preview);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Import preview error:', error);
      toast.error(`Failed to preview import: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  // Confirm import after preview
  const handleConfirmImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    setIsImporting(true);
    
    try {
      const result = await backupService.confirmImport(importType, selectedFile);
      
      if (result.success) {
        toast.success(result.message);
        setPreviewData(null);
        setSelectedFile(null);
        
        // Refresh logs
        fetchLogs();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Failed to import data: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  // Cancel import preview
  const handleCancelImport = () => {
    setPreviewData(null);
  };
  
  // Download import template
  const handleDownloadTemplate = () => {
    try {
      const filename = backupService.getImportTemplate(importType);
      toast.success(`Template downloaded: ${filename}`);
    } catch (error) {
      console.error('Template download error:', error);
      toast.error(`Failed to download template: ${(error as Error).message}`);
    }
  };
  
  const todayFormatted = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <Container>
      <div className="py-10 space-y-8">
        <Heading
          title="System Backup & Restore"
          description="Export and import system data for backup, migration, and recovery purposes"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Loading backup history...' : `${logs.length} backup operations logged`}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </Button>
        </div>
        
        <Tabs defaultValue="export" className="space-y-4">
          <TabsList>
            <TabsTrigger value="export" className="flex items-center">
              <FileDown className="h-4 w-4 mr-2" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center">
              <FileUp className="h-4 w-4 mr-2" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Backup History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Export system data for backup purposes. Choose the type of data to export and the format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exportType">Data to Export</Label>
                    <Select 
                      value={exportType} 
                      onValueChange={(value) => setExportType(value as ExportType)}
                    >
                      <SelectTrigger id="exportType">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="members">Member List</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="trainers">Trainers</SelectItem>
                        <SelectItem value="branches">Branches</SelectItem>
                        <SelectItem value="workout_plans">Workout Plans</SelectItem>
                        <SelectItem value="diet_plans">Diet Plans</SelectItem>
                        <SelectItem value="attendance">Attendance Logs</SelectItem>
                        <SelectItem value="invoices">Invoices</SelectItem>
                        <SelectItem value="transactions">Transactions</SelectItem>
                        <SelectItem value="crm_leads">CRM Leads</SelectItem>
                        <SelectItem value="referrals">Referrals</SelectItem>
                        <SelectItem value="tasks">Tasks</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="store_orders">Store Orders</SelectItem>
                        <SelectItem value="website_content">Website Content</SelectItem>
                        <SelectItem value="settings">System Settings</SelectItem>
                        <SelectItem value="all">All Data (ZIP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select 
                      value={exportFormat} 
                      onValueChange={(value) => setExportFormat(value as ExportFormat)}
                    >
                      <SelectTrigger id="exportFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Date range selector (only show for certain data types) */}
                {(['attendance', 'invoices', 'transactions', 'tasks'].includes(exportType)) && (
                  <div className="space-y-2 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <Label>Date Range (Optional)</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          max={todayFormatted}
                          value={dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
                          onChange={handleStartDateChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          max={todayFormatted}
                          value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
                          onChange={handleEndDateChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleExport}
                  disabled={isExporting || !isSystemAdmin()}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>
                  Import system data from CSV or Excel files. Choose the type of data to import.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="importType">Data to Import</Label>
                    <Select 
                      value={importType} 
                      onValueChange={(value) => setImportType(value as ImportType)}
                    >
                      <SelectTrigger id="importType">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="members">Member List</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="trainers">Trainers</SelectItem>
                        <SelectItem value="workout_plans">Workout Plans</SelectItem>
                        <SelectItem value="diet_plans">Diet Plans</SelectItem>
                        <SelectItem value="crm_leads">CRM Leads</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    accept=".csv,.xlsx"
                    label="Select File to Import"
                  />
                </div>
                
                <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  
                  <Button
                    onClick={handlePreviewImport}
                    disabled={!selectedFile || isImporting || !isSystemAdmin()}
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Preview Import
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Preview data table */}
                {previewData && (
                  <ImportPreview
                    data={previewData}
                    onConfirm={handleConfirmImport}
                    onCancel={handleCancelImport}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>
                  View a log of all import and export operations performed on the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BackupLogs logs={logs} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SystemBackupPage;
