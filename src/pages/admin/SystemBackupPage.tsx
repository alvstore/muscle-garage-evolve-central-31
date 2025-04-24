
import React from 'react';
import { BackupActions } from '@/components/admin/backup/BackupActions';
import { Card } from '@/components/ui/card';

export const SystemBackupPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Backup</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Export Backend Files</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Download a ZIP file containing all backend-related files including database schema,
          edge functions, services, and configuration.
        </p>
        <BackupActions />
      </Card>
    </div>
  );
};

export default SystemBackupPage;
