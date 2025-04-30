
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  time: string;
  trainer: string;
}

interface UpcomingClassesProps {
  classes: ClassItem[];
}

const UpcomingClasses: React.FC<UpcomingClassesProps> = ({ classes }) => {
  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-10">
        <CalendarCheck className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No upcoming classes</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No classes scheduled for the next 48 hours
        </p>
        <Button className="mt-4" asChild>
          <a href="/classes">Browse Classes</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classes.map((classItem) => (
        <div key={classItem.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
          <div>
            <h3 className="font-medium">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground">{classItem.time} • {classItem.trainer}</p>
          </div>
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingClasses;
