
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Class } from "@/types";

interface UpcomingClassesProps {
  classes: Class[];
}

const UpcomingClasses = ({ classes }: UpcomingClassesProps) => {
  // Helper function to format the class time range
  const formatClassTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  // Sort classes by start time
  const sortedClasses = [...classes].sort((a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  // Only show upcoming classes (today and future)
  const upcomingClasses = sortedClasses.filter(
    (classItem) => new Date(classItem.start_time) >= new Date()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Next scheduled classes</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingClasses.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No upcoming classes scheduled</p>
        ) : (
          <div className="space-y-4">
            {upcomingClasses.slice(0, 5).map((classItem) => (
              <div key={classItem.id} className="flex flex-col space-y-2 p-3 bg-accent/10 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(classItem.start_time), "EEEE, MMM dd")} ・ {formatClassTime(classItem.start_time, classItem.end_time)}
                    </p>
                  </div>
                  <Badge variant={classItem.enrolled < classItem.capacity ? "outline" : "secondary"}>
                    {classItem.enrolled}/{classItem.capacity}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{classItem.location}</span>
                  <Button variant="secondary" size="sm">View Details</Button>
                </div>
              </div>
            ))}
            
            {upcomingClasses.length > 5 && (
              <Button variant="outline" className="w-full mt-2">
                View All Classes
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingClasses;
