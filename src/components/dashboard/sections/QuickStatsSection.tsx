
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Dumbbell, BarChart, Trophy } from 'lucide-react';

const QuickStatsSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">16</h3>
          <p className="text-sm text-muted-foreground">Workouts</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">8</h3>
          <p className="text-sm text-muted-foreground">Classes Booked</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">-6kg</h3>
          <p className="text-sm text-muted-foreground">Weight Loss</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">Silver</h3>
          <p className="text-sm text-muted-foreground">Membership</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsSection;
