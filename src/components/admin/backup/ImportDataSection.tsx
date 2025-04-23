
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, AlertTriangle, Check, Download, Trash, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { validateImportData, importData } from '@/services/backupService';

interface ImportModule {
  id: string;
  label: string;
  requiredColumns: string[];
  sampleData: any[];
  description: string;
}

const importModules: ImportModule[] = [
  {
    id: 'members',
    label: 'Members',
    requiredColumns: ['name', 'email', 'phone', 'status'],
    sampleData: [
      { name: 'John Doe', email: 'john@example.com', phone: '1234567890', status: 'active', goal: 'Weight loss' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', status: 'active', goal: 'Muscle gain' }
    ],
    description: 'Import member profiles including contact details and goals'
  },
  {
    id: 'staffTrainers',
    label: 'Staff & Trainers',
    requiredColumns: ['name', 'email', 'phone', 'role'],
    sampleData: [
      { name: 'Mark Johnson', email: 'mark@example.com', phone: '5554443333', role: 'trainer', specialty: 'Cardio' },
      { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '1112223333', role: 'staff', position: 'Manager' }
    ],
    description: 'Import staff and trainer profiles with roles and specialties'
  },
  {
    id: 'workoutPlans',
    label: 'Workout Plans',
    requiredColumns: ['name', 'description', 'difficulty'],
    sampleData: [
      { name: 'Weight Loss Program', description: 'A 12-week program designed for weight loss', difficulty: 'intermediate' },
      { name: 'Strength Building', description: 'Focus on building strength and muscle mass', difficulty: 'advanced' }
    ],
    description: 'Import workout plan templates and programs'
  },
  {
    id: 'dietPlans',
    label: 'Diet Plans',
    requiredColumns: ['name', 'description', 'dietType'],
    sampleData: [
      { name: 'Balanced Diet Plan', description: 'A well-balanced nutrition plan', dietType: 'balanced', dailyCalories: 2000 },
      { name: 'High Protein Diet', description: 'Focuses on protein intake', dietType: 'high-protein', dailyCalories: 2200 }
    ],
    description: 'Import diet plan templates and meal plans'
  },
  {
    id: 'crmLeads',
    label: 'CRM Leads',
    requiredColumns: ['name', 'email', 'phone', 'source'],
    sampleData: [
      { name: 'Robert Brown', email: 'robert@example.com', phone: '3334445555', source: 'Website', status: 'new' },
      { name: 'Lisa Garcia', email: 'lisa@example.com', phone: '6667778888', source: 'Referral', status: 'contacted' }
    ],
    description: 'Import leads for your sales funnel'
  },
  {
    id: 'inventory',
    label: 'Inventory Products',
    requiredColumns: ['name', 'category', 'price', 'quantity'],
    sampleData: [
      { name: 'Protein Powder', category: 'supplement', price: 29.99, quantity: 50, reorderLevel: 10 },
      { name: 'Resistance Band', category: 'equipment', price: 15.99, quantity: 30, reorderLevel: 5 }
    ],
    description: 'Import inventory products and stock levels'
  }
];

const ImportDataSection = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{row: number, errors: string[]}[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    setImportFile(null);
    setPreviewData([]);
    setColumns([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    
    try {
      const data = await readFile(file);
      if (data && data.length > 0) {
        setPreviewData(data.slice(0, 10)); // Preview first 10 rows
        setColumns(Object.keys(data[0]));
        
        // Validate data
        if (selectedModule) {
          const module = importModules.find(m => m.id === selectedModule);
          if (module) {
            const validationResult = validateImportData(data, module.requiredColumns);
            setValidationErrors(validationResult.errors);
          }
        }
      } else {
        toast.error('No data found in the file or file format is invalid');
        setImportFile(null);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file. Please check the file format.');
      setImportFile(null);
    }
  };

  const readFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            resolve(json as any[]);
          } else {
            reject(new Error('Failed to read file data'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const handleDownloadTemplate = () => {
    const module = importModules.find(m => m.id === selectedModule);
    if (!module) return;
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(module.sampleData);
    XLSX.utils.book_append_sheet(wb, ws, module.label);
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${module.id}_template.xlsx`);
    
    toast.success(`Template for ${module.label} downloaded successfully`);
  };

  const handleImport = async () => {
    setShowConfirmDialog(false);
    setIsImporting(true);
    
    try {
      if (!importFile || !selectedModule) {
        toast.error('Please select a module and upload a file');
        return;
      }
      
      const data = await readFile(importFile);
      const result = await importData(selectedModule, data);
      
      if (result.success) {
        await logBackupActivity('import', selectedModule, data.length, result.successCount);
        toast.success(`Successfully imported ${result.successCount} records`);
        
        // Reset form state
        setImportFile(null);
        setPreviewData([]);
        setColumns([]);
        setValidationErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(`Import failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleRemoveFile = () => {
    setImportFile(null);
    setPreviewData([]);
    setColumns([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const logBackupActivity = async (action: string, moduleId: string, totalRecords: number, successCount: number) => {
    // This would normally call the backend API to log the activity
    console.log('Backup activity:', { 
      action, 
      moduleId, 
      totalRecords,
      successCount,
      timestamp: new Date() 
    });
  };

  const selectedModuleInfo = importModules.find(m => m.id === selectedModule);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-medium">Import Data</h3>
        <p className="text-sm text-muted-foreground">
          Import data from CSV or Excel files to restore or migrate your data
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="module-select" className="text-sm font-medium">
                Select data type to import
              </label>
              <Select value={selectedModule} onValueChange={handleModuleChange}>
                <SelectTrigger id="module-select" className="w-full">
                  <SelectValue placeholder="Select a data type" />
                </SelectTrigger>
                <SelectContent>
                  {importModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedModuleInfo && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Import Requirements</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedModuleInfo.description}
                </p>
                <div className="mb-2">
                  <h5 className="text-xs font-medium">Required columns:</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedModuleInfo.requiredColumns.map((col) => (
                      <span 
                        key={col} 
                        className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 flex items-center gap-1.5 text-xs"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-3 w-3" />
                  Download template file
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="import-file" className="text-sm font-medium">
                  Upload file (.csv or .xlsx)
                </label>
                <input
                  id="import-file"
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={!selectedModule}
                  className="hidden"
                />
                
                {!importFile ? (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!selectedModule}
                      className="w-full h-32 border-dashed flex flex-col items-center justify-center gap-1"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground font-normal">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-muted-foreground">
                        CSV or Excel files only
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-md mt-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="bg-primary/10 p-2 rounded">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{importFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(importFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {previewData.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Data Preview</h4>
                <span className="text-xs text-muted-foreground">
                  Showing {previewData.length} of {importFile ? 'total rows' : '0 rows'}
                </span>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-72 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead key={column}>
                            {column}
                            {selectedModuleInfo?.requiredColumns.includes(column) && (
                              <span className="text-primary ml-1">*</span>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {columns.map((column) => (
                            <TableCell key={column}>
                              {row[column] !== undefined ? String(row[column]) : ''}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {validationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="mt-2">
                      <p className="font-medium text-sm">Validation Errors:</p>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {validationErrors.slice(0, 3).map((error, index) => (
                          <li key={index} className="text-xs">
                            Row {error.row + 1}: {error.errors.join(', ')}
                          </li>
                        ))}
                        {validationErrors.length > 3 && (
                          <li className="text-xs">
                            And {validationErrors.length - 3} more errors...
                          </li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRemoveFile}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={validationErrors.length > 0 || isImporting}
                >
                  {isImporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                      <span className="ml-2">Importing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1.5" />
                      Import Data
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : selectedModule ? (
            <div className="h-full flex items-center justify-center p-8 border rounded-md bg-muted/30">
              <div className="text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="mt-2 text-muted-foreground">
                  Upload a file to preview data
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border rounded-md bg-muted/30">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="mt-2 text-muted-foreground">
                  Please select a data type to import
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Data Import</DialogTitle>
            <DialogDescription>
              Are you sure you want to import this data? This action might overwrite existing records.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-orange-50 border border-orange-100 rounded-md p-4 flex">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Please confirm</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  You are about to import data into your system. This action:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>May create duplicate records if not properly validated</li>
                  <li>Cannot be easily undone</li>
                  <li>Might affect relationships with existing data</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Confirm Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportDataSection;
