
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/ui/file-uploader";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { BackupLogEntry } from '@/types/notification';
import { toast } from 'sonner';

interface ImportDataSectionProps {
  onImportComplete?: () => void;
}

const ImportDataSection = ({ onImportComplete }: ImportDataSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/json') {
      toast.error("Please select a JSON file");
      return;
    }

    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a JSON file to import");
      return;
    }

    try {
      setIsUploading(true);
      
      const fileContent = await file.text();
      let data: Record<string, any[]>;
      
      try {
        data = JSON.parse(fileContent);
      } catch (error) {
        throw new Error("Invalid JSON file");
      }
      
      const modules = Object.keys(data);
      if (modules.length === 0) {
        throw new Error("No data found in the file");
      }
      
      const validTables = [
        "members", "classes", "profiles",
        "announcements", "reminder_rules", "motivational_messages", "feedback"
      ];
      
      // Validate if all modules are valid tables
      const invalidModules = modules.filter(module => !validTables.includes(module));
      if (invalidModules.length > 0) {
        throw new Error(`Invalid modules: ${invalidModules.join(", ")}`);
      }
      
      // Process each module
      let totalRecords = 0;
      let successCount = 0;
      
      for (const module of modules) {
        const records = data[module];
        if (!Array.isArray(records) || records.length === 0) continue;
        
        totalRecords += records.length;
        
        // Remove ids to let the database generate new ones
        const preparedRecords = records.map(record => {
          const { id, ...rest } = record;
          return {
            ...rest,
            imported_at: new Date().toISOString()
          };
        });
        
        // Use any valid string for the module name
        const { data: insertedData, error } = await supabase
          .from(module as any)
          .insert(preparedRecords)
          .select();
          
        if (error) {
          console.error(`Error importing ${module}:`, error);
        } else {
          successCount += insertedData ? insertedData.length : 0;
        }
      }
      
      // Log the import activity
      const logEntry: Omit<BackupLogEntry, "id" | "created_at" | "updated_at"> = {
        action: 'import',
        user_id: user?.id,
        user_name: user?.name || 'Unknown',
        timestamp: new Date().toISOString(),
        modules,
        success: successCount > 0,
        total_records: totalRecords,
        success_count: successCount,
        failed_count: totalRecords - successCount
      };
      
      await supabase.from('backup_logs').insert([logEntry]);
      
      toast.success(`Successfully imported ${successCount} of ${totalRecords} records`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>
          Upload a JSON export file to import data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Select JSON File</Label>
          <FileUploader
            ref={fileInputRef}
            onFileSelected={handleFileChange}
            accept=".json"
          />
        </div>
        {file && (
          <div className="text-sm">
            Selected file: <span className="font-medium">{file.name}</span>
          </div>
        )}
        <Button 
          onClick={handleImport} 
          disabled={!file || isUploading}
        >
          {isUploading ? "Importing..." : "Import"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImportDataSection;
