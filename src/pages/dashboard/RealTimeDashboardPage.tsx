import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, subMinutes } from 'date-fns';
import { AttendanceEntry, AttendanceType } from '@/types/attendance';

const RealTimeDashboardPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Metric value="68">
            <Progress value={68} max={100} className="h-1 w-full bg-secondary mt-2" />
          </Metric>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes in Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Metric value="3">
            <Progress value={75} max={4} className="h-1 w-full bg-secondary mt-2" />
          </Metric>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Sign-ups Today</CardTitle>
        </CardHeader>
        <CardContent>
          <Metric value="12">
            <Progress value={60} max={20} className="h-1 w-full bg-secondary mt-2" />
          </Metric>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Today</CardTitle>
        </CardHeader>
        <CardContent>
          <Metric value="$2,450">
            <Progress value={82} max={3000} className="h-1 w-full bg-secondary mt-2" />
          </Metric>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ScrollArea className="rounded-md border">
            <div className="p-4">
              {mockRecentAttendance.map((attendance, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${attendance.memberName}.png`} />
                      <AvatarFallback>{attendance.memberName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{attendance.memberName}</p>
                      <p className="text-xs text-gray-500">{format(new Date(attendance.time), "h:mm a")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{attendance.type === "check-in" ? "Check In" : "Check Out"}</p>
                    <p className="text-xs text-gray-500">{attendance.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Fix the mock data to use the correct AttendanceType
const mockRecentAttendance: AttendanceEntry[] = [
  {
    memberId: "mem1",
    memberName: "John Doe",
    time: format(subMinutes(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "check-in", // Use the correct type value
    location: "Main Entrance",
    device: "Front Desk Scanner",
    status: "Success",
  },
  {
    memberId: "mem2",
    memberName: "Sarah Johnson",
    time: format(subMinutes(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "check-in", // Use the correct type value
    location: "South Entrance",
    device: "Mobile App",
    status: "Success",
  },
  {
    memberId: "mem3",
    memberName: "Robert Chen",
    time: format(subMinutes(new Date(), 25), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "check-out", // Use the correct type value
    location: "Main Entrance",
    device: "Front Desk Scanner",
    status: "Success",
  },
  {
    memberId: "mem4",
    memberName: "Emma Williams",
    time: format(subMinutes(new Date(), 40), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "check-in", // Use the correct type value
    location: "East Entrance",
    device: "Biometric Scanner",
    status: "Success",
  },
  {
    memberId: "mem5",
    memberName: "David Lee",
    time: format(subMinutes(new Date(), 55), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "check-out", // Use the correct type value
    location: "Main Entrance",
    device: "Front Desk Scanner",
    status: "Success",
  }
];

export default RealTimeDashboardPage;
