
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Upload } from 'lucide-react';
import { BackupLogEntry } from '@/types/notification';

interface BackupLogsTableProps {
  logs: BackupLogEntry[];
  loading: boolean;
}

const BackupLogsTable = ({ logs, loading }: BackupLogsTableProps) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          Loading logs...
        </TableCell>
      </TableRow>
    );
  }

  if (logs.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          No logs found
        </TableCell>
      </TableRow>
    );
  }

  return (
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
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-mono text-xs">
              {new Date(log.timestamp).toLocaleDateString()}
              <div className="text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </TableCell>
            <TableCell>{log.user_name}</TableCell>
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
              {log.action === 'import' && log.total_records && (
                <span className="text-sm">
                  {log.success_count}/{log.total_records} records
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BackupLogsTable;
