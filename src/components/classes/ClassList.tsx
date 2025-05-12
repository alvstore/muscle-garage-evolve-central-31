import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { Calendar, Clock, Users, User, Filter, Plus, Search, AlertCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClassForm from "./ClassForm";
import ClassBookingForm from "./ClassBookingForm";
import { GymClass, ClassBooking } from "@/types/class";
import { useAuth } from "@/hooks/use-auth";
import { useBranch } from "@/hooks/use-branch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fetchClasses = async (branchId?: string): Promise<GymClass[]> => {
  try {
    let query = supabase
      .from('classes')
      .select(`
        *,
        trainer_id
      `)
      .order('start_time', { ascending: true });
      
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching classes:', error);
      throw new Error(error.message);
    }
    
    // Fetch trainer names separately if needed
    const trainerIds = data.map(item => item.trainer_id).filter(Boolean);
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      startTime: item.start_time,
      endTime: item.end_time,
      capacity: item.capacity,
      enrolled: item.enrolled || 0,
      trainer: 'Unassigned', // Will be updated in the component if needed
      trainerName: undefined,
      trainerAvatar: undefined,
      trainerId: item.trainer_id,
      difficulty: item.difficulty || 'all',
      type: item.type,
      location: item.location,
      status: item.status,
      level: item.level || 'all',
      duration: new Date(item.end_time).getTime() - new Date(item.start_time).getTime(),
      recurring: item.recurring || false,
      recurringPattern: item.recurring_pattern,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) || [];
  } catch (error: any) {
    console.error('Error in fetchClasses:', error);
    toast.error(`Failed to fetch classes: ${error.message}`);
    return [];
  }
};

interface ClassListProps {
  onClassSelect?: (classItem: GymClass) => void;
  hideActions?: boolean;
  limit?: number;
  filterStatus?: 'all' | 'upcoming' | 'today' | 'past';
}

