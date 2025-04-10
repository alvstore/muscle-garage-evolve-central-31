
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, subMonths, getDaysInMonth, getDay, getMonth, getYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TrainerAttendancePage = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  
  // Generate mock attendance data
  const generateAttendanceData = () => {
    const today = new Date();
    const monthDate = new Date(selectedMonth);
    const daysInMonth = getDaysInMonth(monthDate);
    const attendanceData = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(getYear(monthDate), getMonth(monthDate), i);
      
      // Skip future dates
      if (date > today) continue;
      
      // Randomly generate status with preference for present
      const isWeekend = getDay(date) === 0 || getDay(date) === 6;
      const randomValue = Math.random();
      let status = "present";
      
      if (isWeekend) {
        status = "off";
      } else if (randomValue < 0.1) { // 10% chance of absence
        status = "absent";
      } else if (randomValue < 0.15) { // 5% chance of half day
        status = "half-day";
      }
      
      attendanceData.push({
        date,
        status
      });
    }
    
    return attendanceData.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  const attendanceData = generateAttendanceData();
  
  // Group attendance data by week
  const groupByWeek = () => {
    const grouped: any = {};
    
    attendanceData.forEach(item => {
      const weekStart = format(item.date, 'yyyy-MM-dd');
      if (!grouped[weekStart]) {
        grouped[weekStart] = [];
      }
      grouped[weekStart].push(item);
    });
    
    return Object.keys(grouped).map(week => ({
      week,
      items: grouped[week]
    }));
  };
  
  const weeks = groupByWeek();
  
  // Calculate attendance statistics
  const calculateStats = () => {
    const nonWeekendDays = attendanceData.filter(item => item.status !== "off");
    const present = nonWeekendDays.filter(item => item.status === "present").length;
    const halfDays = nonWeekendDays.filter(item => item.status === "half-day").length;
    const absent = nonWeekendDays.filter(item => item.status === "absent").length;
    const total = nonWeekendDays.length;
    
    const presentPercentage = total ? Math.round((present + (halfDays * 0.5)) / total * 100) : 0;
    
    return {
      present,
      halfDays,
      absent,
      total,
      presentPercentage
    };
  };
  
  const stats = calculateStats();
  
  // Generate month options for select
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = subMonths(today, i);
      options.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy')
      });
    }
    
    return options;
  };
  
  const monthOptions = getMonthOptions();
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "half-day":
        return <Badge className="bg-yellow-500">Half Day</Badge>;
      case "off":
        return <Badge variant="outline">Weekend/Holiday</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold">{stats.present}</div>
                <p className="text-sm text-muted-foreground">Present Days</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold">{stats.halfDays}</div>
                <p className="text-sm text-muted-foreground">Half Days</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold">{stats.absent}</div>
                <p className="text-sm text-muted-foreground">Absent Days</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold">{stats.presentPercentage}%</div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance History</h2>
          <div className="w-48">
            <Select 
              value={selectedMonth} 
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {attendanceData.length > 0 ? (
                    <div className="space-y-2">
                      {attendanceData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span>{format(item.date, 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          <div>
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No attendance records found for this month
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-sm font-medium py-1">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const monthDate = new Date(selectedMonth);
                    const daysInMonth = getDaysInMonth(monthDate);
                    const firstDayOfMonth = new Date(getYear(monthDate), getMonth(monthDate), 1);
                    const startingDayOfWeek = getDay(firstDayOfMonth);
                    
                    const days = [];
                    
                    // Add empty cells for days before the 1st of the month
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="h-16 p-1" />);
                    }
                    
                    // Add cells for each day of the month
                    for (let i = 1; i <= daysInMonth; i++) {
                      const date = new Date(getYear(monthDate), getMonth(monthDate), i);
                      const attendance = attendanceData.find(a => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
                      const today = new Date();
                      const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                      const isFuture = date > today;
                      
                      days.push(
                        <div
                          key={`day-${i}`}
                          className={`h-16 p-1 border rounded flex flex-col ${
                            isToday ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="text-right text-sm font-medium mb-1">{i}</div>
                          
                          {isFuture ? (
                            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                              Upcoming
                            </div>
                          ) : attendance ? (
                            <div className="flex-1 flex items-center justify-center">
                              {attendance.status === 'present' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                              {attendance.status === 'absent' && <XCircle className="h-5 w-5 text-red-500" />}
                              {attendance.status === 'half-day' && <CheckCircle2 className="h-5 w-5 text-yellow-500" />}
                              {attendance.status === 'off' && <span className="text-xs text-muted-foreground">Off</span>}
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                              No data
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center pt-2 border-t">
                  <div className="flex items-center space-x-1 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                    <span>Half Day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerAttendancePage;
