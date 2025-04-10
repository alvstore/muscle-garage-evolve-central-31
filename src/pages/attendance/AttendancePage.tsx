
import { useState } from "react";
import { Container } from "@/components/ui/container";
import AttendanceTracker from "@/components/attendance/AttendanceTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <AttendanceTracker date={selectedDate} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AttendancePage;
