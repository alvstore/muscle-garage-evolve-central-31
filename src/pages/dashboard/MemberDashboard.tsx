
import { useState, useEffect } from "react";
import { DumbbellIcon, Calendar, BarChart3, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import Announcements from "@/components/dashboard/Announcements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { mockClasses, mockAnnouncements } from "@/data/mockData";

const MemberDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Mock data for member-specific info
  const membershipData = {
    plan: "Premium Annual",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    daysLeft: 175, // Days left in membership
    totalDays: 365, // Total days in membership
    trainer: "Chris Rodriguez",
    goal: "Weight loss and muscle toning",
    lastCheckIn: "2023-07-19T08:30:00Z"
  };

  const upcomingAppointments = [
    {
      id: "appt1",
      title: "Personal Training",
      with: "Chris Rodriguez",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      duration: 60
    },
    {
      id: "appt2",
      title: "Fitness Assessment",
      with: "Chris Rodriguez",
      date: format(addDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      duration: 45
    }
  ];

  const progressData = {
    weightGoal: {
      current: 82,
      target: 75,
      start: 90,
      unit: "kg"
    },
    workoutGoal: {
      completed: 12,
      target: 16,
      unit: "workouts/month"
    }
  };

  const memberActivities = [
    {
      id: "1",
      title: "Completed Workout",
      description: "You completed 'Upper Body Strength' workout",
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg",
      },
      time: "Yesterday",
      type: "other",
    },
    {
      id: "2",
      title: "Class Attendance",
      description: "You checked in for HIIT Extreme class",
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg",
      },
      time: "2 days ago",
      type: "check-in",
    },
    {
      id: "3",
      title: "New Diet Plan",
      description: "Chris Rodriguez assigned you a new diet plan",
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg",
      },
      time: "1 week ago",
      type: "other",
    },
  ];

  // Calculate membership progress percentage
  const membershipProgressPercent = Math.round(
    ((membershipData.totalDays - membershipData.daysLeft) / membershipData.totalDays) * 100
  );

  // Calculate weight progress percentage
  const weightProgressPercent = Math.round(
    ((progressData.weightGoal.start - progressData.weightGoal.current) / 
     (progressData.weightGoal.start - progressData.weightGoal.target)) * 100
  );

  // Calculate workout progress percentage
  const workoutProgressPercent = Math.round(
    (progressData.workoutGoal.completed / progressData.workoutGoal.target) * 100
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, Jordan</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          title="Membership"
          value={membershipData.plan}
          description={`${membershipData.daysLeft} days remaining`}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={DumbbellIcon}
          title="Personal Trainer"
          value={membershipData.trainer}
          description="Next session: Tomorrow, 9 AM"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={BarChart3}
          title="Fitness Goal"
          value={membershipData.goal}
          description="Updated 2 weeks ago"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Clock}
          title="Last Check-in"
          value="Yesterday, 8:30 AM"
          description="Total: 12 check-ins this month"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Your current fitness progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weight Goal</span>
                  <span className="font-medium">
                    {progressData.weightGoal.current} / {progressData.weightGoal.target} {progressData.weightGoal.unit}
                  </span>
                </div>
                <Progress value={weightProgressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Started at {progressData.weightGoal.start} {progressData.weightGoal.unit}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Workouts</span>
                  <span className="font-medium">
                    {progressData.workoutGoal.completed} / {progressData.workoutGoal.target} {progressData.workoutGoal.unit}
                  </span>
                </div>
                <Progress value={workoutProgressPercent} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Membership</span>
                  <span className="font-medium">
                    {membershipData.daysLeft} days left
                  </span>
                </div>
                <Progress value={membershipProgressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Expires on {format(new Date(membershipData.endDate), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4 w-full">View Detailed Progress</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="flex flex-col space-y-2 p-3 bg-accent/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{appointment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {appointment.with}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          {format(new Date(appointment.date), "EEEE, MMM dd")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(appointment.date), "h:mm a")} • {appointment.duration} mins
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No appointments scheduled</p>
            )}
            
            <Button variant="outline" className="mt-4 w-full">Schedule New Session</Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <UpcomingClasses classes={mockClasses} />
          <Announcements announcements={mockAnnouncements.filter(a => a.targetRoles.includes('member'))} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity activities={memberActivities} />
        
        <Card>
          <CardHeader>
            <CardTitle>My Workout Plan</CardTitle>
            <CardDescription>Your current workout routine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Today: Chest & Triceps</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 bg-background border rounded-md">
                    <span>Bench Press</span>
                    <span>4 sets × 10 reps</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-background border rounded-md">
                    <span>Incline Dumbbell Press</span>
                    <span>3 sets × 12 reps</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-background border rounded-md">
                    <span>Tricep Dips</span>
                    <span>3 sets × 15 reps</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-background border rounded-md">
                    <span>Cable Flyes</span>
                    <span>3 sets × 12 reps</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex gap-2">
                <Button variant="default">Log Workout</Button>
                <Button variant="outline">View Full Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
