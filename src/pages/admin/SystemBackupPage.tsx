
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExportDataSection from '@/components/admin/backup/ExportDataSection';
import ImportDataSection from '@/components/admin/backup/ImportDataSection';
import BackupLogs from '@/components/admin/backup/BackupLogs';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';
import { Archive, Download, Upload } from 'lucide-react';

const SystemBackupPage = () => {
  const [activeTab, setActiveTab] = useState('export');
  const { isSystemAdmin } = usePermissions();

  if (!isSystemAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Backup</h1>
          <p className="text-muted-foreground">Export and import data for backup, migration, and recovery purposes</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Archive className="h-5 w-5" />
            <span>Data Backup & Restoration</span>
          </CardTitle>
          <CardDescription>
            Export your data for backup or import previously exported data to restore your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="export" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center space-x-2">
                <Archive className="h-4 w-4" />
                <span>Backup Logs</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="export">
              <ExportDataSection />
            </TabsContent>
            
            <TabsContent value="import">
              <ImportDataSection />
            </TabsContent>
            
            <TabsContent value="logs">
              <BackupLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SystemBackupPage;
