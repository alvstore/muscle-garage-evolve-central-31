
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useMemberAttendance } from '@/hooks/use-member-attendance';
import { AttendanceEntry } from '@/types/attendance';

interface AttendanceSectionProps {
  attendanceData: AttendanceEntry[];
}

const AttendanceSection = ({ attendanceData }: AttendanceSectionProps) => {
  // Filter attendance data to only show the current member's data
  const memberAttendance = useMemberAttendance(attendanceData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {memberAttendance.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memberAttendance.slice(0, 5).map((entry, index) => (
              <div key={entry.id || index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {entry.type === "check-in" ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <Calendar className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {entry.type === "check-in" ? "Check-in" : "Check-out"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.time && format(parseISO(entry.time), "EEE, MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {entry.time && format(parseISO(entry.time), "h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.location || "Main Gym"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