// Function to fetch trainer data
const fetchTrainers = async (trainerIds: string[]): Promise<Record<string, any>> => {
  try {
    if (!trainerIds.length) return {};
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', trainerIds);
      
    if (error) {
      console.error('Error fetching trainers:', error);
      return {};
    }
    
    // Create a map of trainer id to trainer data
    return data.reduce((acc, trainer) => {
      acc[trainer.id] = trainer;
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error in fetchTrainers:', error);
    return {};
  }
};

// Function to fetch class types data
const fetchClassTypes = async (typeIds: string[]): Promise<Record<string, any>> => {
  try {
    if (!typeIds.length) return {};
    
    const { data, error } = await supabase
      .from('class_types')
      .select('id, name, level, difficulty')
      .in('id', typeIds);
      
    if (error) {
      console.error('Error fetching class types:', error);
      return {};
    }
    
    // Create a map of class type id to class type data
    return data.reduce((acc, type) => {
      acc[type.id] = type;
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error in fetchClassTypes:', error);
    return {};
  }
};

const ClassList = ({ onClassSelect, hideActions = false, limit, filterStatus = 'all' }: ClassListProps) => {
  const [showClassForm, setShowClassForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [localFilterStatus, setLocalFilterStatus] = useState<string>(filterStatus);
  const [trainers, setTrainers] = useState<Record<string, any>>({});
  const [classTypes, setClassTypes] = useState<Record<string, any>>({});
  
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  // Fetch classes for the current branch
  const { data: classes = [], isLoading, error, refetch } = useQuery<GymClass[]>({
    queryKey: ['classes', branchId],
    queryFn: () => fetchClasses(branchId),
    enabled: !!branchId
  });
  
  // Fetch trainers and class types when classes change
  useEffect(() => {
    if (classes.length > 0) {
      // Fetch trainers
      const trainerIds = classes
        .map(classItem => classItem.trainerId)
        .filter(Boolean) as string[];
      
      if (trainerIds.length > 0) {
        fetchTrainers(trainerIds).then(trainerData => {
          setTrainers(trainerData);
        });
      }
      
      // Fetch class types
      const typeIds = classes
        .map(classItem => classItem.type)
        .filter(Boolean) as string[];
      
      if (typeIds.length > 0) {
        fetchClassTypes(typeIds).then(typeData => {
          setClassTypes(typeData);
        });
      }
    }
  }, [classes]);
  
  // Extract unique class types for filter
  const uniqueClassTypes = Array.from(new Set(classes.map(c => c.type))).filter(Boolean);
  
  // Filter classes based on search term and filters
  const filteredClasses = classes.filter(gymClass => {
    const matchesSearch = 
      gymClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gymClass.description && gymClass.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gymClass.trainer && gymClass.trainer.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = filterType === 'all' || gymClass.type === filterType;
    
    // Apply status filter based on either prop or local state
    const statusToUse = filterStatus !== 'all' ? filterStatus : localFilterStatus;
    
    let matchesStatus = true;
    if (statusToUse === 'upcoming') {
      matchesStatus = isAfter(new Date(gymClass.startTime), new Date());
    } else if (statusToUse === 'today') {
      matchesStatus = isToday(new Date(gymClass.startTime));
    } else if (statusToUse === 'past') {
      matchesStatus = isBefore(new Date(gymClass.endTime), new Date());
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Apply limit if specified
  const displayedClasses = limit ? filteredClasses.slice(0, limit) : filteredClasses;
  
  const handleCreateClass = () => {
    setSelectedClass(null);
    setShowClassForm(true);
  };
  
  const handleEditClass = (classItem: GymClass) => {
    setSelectedClass(classItem);
    setShowClassForm(true);
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
    
    setSelectedClass(classItem);
    setShowBookingForm(true);
  };
  
  const handleBookingComplete = (booking: ClassBooking) => {
    toast.success("Class booked successfully!");
    setShowBookingForm(false);
    refetch(); // Refresh class list to update enrolled count
  };
  
  const handleCloseDialog = () => {
    setShowClassForm(false);
    setSelectedClass(null);
  };
  
  const handleClassSelect = (classItem: GymClass) => {
    if (onClassSelect) {
      onClassSelect(classItem);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <div className="space-y-4">
      {!hideActions && (
        <>
          <div className="flex justify-between items-center">
            <CardTitle>Classes</CardTitle>
            
            {(user?.role === 'admin' || user?.role === 'trainer') && (
              <Button onClick={handleCreateClass} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            )}
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueClassTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={localFilterStatus} onValueChange={setLocalFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="bg-muted p-4 flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full flex items-center justify-center text-destructive p-8">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error loading classes
          </div>
        ) : displayedClasses.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground p-8">
            {classes.length === 0 ? "No classes found" : "No classes match your filters"}
          </div>
        ) : (
          // Class cards
          displayedClasses.map((classItem) => (
            <Card key={classItem.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>
                      {classTypes[classItem.type]?.name || classItem.type}
                    </CardDescription>
                  </div>
                  
                  {!hideActions && (user?.role === 'admin' || user?.role === 'trainer') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClass(classItem)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {classItem.description || "No description available"}
                </p>
                
                {/* Trainer information */}
                {classItem.trainerId && trainers[classItem.trainerId] && (
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={trainers[classItem.trainerId].avatar_url} alt={trainers[classItem.trainerId].full_name} />
                      <AvatarFallback>{trainers[classItem.trainerId].full_name?.charAt(0) || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{trainers[classItem.trainerId].full_name}</div>
                      <div className="text-xs text-muted-foreground">Trainer</div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(parseISO(classItem.startTime), 'MMM d, yyyy')}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(parseISO(classItem.startTime), 'h:mm a')} - {format(parseISO(classItem.endTime), 'h:mm a')}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {classItem.enrolled} / {classItem.capacity}
                  </Badge>
                  
                  {(classItem.difficulty !== 'all' || (classTypes[classItem.type]?.difficulty && classTypes[classItem.type]?.difficulty !== 'all')) && (
                    <Badge variant="secondary" className={`${getDifficultyColor(classItem.difficulty !== 'all' ? classItem.difficulty : classTypes[classItem.type]?.difficulty)}`}>
                      {classItem.difficulty !== 'all' ? classItem.difficulty : classTypes[classItem.type]?.difficulty}
                    </Badge>
                  )}
                  
                  {(classItem.level !== 'all' || (classTypes[classItem.type]?.level && classTypes[classItem.type]?.level !== 'all')) && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Level: {classItem.level !== 'all' ? classItem.level : classTypes[classItem.type]?.level}
                    </Badge>
                  )}
                  
                  {classItem.recurring && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Recurring
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={classItem.trainerAvatar || ""} alt={classItem.trainer} />
                    <AvatarFallback>{classItem.trainer?.charAt(0) || "T"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{classItem.trainer}</span>
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted p-4 flex justify-between">
                {onClassSelect ? (
                  <Button onClick={() => handleClassSelect(classItem)} variant="secondary">
                    Select
                  </Button>
                ) : (
                  <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                    {classItem.status}
                  </Badge>
                )}
                
                {!hideActions && (
                  <Button 
                    onClick={() => handleBookClass(classItem)}
                    disabled={classItem.enrolled >= classItem.capacity || new Date(classItem.startTime) < new Date()}
                  >
                    Book Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Class Form Dialog */}
      {showClassForm && (
        <ClassForm
          open={showClassForm}
          onOpenChange={setShowClassForm}
          initialData={selectedClass}
          onClose={handleCloseDialog}
        />
      )}
      
      {/* Booking Form Dialog */}
      {showBookingForm && selectedClass && (
        <ClassBookingForm
          gymClass={selectedClass}
          open={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default ClassList;
