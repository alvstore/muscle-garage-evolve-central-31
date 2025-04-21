
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import AttendanceTracker from "@/components/attendance/AttendanceTracker";
import { UserRound, Calendar, CheckCircle, UserCheck, XCircle, Clock } from "lucide-react";

// Mock attendance data
const mockAttendanceData = [
  { 
    memberId: '1', 
    memberName: 'John Doe', 
    checkInTime: '2023-05-01T08:30:00Z',
    checkOutTime: '2023-05-01T10:15:00Z',
    accessMethod: 'rfid',
    branch: 'Main Branch',
    status: 'completed'
  },
  { 
    memberId: '2', 
    memberName: 'Jane Smith', 
    checkInTime: '2023-05-01T09:15:00Z',
    checkOutTime: null,
    accessMethod: 'fingerprint',
    branch: 'Downtown',
    status: 'active'
  },
  // Add more mock data as needed
];

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [date, setDate] = useState<Date>(new Date());
  const [branch, setBranch] = useState<string>('all');

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Attendance Manager</h1>
          <div className="flex items-center space-x-2">
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Branch</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="uptown">Uptown</SelectItem>
              </SelectContent>
            </Select>
            <DatePicker date={date} setDate={setDate} />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="today" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="absent" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Absent
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Today's Attendance</CardTitle>
                    <CardDescription>Track members' check-ins and check-outs in real-time</CardDescription>
                  </div>
                  <Button className="flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    Manual Check-in
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceTracker 
                  date={date}
                  data={mockAttendanceData} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>View past attendance records and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTracker 
                  date={date}
                  data={mockAttendanceData} 
                  historyMode 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="absent">
            <Card>
              <CardHeader>
                <CardTitle>Absent Members</CardTitle>
                <CardDescription>View members who haven't checked in today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Absent members will be shown here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>Attendance trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Attendance analytics will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default AttendancePage;
