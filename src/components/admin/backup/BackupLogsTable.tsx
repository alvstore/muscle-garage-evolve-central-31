
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { BackupLogEntry } from '@/types/backup';

interface BackupLogsTableProps {
  logs: BackupLogEntry[];
  loading: boolean;
}

const BackupLogsTable: React.FC<BackupLogsTableProps> = ({ logs, loading }) => {
  if (loading) {
    return <div className="text-center py-6">Loading backup logs...</div>;
  }

  if (!logs || logs.length === 0) {
    return <div className="text-center py-6">No backup logs available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Modules</TableHead>
          <TableHead>Records</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">
              {log.action === 'export' ? 'Export' : 'Import'}
            </TableCell>
            <TableCell>{log.user_name || 'System'}</TableCell>
            <TableCell>
              <Badge variant={log.success ? 'success' : 'destructive'}>
                {log.success ? 'Success' : 'Failed'}
              </Badge>
            </TableCell>
            <TableCell>{log.modules.join(', ')}</TableCell>
            <TableCell>
              {log.total_records !== undefined ? (
                <>
                  {log.success_count}/{log.total_records}{' '}
                  {log.failed_count ? `(${log.failed_count} failed)` : ''}
                </>
              ) : (
                'N/A'
              )}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BackupLogsTable;
