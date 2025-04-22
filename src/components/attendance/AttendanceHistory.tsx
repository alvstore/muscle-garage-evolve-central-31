
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format, parseISO, isWithinInterval, subDays } from "date-fns";
import { BarChart, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AttendanceChart from '@/components/dashboard/AttendanceChart';

// Mock attendance data for demonstration
const mockAttendanceData = [
  {
    id: '1',
    date: '2025-04-15T09:30:00Z',
    checkIn: '2025-04-15T09:30:00Z',
    checkOut: '2025-04-15T11:45:00Z',
    duration: '2h 15m',
    location: 'Main Entrance',
    method: 'Access Card'
  },
  {
    id: '2',
    date: '2025-04-17T18:15:00Z',
    checkIn: '2025-04-17T18:15:00Z',
    checkOut: '2025-04-17T20:00:00Z',
    duration: '1h 45m',
    location: 'Main Entrance',
    method: 'Access Card'
  },
  {
    id: '3',
    date: '2025-04-19T10:00:00Z',
    checkIn: '2025-04-19T10:00:00Z',
    checkOut: '2025-04-19T12:30:00Z',
    duration: '2h 30m',
    location: 'Side Entrance',
    method: 'Fingerprint'
  },
  {
    id: '4',
    date: '2025-04-21T08:45:00Z',
    checkIn: '2025-04-21T08:45:00Z',
    checkOut: '2025-04-21T10:15:00Z',
    duration: '1h 30m',
    location: 'Main Entrance',
    method: 'Access Card'
  }
];

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  // Filter attendance data based on selected date range
  const filteredAttendance = mockAttendanceData.filter(item => {
    if (!dateRange?.from || !dateRange?.to) return true;
    
    const itemDate = new Date(item.date);
    return isWithinInterval(itemDate, { 
      start: dateRange.from, 
      end: dateRange.to 
    });
  });

  // Calculate monthly attendance data for chart
  const getChartData = () => {
    // Group by day and count
    const attendanceByDay = filteredAttendance.reduce((acc, curr) => {
      const day = format(parseISO(curr.date), 'yyyy-MM-dd');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format needed for charts
    return Object.entries(attendanceByDay).map(([date, count]) => ({
      date,
      count
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>My Attendance History</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'chart' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('chart')}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Chart
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'list' ? (
          filteredAttendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(record.checkIn), 'hh:mm a')}</TableCell>
                    <TableCell>{format(new Date(record.checkOut), 'hh:mm a')}</TableCell>
                    <TableCell>{record.duration}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No attendance records</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no attendance records in the selected date range.
              </p>
            </div>
          )
        ) : (
          <div className="h-[300px] mt-4">
            <AttendanceChart data={getChartData()} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
