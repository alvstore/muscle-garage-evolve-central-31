import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin, MoreVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { GymClass } from '@/types/class';
import { Skeleton } from '@/components/ui/skeleton';
import { useClasses } from '@/hooks/use-classes';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import TrainerClassDetails from './TrainerClassDetails';

interface TrainerClassListProps {
  trainerId: string;
}

const TrainerClassList: React.FC<TrainerClassListProps> = ({ trainerId }) => {
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const { classes, isLoading } = useClasses();
  
  // Filter classes for this trainer only
  const trainerClasses = classes?.filter(c => c.trainerId === trainerId) || [];
  
  const handleViewDetails = (classItem: GymClass) => {
    setSelectedClass(classItem);
  };
  
  const handleCloseDetails = () => {
    setSelectedClass(null);
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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
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
          </Card>
        ))}
      </div>
    );
  }
  
  if (trainerClasses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <CardTitle>No Classes Created</CardTitle>
          <p className="text-muted-foreground">
            You haven't created any classes yet. Use the "Create New Class" button to add your first class.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid gap-4">
        {trainerClasses.map(classItem => (
          <Card key={classItem.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{classItem.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(classItem)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      View Attendees
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit Class
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel Class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className={getDifficultyColor(classItem.difficulty)}>
                  {classItem.difficulty === "all" ? "All Levels" : classItem.difficulty}
                </Badge>
                
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {classItem.type}
                </Badge>
                
                {classItem.recurring && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Recurring
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewDetails(classItem)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedClass && (
        <TrainerClassDetails 
          gymClass={selectedClass}
          isOpen={!!selectedClass}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default TrainerClassList;
