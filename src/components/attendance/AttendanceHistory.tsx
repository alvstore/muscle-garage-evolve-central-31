
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data - replace with real data from API
const mockAttendanceData = [
  { id: "1", date: "2023-06-15", checkin: "09:15 AM", checkout: "06:30 PM", duration: "9h 15m" },
  { id: "2", date: "2023-06-14", checkin: "09:00 AM", checkout: "05:45 PM", duration: "8h 45m" },
  { id: "3", date: "2023-06-13", checkin: "09:20 AM", checkout: "06:00 PM", duration: "8h 40m" },
  { id: "4", date: "2023-06-12", checkin: "08:55 AM", checkout: "06:15 PM", duration: "9h 20m" },
  { id: "5", date: "2023-06-09", checkin: "09:05 AM", checkout: "05:30 PM", duration: "8h 25m" },
];

interface DateRange {
  from: Date;
  to?: Date;
}

interface AttendanceHistoryProps {
  memberId?: string;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ memberId }) => {
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  
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
            <DateRangePicker
              date={date}
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
              {mockAttendanceData.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkin}</TableCell>
                  <TableCell>{record.checkout}</TableCell>
                  <TableCell>{record.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
