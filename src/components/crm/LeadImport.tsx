
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  UploadCloud, 
  Download, 
  CheckCircle, 
  X, 
  AlertTriangle,
  FileText,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface LeadImportProps {
  onComplete: () => void;
}

const LeadImport = ({ onComplete }: LeadImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    success: 0,
    errors: 0,
    warnings: 0,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File) => {
    // Check file type (CSV or Excel)
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a CSV or Excel file.");
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 5MB.");
      return false;
    }
    
    return true;
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setIsCompleted(false);
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    toast.success("Template downloaded successfully");
  };

  const handleImport = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setIsUploading(false);
        setIsCompleted(true);
        setSummary({
          total: 150,
          success: 142,
          errors: 5,
          warnings: 3,
        });
        toast.success("Lead import completed");
      }
    }, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Leads</CardTitle>
        <CardDescription>
          Upload a CSV or Excel file containing lead information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="space-y-4">
                <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or
                  </p>
                  <div className="mt-4">
                    <label 
                      htmlFor="file-upload" 
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    >
                      Browse Files
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept=".csv,.xls,.xlsx" 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, Excel (max 5MB)
                </p>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileText className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <p className="text-lg font-medium">
                    {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                {isUploading && (
                  <div className="w-full space-y-2">
                    <Progress value={progress} className="h-2 w-full" />
                    <p className="text-sm text-muted-foreground">
                      Uploading... {progress}%
                    </p>
                  </div>
                )}
                {!isUploading && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove File
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium mt-4">Import Completed</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600">Successful</p>
                <p className="text-2xl font-bold text-green-700">{summary.success}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600">Errors</p>
                <p className="text-2xl font-bold text-red-700">{summary.errors}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <p className="text-sm text-amber-600">Warnings</p>
                <p className="text-2xl font-bold text-amber-700">{summary.warnings}</p>
              </div>
            </div>
            
            {summary.errors > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm font-medium text-red-700">
                    There were some errors during import
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Download the error report to see which records failed and why.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => toast.success("Error report downloaded")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Error Report
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onComplete}
        >
          {isCompleted ? "Back to Leads" : "Cancel"}
        </Button>
        {!isCompleted && (
          <Button
            disabled={!file || isUploading}
            onClick={handleImport}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Start Import"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LeadImport;
