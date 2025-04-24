
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
import { createBackupZip } from '@/services/backup/backupService';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const BackupActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState<{ timestamp: string; size: string } | null>(null);

  const handleExportBackend = async () => {
    try {
      setIsLoading(true);
      const result = await createBackupZip();
      
      if (result.success) {
        setLastBackup({
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
          size: result.size
        });
        toast.success('Backend files exported successfully');
      } else {
        toast.error('Failed to export backend files');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export backend files');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Button 
          onClick={handleExportBackend}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {isLoading ? 'Exporting...' : 'Export Backend Files'}
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={!lastBackup}
          title="Restore functionality coming soon"
        >
          <RotateCcw className="h-4 w-4" />
          Restore
        </Button>
      </div>

      {lastBackup && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last backup: {lastBackup.timestamp} ({lastBackup.size})
        </div>
      )}
    </div>
  );
};
