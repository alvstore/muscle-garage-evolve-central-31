
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createBackupZip } from '@/services/backupService';
import { toast } from 'sonner';

export const BackupActions = () => {
  const handleExportBackend = async () => {
    try {
      await createBackupZip();
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export backend files');
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Button 
        onClick={handleExportBackend}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Backend Files
      </Button>
    </div>
  );
};
