
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface BackupLog {
  id: string;
  action: string;
  modules: string[];
  timestamp: string;
  success: boolean;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
}

const SystemBackupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    fetchBackupLogs();
  }, []);

  const fetchBackupLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setBackupLogs(data || []);
    } catch (error) {
      console.error('Error fetching backup logs:', error);
      toast.error('Failed to fetch backup logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // In real implementation, this would call an Edge function or backend API
      // that performs the actual backup operation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      toast.success('System backup initiated successfully');
      // Refresh the logs list
      fetchBackupLogs();
    } catch (error) {
      console.error('Error initiating backup:', error);
      toast.error('Failed to initiate backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">System Backup</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Backup Controls</CardTitle>
            <CardDescription>
              Start a manual backup or schedule automatic backups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  onClick={handleBackup} 
                  disabled={isBackingUp}
                  className="w-full md:w-auto"
                >
                  {isBackingUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Backing Up...
                    </>
                  ) : (
                    'Start Manual Backup'
                  )}
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Schedule Automatic Backup
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  The backup process may take several minutes depending on the database size.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>
              Recent backup logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : backupLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Date & Time</th>
                      <th className="px-4 py-2 text-left font-medium">Action</th>
                      <th className="px-4 py-2 text-left font-medium">Modules</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Records</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{formatDate(log.timestamp)}</td>
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="px-4 py-3">{log.modules.join(', ')}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {log.success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {log.total_records !== undefined ? 
                            `${log.success_count || 0}/${log.total_records}` : 
                            'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No backup logs found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default SystemBackupPage;
