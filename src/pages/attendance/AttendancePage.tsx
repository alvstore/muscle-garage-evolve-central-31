
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import AttendanceTracker from '@/components/attendance/AttendanceTracker';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AttendanceEntry } from '@/types/class';

const AttendancePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('all');

  // Mock data for attendance
  const attendanceData: AttendanceEntry[] = [
    {
      memberId: '1',
      memberName: 'John Doe',
      time: '08:15 AM',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'on-time'
    },
    {
      memberId: '2',
      memberName: 'Jane Smith',
      time: '09:30 AM',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Mobile App',
      status: 'on-time'
    },
    {
      memberId: '3',
      memberName: 'Mike Johnson',
      time: '10:45 AM',
      type: 'check-in',
      location: 'Back Entrance',
      device: 'Access Card',
      status: 'late'
    },
    {
      memberId: '1',
      memberName: 'John Doe',
      time: '11:30 AM',
      type: 'check-out',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'completed'
    },
    {
      memberId: '4',
      memberName: 'Sarah Wilson',
      time: '12:15 PM',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Access Card',
      status: 'on-time'
    },
    {
      memberId: '2',
      memberName: 'Jane Smith',
      time: '01:45 PM',
      type: 'check-out',
      location: 'Main Entrance',
      device: 'Mobile App',
      status: 'completed'
    }
  ];

  // Filter attendance data based on selected filter
  const filteredData = filter === 'all' 
    ? attendanceData 
    : attendanceData.filter(entry => entry.type === filter);

  return (
    <Container>
      <div className="py-6 space-y-6">
        <h1 className="text-3xl font-bold">Attendance</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Filter</CardTitle>
            <CardDescription>Select a date and filter options to view attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  id="date"
                  date={date}
                  onSelect={setDate}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">Filter</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger id="filter">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="check-in">Check-ins</SelectItem>
                    <SelectItem value="check-out">Check-outs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Log</CardTitle>
            <CardDescription>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceTracker data={filteredData} date={date} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AttendancePage;
