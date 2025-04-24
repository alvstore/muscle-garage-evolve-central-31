
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { validateImportData, importData, logBackupActivity } from '@/services/backupService';
import { 
  FileUp, 
  FileCheck, 
  FileX, 
  AlertCircle, 
  FileText, 
  RefreshCcw, 
  Check,
  X
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ImportModule {
  id: string;
  label: string;
  description: string;
  requiredColumns: string[];
}

const modules: ImportModule[] = [
  {
    id: 'members',
    label: 'Members Data',
    description: 'Import member records including personal information and status',
    requiredColumns: ['name', 'email']
  },
  {
    id: 'profiles',
    label: 'Staff & Trainers',
    description: 'Import staff and trainer profiles',
    requiredColumns: ['full_name', 'email', 'role']
  },
  {
    id: 'branches',
    label: 'Branches',
    description: 'Import branch information including contact details',
    requiredColumns: ['name']
  },
  {
    id: 'workout_plans',
    label: 'Workout Plans',
    description: 'Import workout plans',
    requiredColumns: ['name', 'trainer_id']
  },
  {
    id: 'diet_plans',
    label: 'Diet Plans',
    description: 'Import diet plans',
    requiredColumns: ['name', 'trainer_id']
  },
  {
    id: 'invoices',
    label: 'Invoices',
    description: 'Import invoice records',
    requiredColumns: ['amount', 'status', 'issued_date', 'due_date']
  },
  {
    id: 'transactions',
    label: 'Financial Transactions',
    description: 'Import financial transactions',
    requiredColumns: ['amount', 'type', 'transaction_date']
  }
];

const ImportDataSection: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: { row: number; errors: string[] }[] } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    if (file.type !== 'application/json') {
      toast.error('Please upload a JSON file');
      return;
    }

    setUploadedFile(file);
    setFileData(null);
    setValidationResult(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setFileData(data);
      } catch (error) {
        toast.error('Invalid JSON file');
        console.error('JSON parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleValidateData = () => {
    if (!selectedModule || !fileData) {
      toast.error('Please select a module and upload a valid file');
      return;
    }
    
    setIsValidating(true);
    
    try {
      const moduleConfig = modules.find(m => m.id === selectedModule);
      if (!moduleConfig) {
        toast.error('Invalid module selected');
        setIsValidating(false);
        return;
      }
      
      // Extract the data for the selected module
      const dataToValidate = Array.isArray(fileData) ? fileData : fileData[selectedModule];
      
      if (!dataToValidate || !Array.isArray(dataToValidate)) {
        toast.error(`No valid data found for ${moduleConfig.label}`);
        setIsValidating(false);
        return;
      }
      
      const result = validateImportData(dataToValidate, moduleConfig.requiredColumns);
      setValidationResult(result);
      setActiveTab('validate');
      
      if (result.valid) {
        toast.success('Data validation successful! Ready to import.');
      } else {
        toast.warning(`Found ${result.errors.length} validation issues.`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Error validating data');
    } finally {
      setIsValidating(false);
    }
  };

  const handleImportData = async () => {
    if (!selectedModule || !fileData || !validationResult?.valid) {
      toast.error('Please ensure data is valid before importing');
      return;
    }
    
    setIsImporting(true);
    toast.info(`Starting import for ${selectedModule}...`);
    
    try {
      // Extract the data for the selected module
      const dataToImport = Array.isArray(fileData) ? fileData : fileData[selectedModule];
      
      if (!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) {
        throw new Error(`No valid data found for ${selectedModule}`);
      }
      
      const result = await importData(selectedModule, dataToImport);
      
      // Log the backup activity
      await logBackupActivity(
        'import',
        selectedModule,
        dataToImport.length,
        result.successCount
      );
      
      if (result.success) {
        toast.success(`Successfully imported ${result.successCount} records`);
        resetImport();
      } else {
        toast.error(result.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error during import');
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setSelectedModule('');
    setUploadedFile(null);
    setFileData(null);
    setValidationResult(null);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>
              Import your data from a JSON backup file
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetImport}>
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">1. Upload & Select</TabsTrigger>
            <TabsTrigger value="validate" disabled={!fileData}>2. Validate & Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Select Module to Import</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModule && (
                <p className="text-sm text-muted-foreground mt-1">
                  {modules.find(m => m.id === selectedModule)?.description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Upload JSON File</Label>
              <div className="border rounded-md p-6 cursor-pointer hover:bg-accent/30 transition-colors flex flex-col items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}>
                <FileText className="h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports JSON format only</p>
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
            
            {uploadedFile && (
              <div className="bg-accent/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => { 
                    setActiveTab('validate');
                    handleValidateData();
                  }}
                  disabled={!selectedModule || isValidating}
                >
                  {isValidating ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Validate Data
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Instructions</AlertTitle>
              <AlertDescription>
                Upload a JSON file containing the data you want to import. The file should be in the
                same format as exported from this system. 
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="validate" className="space-y-6 mt-6">
            {validationResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-md flex items-center gap-3 ${
                  validationResult.valid 
                    ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                }`}>
                  {validationResult.valid ? (
                    <Check className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">
                      {validationResult.valid 
                        ? `Data is valid and ready to import` 
                        : `Found ${validationResult.errors.length} validation errors`}
                    </p>
                    <p className="text-sm opacity-80">
                      {validationResult.valid 
                        ? `Click the import button to proceed` 
                        : `Please fix the errors below and try again`}
                    </p>
                  </div>
                </div>

                {!validationResult.valid && validationResult.errors.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Issue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.errors.slice(0, 10).map((error, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">Row {error.row + 1}</TableCell>
                            <TableCell>
                              <ul className="list-disc pl-5">
                                {error.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                            </TableCell>
                          </TableRow>
                        ))}
                        {validationResult.errors.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              And {validationResult.errors.length - 10} more errors...
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {validationResult.valid && (
                  <Alert>
                    <FileCheck className="h-4 w-4" />
                    <AlertTitle>Ready to Import</AlertTitle>
                    <AlertDescription>
                      Your data has been validated successfully and is ready to be imported.
                      Click the import button below to proceed.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setActiveTab('upload')}
          disabled={activeTab === 'upload' || isImporting}
        >
          Back
        </Button>
        
        {activeTab === 'validate' && (
          <Button 
            onClick={handleImportData} 
            disabled={isImporting || !validationResult?.valid}
          >
            {isImporting ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        )}

        {activeTab === 'upload' && (
          <Button 
            onClick={handleValidateData} 
            disabled={!selectedModule || !fileData || isValidating}
          >
            {isValidating ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Validate Data
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImportDataSection;
