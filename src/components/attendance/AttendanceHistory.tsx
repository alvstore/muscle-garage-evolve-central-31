
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceRecord {
  id: string;
  check_in: string;
  check_out?: string;
  duration_minutes?: number;
  status: 'checked_in' | 'checked_out' | 'missed' | 'on_leave';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface DateRange {
  from: Date;
  to?: Date;
}

interface AttendanceHistoryProps {
  memberId?: string;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ memberId }) => {
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!memberId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('member_attendance')
          .select('*')
          .eq('member_id', memberId)
          .gte('check_in', date.from.toISOString())
          .lte('check_in', date.to?.toISOString() || new Date().toISOString())
          .order('check_in', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        setAttendanceData(data || []);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [memberId, date]);
  
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleDateChange = (newDate: DateRange) => {
    // Ensure the 'to' date is defined, defaulting to 'from' if not provided
    const toDate = newDate.to || newDate.from;
    
    setDate({
      from: newDate.from,
      to: toDate
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>View detailed attendance records</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange
              date={date}
              setDate={setDate}
              onDateChange={handleDateChange}
            />
            <Button size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              This Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading attendance data...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500 py-4">
                    {error}
                  </TableCell>
                </TableRow>
              ) : attendanceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    No attendance records found for the selected period
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.check_in).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatTime(record.check_in)}
                    </TableCell>
                    <TableCell>
                      {record.check_out ? formatTime(record.check_out) : 'Still checked in'}
                    </TableCell>
                    <TableCell>
                      {record.duration_minutes ? formatDuration(record.duration_minutes) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
