
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Dumbbell, CreditCard, Bell, Trophy, BarChart, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { GymClass } from '@/types/class';
import MemberProgressChart from './MemberProgressChart';

interface MemberDashboardProps {
  classes?: GymClass[];
}

const MemberDashboard = ({ classes = [] }: MemberDashboardProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Example progress data
  const progressData = [
    { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];
  
  // Today's date formatted for display
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  // Format class time
  const formatClassTime = (startTime: string) => {
    return format(new Date(startTime), 'h:mm a');
  };
  
  // Sort upcoming classes by date
  const upcomingClasses = classes
    .filter(c => new Date(c.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
      </div>
      
      {/* Quick Stats */}
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Progress Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberProgressChart 
              data={progressData}
              memberId={user?.id || "member1"}
              memberName={user?.name || "Member"}
            />
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/fitness/progress">View Full Progress</a>
            </Button>
          </CardContent>
        </Card>
        
        {/* Upcoming Classes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map(classItem => (
                  <div key={classItem.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(classItem.startTime), 'EEE, MMM d')} at {formatClassTime(classItem.startTime)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button className="w-full" asChild>
                  <a href="/classes">View All Classes</a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Classes</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven't booked any classes yet.
                </p>
                <Button asChild>
                  <a href="/classes">Browse Classes</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Fitness Plans and Invoices */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Fitness Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="workout">
              <TabsList>
                <TabsTrigger value="workout">Workout Plan</TabsTrigger>
                <TabsTrigger value="diet">Diet Plan</TabsTrigger>
              </TabsList>
              <TabsContent value="workout" className="mt-4 space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">4-Day Full Body Program</h3>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Day 1: Upper Body</p>
                      <p className="text-xs text-muted-foreground">8 exercises</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Day 2: Lower Body</p>
                      <p className="text-xs text-muted-foreground">7 exercises</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Day 3: Push</p>
                      <p className="text-xs text-muted-foreground">6 exercises</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Day 4: Pull</p>
                      <p className="text-xs text-muted-foreground">5 exercises</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/fitness/plans">View Full Plan</a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="diet" className="mt-4 space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">High Protein Diet Plan</h3>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Breakfast</p>
                      <p className="text-xs text-muted-foreground">Protein: 30g, Carbs: 45g, Fats: 15g</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Lunch</p>
                      <p className="text-xs text-muted-foreground">Protein: 40g, Carbs: 50g, Fats: 20g</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Snack</p>
                      <p className="text-xs text-muted-foreground">Protein: 20g, Carbs: 25g, Fats: 10g</p>
                    </div>
                    <div className="border p-2 rounded">
                      <p className="font-medium text-sm">Dinner</p>
                      <p className="text-xs text-muted-foreground">Protein: 35g, Carbs: 40g, Fats: 15g</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/fitness/plans">View Full Plan</a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Membership Renewal</p>
                  <p className="text-sm text-muted-foreground">Apr 1, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹3,999</p>
                  <Badge className="bg-green-500">Paid</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Personal Training</p>
                  <p className="text-sm text-muted-foreground">Mar 15, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹1,500</p>
                  <Badge className="bg-green-500">Paid</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-medium">Supplement Purchase</p>
                  <p className="text-sm text-muted-foreground">Mar 5, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹899</p>
                  <Badge className="bg-green-500">Paid</Badge>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="/invoices">View All Invoices</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
