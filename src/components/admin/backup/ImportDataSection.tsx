import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/use-auth';
import { toast } from 'sonner';
import { Loader2, Upload, FileText } from 'lucide-react';
import backupService from '@/services/settings/backupService';

const ImportDataSection = ({ onImportComplete }: { onImportComplete: () => void }) => {
  const [importing, setImporting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast.error('Please select a file to import');
      return;
    }

    setImporting(true);

    try {
      const backupData = JSON.parse(fileContent);
      
      const result = await backupService.restoreFromBackup(
        backupData,
        user?.id || '',
        user?.full_name || user?.name || 'System',
        { upsert: true }
      );

      if (result.success) {
        toast.success('Data imported successfully');
        setUploadedFile(null);
        setFileContent('');
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        }
        onImportComplete();
      } else {
        toast.error('Failed to import backup');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('An error occurred during import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label
              htmlFor="dropzone-file"
              className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-100 py-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6l-2.06-2.06a5 5 0 00-7.17 7.17l1.291 1.29a3 3 0 012.121 2.121l.458.458m0 0l-2.3-2.3M15 12h5.75a.75.75 0 00.75-.75V4.75a.75.75 0 00-.75-.75H15m0 0l3 3m-3-3v11a.75.75 0 01-.75.75H7.75a.75.75 0 01-.75-.75V12"
                />
              </svg>
              <p className="mb-2 text-xl text-blue-500 font-semibold">
                Upload your file here
              </p>
              <p className="text-sm text-blue-500">
                (Only .json files are supported)
              </p>
              <input
                ref={fileInputRef}
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="rounded-md p-4 bg-muted text-sm text-muted-foreground flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {uploadedFile.name} - {(uploadedFile.size / 1024).toFixed(2)} KB
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => {
                setUploadedFile(null);
                setFileContent('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''; // Reset the file input
                }
              }}>
                Remove
              </Button>
            </div>
          )}

          <Button type="submit" disabled={importing} className="w-full">
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportDataSection;
