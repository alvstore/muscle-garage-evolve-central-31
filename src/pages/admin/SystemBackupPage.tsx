
import React from 'react';
import { Card } from '@/components/ui/card';
import { BackupActions } from '@/components/admin/backup/BackupActions';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';

export const SystemBackupPage = () => {
  const { can } = usePermissions();

  if (!can('system.backup')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Backup</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Export Backend Files</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Create a backup ZIP file containing all backend-related files including database schema,
          edge functions, services, and configuration.
        </p>
        <BackupActions />
      </Card>
    </div>
  );
};

export default SystemBackupPage;
