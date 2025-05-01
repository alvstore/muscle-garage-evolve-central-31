
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GymClass, ClassDifficulty } from './TrainerBookingList';

interface TrainerClassListProps {
  classes: any[];
  isLoading: boolean;
  onClassClick: (classId: string) => void;
  onEditClass?: (classId: string) => void;
  onCancelClass?: (classId: string) => void;
}

const TrainerClassList: React.FC<TrainerClassListProps> = ({ 
  classes, 
  isLoading,
  onClassClick,
  onEditClass,
  onCancelClass
}) => {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

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

  const toggleExpandClass = (classId: string) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  return (
    <div className="space-y-4">
      {classes.map(gymClass => {
        // Ensure needed properties exist
        const classObj = {
          ...gymClass,
          startTime: gymClass.start_time,
          endTime: gymClass.end_time
        };
        
        const isExpanded = expandedClassId === classObj.id;
        
        return (
          <Card key={classObj.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/40"
                onClick={() => toggleExpandClass(classObj.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">{classObj.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(parseISO(classObj.start_time), 'EEE, MMM d')}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {format(parseISO(classObj.start_time), 'h:mm a')} - {format(parseISO(classObj.end_time), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge>{classObj.type}</Badge>
                    {isExpanded ? 
                      <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{classObj.enrolled || 0}/{classObj.capacity} enrolled</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t">
                  <dl className="space-y-2 mt-2">
                    {classObj.location && (
                      <div className="flex items-start">
                        <dt className="w-24 flex items-center text-sm font-medium text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location:
                        </dt>
                        <dd className="text-sm">{classObj.location}</dd>
                      </div>
                    )}
                    
                    {classObj.description && (
                      <div className="flex items-start">
                        <dt className="w-24 text-sm font-medium text-muted-foreground">Description:</dt>
                        <dd className="text-sm">{classObj.description}</dd>
                      </div>
                    )}
                  </dl>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => onClassClick(classObj.id)}>
                      View Details
                    </Button>
                    
                    {onEditClass && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClass(classObj.id);
                        }}
                      >
                        Edit Class
                      </Button>
                    )}
                    
                    {onCancelClass && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelClass(classObj.id);
                        }}
                      >
                        Cancel Class
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TrainerClassList;
