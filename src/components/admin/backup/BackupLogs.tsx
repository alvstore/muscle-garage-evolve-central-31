import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Archive, Download, Search, Upload } from 'lucide-react';
import { BackupLogEntry } from '@/types/notification';
import { supabase } from '@/services/supabaseClient';

const BackupLogs = () => {
  const [logs, setLogs] = useState<BackupLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data: backupLogs, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      setLogs(backupLogs as BackupLogEntry[]);
    } catch (error) {
      console.error('Failed to fetch backup logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs
    .filter(log => {
      if (currentTab === 'all') return true;
      return log.action === currentTab;
    })
    .filter(log => {
      if (filter === 'all') return true;
      if (filter === 'success') return log.success;
      if (filter === 'failed') return !log.success;
      return true;
    })
    .filter(log => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(term) ||
        log.modules.some(m => m.toLowerCase().includes(term))
      );
    });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-medium">Backup Activity Logs</h3>
        <p className="text-sm text-muted-foreground">
          View a history of all import and export activities
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-1.5" />
                Exports
              </TabsTrigger>
              <TabsTrigger value="import">
                <Upload className="h-4 w-4 mr-1.5" />
                Imports
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or module"
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Successful Only</SelectItem>
                <SelectItem value="failed">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {new Date(log.timestamp).toLocaleDateString()}
                      <div className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {log.action === 'export' ? (
                          <>
                            <Download className="h-3.5 w-3.5 text-blue-500" />
                            <span>Export</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5 text-green-500" />
                            <span>Import</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {log.modules.map((module) => (
                          <Badge key={module} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-100">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.action === 'import' && log.totalRecords && (
                        <span className="text-sm">
                          {log.successCount}/{log.totalRecords} records
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>
          <Archive className="h-3.5 w-3.5 inline mr-1" />
          Backup logs are stored for 30 days and then automatically purged.
        </p>
      </div>
    </div>
  );
};

export default BackupLogs;
