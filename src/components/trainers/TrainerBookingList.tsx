
import React from 'react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export interface GymClass {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  location?: string;
  status?: string;
}

export type ClassDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

interface TrainerBookingListProps {
  classes?: any[];
  isLoading?: boolean;
  onClassClick?: (classId: string) => void;
  trainerId: string;
}

const TrainerBookingList: React.FC<TrainerBookingListProps> = ({ 
  classes = [], 
  isLoading = false,
  onClassClick = () => {},
  trainerId
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No classes scheduled.</p>
      </div>
    );
  }

  // Process classes into groups based on date
  const groupedClasses: Record<string, any[]> = {};
  
  classes.forEach(gymClass => {
    // Ensure needed properties exist
    const classObj = {
      ...gymClass,
      startTime: gymClass.start_time,
      endTime: gymClass.end_time
    };

    try {
      const date = parseISO(classObj.start_time);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!groupedClasses[dateStr]) {
        groupedClasses[dateStr] = [];
      }
      
      groupedClasses[dateStr].push(classObj);
    } catch (error) {
      console.error('Error parsing date:', error, classObj);
    }
  });

  // Sort dates
  const sortedDates = Object.keys(groupedClasses).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map(dateStr => {
        const date = parseISO(dateStr);
        let dateLabel = format(date, 'EEEE, MMMM d');
        
        if (isToday(date)) {
          dateLabel = `Today (${format(date, 'MMMM d')})`;
        } else if (isTomorrow(date)) {
          dateLabel = `Tomorrow (${format(date, 'MMMM d')})`;
        }
        
        return (
          <div key={dateStr} className="space-y-3">
            <h3 className="font-semibold text-md">{dateLabel}</h3>
            <div className="space-y-3">
              {groupedClasses[dateStr].map(gymClass => (
                <Card 
                  key={gymClass.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onClassClick(gymClass.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold">{gymClass.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(parseISO(gymClass.start_time), 'h:mm a')} - {format(parseISO(gymClass.end_time), 'h:mm a')}</span>
                        </div>
                        {gymClass.location && (
                          <div className="flex items-center text-sm text-muted-foreground gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{gymClass.location}</span>
                          </div>
                        )}
                      </div>
                      <Badge>{gymClass.type}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{gymClass.enrolled || 0}/{gymClass.capacity} enrolled</span>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainerBookingList;
