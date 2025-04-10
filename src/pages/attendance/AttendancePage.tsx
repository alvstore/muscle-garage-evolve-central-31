
import { useState } from "react";
import { Container } from "@/components/ui/container";
import AttendanceTracker from "@/components/attendance/AttendanceTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { user } = useAuth();
  const { userRole } = usePermissions();
  
  const isMember = userRole === "member";
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? "My Attendance" : "Attendance Management"}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar sidebar - fixed width */}
          <div className="md:col-span-3">
            <Card className="dark:bg-[#2c2c44] bg-white overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <button 
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="calendar-container">
                  <div className="p-1">
                    <div className="calendar-days">
                      <div className="calendar-grid">
                        <div className="calendar-day-names">
                          {/* Day names rendered above */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Attendance content - flexible width */}
          <div className="md:col-span-9">
            <Card className="border dark:border-slate-800">
              <CardContent className="p-6">
                <AttendanceTracker date={selectedDate} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AttendancePage;
