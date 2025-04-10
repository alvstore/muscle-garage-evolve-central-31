import { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  DollarSign,
  Dumbbell,
  FileText,
  User,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import Announcements from "@/components/dashboard/Announcements";
import { mockClasses, mockAnnouncements } from "@/data/mockData";

const MemberDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [memberData, setMemberData] = useState({
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      membershipPlan: "Premium Annual",
      membershipStatus: "active",
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      trainer: "Sarah Johnson",
      trainingGoal: "Weight Loss",
      attendanceStreak: 5,
    },
    fitness: {
      plan: "Fat Loss Program - Week 3",
      progress: {
        startWeight: 85,
        currentWeight: 80,
        targetWeight: 75,
        weightProgress: 50,
        attendanceRate: 85,
        workoutsCompleted: 12,
        totalWorkouts: 16,
      },
      upcomingSession: {
        date: "2023-07-25",
        time: "18:00 - 19:30",
        trainer: "Sarah Johnson",
        focus: "Lower Body & Core",
      },
    },
    classes: {
      booked: 3,
      attended: 12,
      favorite: "HIIT Extreme",
    },
    diet: {
      plan: "High Protein, Low Carb",
      nextMeal: "Protein Shake + Almonds",
      waterIntake: 4,
      waterGoal: 8,
      compliance: 75,
    },
    payments: {
      nextPayment: {
        amount: 999,
        dueDate: "2023-12-31",
        plan: "Premium Annual",
      },
      lastPayment: {
        amount: 999,
        date: "2023-01-15",
        receipt: "INV-2023-001",
      },
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const recentActivities = [
    {
      id: "1",
      title: "Session Completed",
      description: "You completed a personal training session with Sarah Johnson",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
      },
      time: "Yesterday, 6:30 PM",
      type: "other" as const,
    },
    {
      id: "2",
      title: "Class Attendance",
      description: "You checked in for HIIT Extreme class",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
      time: "2 days ago, 7:00 PM",
      type: "check-in" as const,
    },
    {
      id: "3",
      title: "Workout Completed",
      description: "You completed Day 12 of your fitness plan",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
      time: "3 days ago, 5:45 PM",
      type: "other" as const,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Member Dashboard</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={memberData.profile.avatar} alt={memberData.profile.name} />
                  <AvatarFallback>{getInitials(memberData.profile.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{memberData.profile.name}</p>
                  <p className="text-sm text-muted-foreground">{memberData.profile.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Membership Plan</p>
                <p className="text-sm text-muted-foreground">{memberData.profile.membershipPlan}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Membership Status</p>
                <p className="text-sm text-muted-foreground">{memberData.profile.membershipStatus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Trainer</p>
                <p className="text-sm text-muted-foreground">{memberData.profile.trainer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Training Goal</p>
                <p className="text-sm text-muted-foreground">{memberData.profile.trainingGoal}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Attendance Streak</p>
                <p className="text-sm text-muted-foreground">{memberData.profile.attendanceStreak} days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Plan</CardTitle>
              <CardDescription>Your current fitness plan and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Current Plan</p>
                <p className="text-sm text-muted-foreground">{memberData.fitness.plan}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">Weight Progress</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Start: {memberData.fitness.progress.startWeight} kg</span>
                  <span>Target: {memberData.fitness.progress.targetWeight} kg</span>
                </div>
                <Progress value={memberData.fitness.progress.weightProgress} />
                <p className="text-sm text-muted-foreground">
                  Current Weight: {memberData.fitness.progress.currentWeight} kg
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Attendance Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {memberData.fitness.progress.attendanceRate}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Workouts Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {memberData.fitness.progress.workoutsCompleted} / {memberData.fitness.progress.totalWorkouts}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Upcoming Session</p>
                <p className="text-sm text-muted-foreground">
                  {memberData.fitness.upcomingSession.date}, {memberData.fitness.upcomingSession.time} with{" "}
                  {memberData.fitness.upcomingSession.trainer} (Focus: {memberData.fitness.upcomingSession.focus})
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>Your class bookings and attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Booked Classes</p>
                  <p className="text-sm text-muted-foreground">{memberData.classes.booked}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Attended Classes</p>
                  <p className="text-sm text-muted-foreground">{memberData.classes.attended}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Favorite Class</p>
                <p className="text-sm text-muted-foreground">{memberData.classes.favorite}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diet Plan</CardTitle>
              <CardDescription>Your current diet plan and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Current Plan</p>
                <p className="text-sm text-muted-foreground">{memberData.diet.plan}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Next Meal</p>
                <p className="text-sm text-muted-foreground">{memberData.diet.nextMeal}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Water Intake</p>
                  <p className="text-sm text-muted-foreground">
                    {memberData.diet.waterIntake} / {memberData.diet.waterGoal} liters
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Compliance</p>
                  <p className="text-sm text-muted-foreground">{memberData.diet.compliance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Your payment history and upcoming payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Next Payment</p>
                <p className="text-sm text-muted-foreground">
                  ${memberData.payments.nextPayment.amount} due on {memberData.payments.nextPayment.dueDate} for{" "}
                  {memberData.payments.nextPayment.plan}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Last Payment</p>
                <p className="text-sm text-muted-foreground">
                  ${memberData.payments.lastPayment.amount} on {memberData.payments.lastPayment.date} (Receipt:{" "}
                  {memberData.payments.lastPayment.receipt})
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <RecentActivity activities={recentActivities} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <UpcomingClasses classes={mockClasses} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <Announcements announcements={mockAnnouncements} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
