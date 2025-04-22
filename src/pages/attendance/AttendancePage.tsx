
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import AttendanceTracker from "@/components/attendance/AttendanceTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { userRole } = usePermissions();
  
  const isMember = userRole === "member";

  useEffect(() => {
    // Simulate fetching attendance data
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, let's create some mock data based on the selected date
        const mockData = generateMockAttendanceData(selectedDate);
        setTimeout(() => {
          setAttendanceData(mockData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceData([]);
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedDate, user?.id]);

  // Generate mock attendance data for demo purposes
  const generateMockAttendanceData = (date: Date) => {
    // Only generate data for current date and past 7 days
    const now = new Date();
    const selected = new Date(date);
    
    // Set hours to 0 for date comparison
    now.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    // If selected date is in the future, return empty array
    if (selected > now) {
      return [];
    }
    
    // Generate mock data
    const entries = [];
    
    // Check-in entry (current user)
    entries.push({
      memberId: user?.id || 'unknown',
      memberName: user?.name || 'Current User',
      time: new Date(selected).setHours(9, 30, 0).toString(),
      type: 'check-in' as const,
      location: 'Main Entrance',
      device: 'Access Card',
      status: 'active'
    });
    
    // Add check-out if not today
    if (selected.getTime() !== now.getTime()) {
      entries.push({
        memberId: user?.id || 'unknown',
        memberName: user?.name || 'Current User',
        time: new Date(selected).setHours(11, 45, 0).toString(),
        type: 'check-out' as const,
        location: 'Main Entrance',
        device: 'Access Card',
        status: 'active'
      });
    }
    
    return entries;
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="dark:bg-background/50 bg-white shadow-sm">
              <CardContent className="pt-6 px-0 mx-0 my-0 py-[11px]">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <button onClick={nextMonth} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day} className="text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={date => date && setSelectedDate(date)} 
                  month={currentMonth} 
                  onMonthChange={setCurrentMonth} 
                  className="rounded-md border-0 p-0" 
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-muted text-accent-foreground",
                    day: "h-9 w-9 p-0 font-normal text-sm",
                    table: "border-collapse",
                    head_cell: "text-xs font-medium hidden",
                    cell: "p-0 text-center"
                  }} 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AttendanceTracker data={attendanceData} date={selectedDate} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AttendancePage;
