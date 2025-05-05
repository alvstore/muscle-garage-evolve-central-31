
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Loader2, 
  Plus, 
  Users, 
  Clock, 
  User as UserIcon,
  MapPin
} from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, eachDayOfInterval, isSameDay, isBefore } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/use-branch";
import { Badge } from "@/components/ui/badge";

interface ClassSchedule {
  id: string;
  name: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  enrolled: number;
  trainer_id: string;
  branch_id: string;
  status: string;
  trainer: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

const ClassSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassSchedule[]>([]);
  const [view, setView] = useState("week");
  const [date, setDate] = useState<{from: Date; to: Date}>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [filterType, setFilterType] = useState<string>("all");
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        
        if (!branchId) {
          return;
        }
        
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            trainer:trainer_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('branch_id', branchId)
          .gte('start_time', date.from.toISOString())
          .lte('start_time', date.to.toISOString());
        
        if (error) throw error;
        
        setClasses(data || []);
        setFilteredClasses(data || []);
        
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClasses();
  }, [branchId, date]);
  
  useEffect(() => {
    if (filterType === "all") {
      setFilteredClasses(classes);
    } else {
      setFilteredClasses(classes.filter(c => c.type === filterType));
    }
  }, [filterType, classes]);
  
  const classTypes = Array.from(new Set(classes.map(c => c.type))).filter(Boolean);
  
  // Get dates for week view
  const weekDates = eachDayOfInterval({
    start: startOfWeek(date.from, { weekStartsOn: 1 }),
    end: addDays(startOfWeek(date.from, { weekStartsOn: 1 }), 6)
  });
  
  // Group classes by day
  const classesByDay = weekDates.map(day => ({
    date: day,
    classes: filteredClasses.filter(c => 
      isSameDay(new Date(c.start_time), day)
    )
  }));
  
  // Get time slots (from 6am to 10pm)
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6);
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Schedule</h1>
            <p className="text-muted-foreground">
              View and manage all fitness classes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => navigate('/classes/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 pb-2">
            <CardTitle>Class Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <DatePickerWithRange
                date={date}
                setDate={setDate}
              />
              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by class type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {classTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="ml-auto flex gap-2">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  Available
                </Badge>
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                  Almost Full
                </Badge>
                <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                  Full
                </Badge>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <TabsContent value="week" className="mt-0">
                <div className="grid grid-cols-7 gap-1">
                  {weekDates.map((day, i) => (
                    <div key={i} className="text-center py-2 font-medium border-b">
                      <div>{format(day, 'EEE')}</div>
                      <div className={`text-sm ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto' : ''}`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}
                  
                  {classesByDay.map((dayData, dayIndex) => (
                    <div key={dayIndex} className="border-r min-h-[600px] relative">
                      {dayData.classes.map((classItem, classIndex) => {
                        const startTime = new Date(classItem.start_time);
                        const endTime = new Date(classItem.end_time);
                        const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                        const endHour = endTime.getHours() + endTime.getMinutes() / 60;
                        const duration = endHour - startHour;
                        
                        const isPast = isBefore(endTime, new Date());
                        const isFull = classItem.enrolled >= classItem.capacity;
                        const isAlmostFull = !isFull && classItem.enrolled >= (classItem.capacity * 0.8);
                        
                        // Calculate position
                        const top = (startHour - 6) * 60; // 6am is the start time, 60px per hour
                        const height = duration * 60;
                        
                        let bgColor = 'bg-green-50 border-green-200 hover:bg-green-100';
                        if (isFull) bgColor = 'bg-red-50 border-red-200 hover:bg-red-100';
                        else if (isAlmostFull) bgColor = 'bg-amber-50 border-amber-200 hover:bg-amber-100';
                        if (isPast) bgColor = 'bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-60';
                        
                        return (
                          <div 
                            key={classItem.id}
                            style={{ 
                              top: `${top}px`, 
                              height: `${height}px`,
                            }}
                            className={`absolute left-0 right-0 mx-1 border rounded-md p-1 overflow-hidden ${bgColor} cursor-pointer transition-colors`}
                            onClick={() => navigate(`/classes/${classItem.id}`)}
                          >
                            <div className="text-xs font-medium truncate">{classItem.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(startTime, 'h:mma')}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {classItem.location}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {classItem.enrolled}/{classItem.capacity}
                            </div>
                            {classItem.trainer && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <UserIcon className="h-3 w-3 mr-1" />
                                {classItem.trainer.full_name}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Time indicators */}
                      {timeSlots.map((hour) => (
                        <div 
                          key={hour} 
                          className="border-t h-[60px] text-xs text-muted-foreground"
                          style={{ marginTop: hour === 6 ? 0 : undefined }}
                        >
                          <div className="px-1">{hour % 12 === 0 ? '12' : hour % 12}{hour < 12 ? 'am' : 'pm'}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="day">
              <p className="text-muted-foreground text-center py-16">
                Day view will be implemented soon.
                <br />
                Currently showing day view for {format(date.from, "MMMM d, yyyy")}
              </p>
            </TabsContent>
            
            <TabsContent value="month">
              <p className="text-muted-foreground text-center py-16">
                Month view will be implemented soon.
                <br />
                Currently showing month view for {format(date.from, "MMMM yyyy")}
              </p>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ClassSchedulePage;
