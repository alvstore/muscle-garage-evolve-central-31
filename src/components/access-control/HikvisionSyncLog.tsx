import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hikvisionService } from '@/services/integrations/hikvisionService';

export interface SyncLogEntry {
  id: string;
  event_type: 'sync' | 'error' | 'info' | 'warning';
  message: string;
  details?: string;
  created_at: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  entity_type?: 'member' | 'device' | 'door' | 'attendance';
  entity_id?: string;
  entity_name?: string;
  branch_id: string;
}

interface HikvisionSyncLogProps {
  branchId: string;
  limit?: number;
  height?: string;
  showRefresh?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const HikvisionSyncLog: React.FC<HikvisionSyncLogProps> = ({
  branchId,
  limit = 50,
  height = '400px',
  showRefresh = true,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const data = await hikvisionService.getSyncLogs(branchId);
      
      // Transform the data to match SyncLogEntry interface
      const transformedLogs: SyncLogEntry[] = data.map(log => ({
        id: log.id,
        event_type: 'sync' as const,
        message: log.message,
        details: log.details,
        created_at: log.timestamp,
        status: log.status as 'success' | 'error' | 'pending' | 'warning',
        entity_type: 'member' as const,
        entity_id: log.id,
        entity_name: log.action,
        branch_id: branchId
      }));
      
      setLogs(transformedLogs);
      setError(null);
    } catch (err) {
      console.error('Error fetching Hikvision sync logs:', err);
      setError('Failed to load integration logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Set up auto-refresh if enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      intervalId = setInterval(fetchLogs, refreshInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [branchId, limit, autoRefresh, refreshInterval]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'sync':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Sync</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Error</Badge>;
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Warning</Badge>;
      default:
        return <Badge variant="secondary">Log</Badge>;
    }
  };

  const getEntityBadge = (type?: string) => {
    if (!type) return null;
    
    switch (type) {
      case 'member':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
          Member
        </Badge>;
      case 'device':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
          Device
        </Badge>;
      case 'door':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700">
          Door
        </Badge>;
      case 'attendance':
        return <Badge variant="outline" className="bg-violet-50 text-violet-700">
          Attendance
        </Badge>;
      default:
        return <Badge variant="outline">
          Entity
        </Badge>;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Hikvision Integration Logs</CardTitle>
            <CardDescription>Recent synchronization and integration events</CardDescription>
          </div>
          {showRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLogs} 
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && !refreshing ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No integration logs found</p>
          </div>
        ) : (
          <ScrollArea className={`h-[${height}]`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[100px]">Entity</TableHead>
                  <TableHead className="w-[150px]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getEventTypeBadge(log.event_type)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.message}</div>
                      {log.details && (
                        <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                          {log.details}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getEntityBadge(log.entity_type)}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        {logs.length > 0 && `Showing ${logs.length} of ${limit} most recent logs`}
      </CardFooter>
    </Card>
  );
};

export default HikvisionSyncLog;
