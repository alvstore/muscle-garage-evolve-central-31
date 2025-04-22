import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Users, User, Filter, Plus, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ClassForm from "./ClassForm";
import ClassBookingForm from "./ClassBookingForm";
import { GymClass, ClassBooking } from "@/types/class";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const fetchClasses = async (): Promise<GymClass[]> => {
  return [{
    id: "1",
    name: "Morning Yoga",
    description: "Start your day with energizing yoga poses and breathing exercises",
    trainer: "Jane Smith",
    trainerName: "Jane Smith",
    trainerAvatar: "/placeholder.svg",
    trainerId: "t1",
    capacity: 15,
    enrolled: 8,
    duration: 60,
    startTime: "2025-04-15T06:30:00",
    endTime: "2025-04-15T07:30:00",
    type: "Yoga",
    location: "Studio 1",
    level: "all",
    difficulty: "all",
    status: "scheduled",
    recurring: true,
    recurringPattern: "MON,WED,FRI",
    createdAt: "2025-04-10T10:00:00",
    updatedAt: "2025-04-10T10:00:00"
  }, {
    id: "2",
    name: "HIIT Workout",
    description: "High-intensity interval training to boost metabolism and burn calories",
    trainer: "Mike Johnson",
    trainerName: "Mike Johnson",
    trainerId: "t2",
    capacity: 12,
    enrolled: 10,
    duration: 60,
    startTime: "2025-04-15T09:00:00",
    endTime: "2025-04-15T10:00:00",
    type: "HIIT",
    location: "Main Floor",
    level: "intermediate",
    difficulty: "intermediate",
    status: "scheduled",
    recurring: true,
    recurringPattern: "TUE,THU",
    createdAt: "2025-04-10T11:00:00",
    updatedAt: "2025-04-10T11:00:00"
  }, {
    id: "3",
    name: "Strength Training",
    description: "Build muscle and improve overall strength with weights",
    trainer: "Robert Chen",
    trainerName: "Robert Chen",
    trainerAvatar: "/placeholder.svg",
    trainerId: "t3",
    capacity: 8,
    enrolled: 6,
    duration: 90,
    startTime: "2025-04-15T17:00:00",
    endTime: "2025-04-15T18:30:00",
    type: "Strength",
    location: "Weight Room",
    level: "advanced",
    difficulty: "advanced",
    status: "scheduled",
    recurring: false,
    createdAt: "2025-04-10T12:00:00",
    updatedAt: "2025-04-10T12:00:00"
  }];
};

const ClassList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [classToBook, setClassToBook] = useState<GymClass | null>(null);
  const { user, userRole } = useAuth();
  
  const {
    data: classes,
    isLoading
  } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses
  });
  
  const handleCreateClass = () => {
    setSelectedClass(null);
    setIsOpen(true);
  };
  
  const handleEditClass = (classItem: GymClass) => {
    setSelectedClass(classItem);
    setIsOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedClass(null);
  };
  
  const handleBookClass = (classItem: GymClass) => {
    if (classItem.enrolled >= classItem.capacity) {
      toast.error("This class is already full. Please choose another class.");
      return;
    }
    
    if (new Date(classItem.startTime) < new Date()) {
      toast.error("Cannot book a class that has already started or ended.");
      return;
    }
    
    setClassToBook(classItem);
    setShowBookingForm(true);
  };
  
  const handleBookingComplete = (booking: ClassBooking) => {
    toast.success(`Successfully booked ${booking.classId}`);
    
    setShowBookingForm(false);
    setClassToBook(null);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };
  
  if (isLoading) {
    return <div className="space-y-4">
        {[1, 2, 3].map(i => <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>;
  }
  
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Class Schedule</h2>
          <Badge variant="outline" className="ml-2">
            {classes?.length || 0} Classes
          </Badge>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Classes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Class Type
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Yoga
                </DropdownMenuItem>
                <DropdownMenuItem>
                  HIIT
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Strength
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Difficulty
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  All Levels
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(userRole === 'admin' || userRole === 'staff') && (
            <Button size="sm" onClick={handleCreateClass}>
              <Plus className="h-4 w-4 mr-1" />
              Add Class
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {classes?.map(classItem => <Card key={classItem.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{classItem.name}</CardTitle>
                {(userRole === 'admin' || userRole === 'staff') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClass(classItem)}>
                        Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Bookings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Cancel Class
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {classItem.description || "No description provided."}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(parseISO(classItem.startTime), "EEE, MMM d")}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(parseISO(classItem.startTime), "h:mm a")} - 
                    {format(parseISO(classItem.endTime), "h:mm a")}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className={classItem.enrolled >= classItem.capacity ? "text-red-500 font-medium" : ""}>
                    {classItem.enrolled}/{classItem.capacity} enrolled
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.trainerName}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className={getDifficultyColor(classItem.difficulty)}>
                  {classItem.difficulty === "all" ? "All Levels" : classItem.difficulty}
                </Badge>
                
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {classItem.type}
                </Badge>
                
                {classItem.recurring && <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Recurring
                  </Badge>}
                
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {classItem.location}
                </Badge>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => handleBookClass(classItem)}
                  disabled={classItem.enrolled >= classItem.capacity || new Date(classItem.startTime) < new Date()}
                >
                  {classItem.enrolled >= classItem.capacity ? "Class Full" : 
                   new Date(classItem.startTime) < new Date() ? "Class Passed" : "Book Class"}
                </Button>
              </div>
            </CardContent>
          </Card>)}
      </div>

      <ClassForm open={isOpen} onOpenChange={setIsOpen} initialData={selectedClass} onClose={handleCloseDialog} />
      
      {classToBook && (
        <ClassBookingForm 
          gymClass={classToBook}
          open={showBookingForm} 
          onClose={() => setShowBookingForm(false)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>;
};

export default ClassList;
