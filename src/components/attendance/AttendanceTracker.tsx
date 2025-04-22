
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendanceEntry {
  memberId: string;
  memberName: string;
  time: string;
  type: 'check-in' | 'check-out';
  location?: string;
  device?: string;
  status?: string;
}

export interface AttendanceTrackerProps {
  data?: AttendanceEntry[];
  date?: Date;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ data = [], date = new Date() }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'expiring':
        return <Badge variant="outline">Expiring Soon</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Payment Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Sort the data by time, most recent first
  const sortedData = [...data].sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Today's Check-ins</h3>
          <p className="text-sm text-muted-foreground">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div>
          <Badge variant="outline">
            {sortedData.length} Member{sortedData.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center py-8 border rounded">
          <p className="text-muted-foreground">No attendance records for today yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((entry, index) => (
              <TableRow key={`${entry.memberId}-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="" alt={entry.memberName} />
                      <AvatarFallback>{getInitials(entry.memberName)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.memberName}</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(entry.time), 'h:mm a')}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={entry.type === 'check-in' ? 'default' : 'outline'}>
                    {entry.type === 'check-in' ? 'Check In' : 'Check Out'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {entry.location || 'Main Entrance'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(entry.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendanceTracker;
