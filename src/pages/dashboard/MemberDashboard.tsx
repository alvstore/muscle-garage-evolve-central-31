
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck, MessageSquare, TrendingUp, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

import UpcomingClasses from '@/components/dashboard/sections/UpcomingClasses';
import FitnessGoals from '@/components/dashboard/sections/FitnessGoals';
import DietRecommendations from '@/components/dashboard/sections/DietRecommendations';
import Announcements from '@/components/dashboard/Announcements';
import { Announcement } from '@/types/notification';

const MemberDashboard = () => {
  // Mock data for upcoming classes
  const upcomingClasses = [
    {
      id: "class1",
      name: "Yoga for Beginners",
      time: "Mon, 6:00 PM",
      trainer: "Sarah Johnson"
    },
    {
      id: "class2",
      name: "HIIT Workout",
      time: "Tue, 7:00 AM",
      trainer: "David Miller"
    },
    {
      id: "class3",
      name: "Pilates",
      time: "Wed, 5:30 PM",
      trainer: "Emily White"
    }
  ];

  // Mock data for fitness goals
  const fitnessGoals = [
    {
      id: "goal1",
      name: "Weight Loss",
      target: "Lose 10 lbs",
      progress: 60
    },
    {
      id: "goal2",
      name: "Increase Strength",
      target: "Bench press 150 lbs",
      progress: 40
    },
    {
      id: "goal3",
      name: "Improve Endurance",
      target: "Run 5k in 30 mins",
      progress: 80
    }
  ];

  // Mock data for diet recommendations
  const dietRecommendations = [
    {
      id: "diet1",
      name: "High Protein Meal",
      description: "Grilled chicken with quinoa and steamed vegetables"
    },
    {
      id: "diet2",
      name: "Post-Workout Snack",
      description: "Protein shake with banana and almond butter"
    },
    {
      id: "diet3",
      name: "Healthy Breakfast",
      description: "Oatmeal with berries and nuts"
    }
  ];

  // Mock data for recent announcements
  const recentAnnouncements: Announcement[] = [
    {
      id: "announcement1",
      title: "Gym Closure for Maintenance",
      content: "The gym will be closed on July 15th for routine maintenance. We apologize for any inconvenience.",
      authorId: "admin1",
      authorName: "Admin",
      createdAt: "2023-07-10T10:00:00Z",
      targetRoles: ["member"],
      channels: ["in-app"],
      sentCount: 120,
      priority: "medium"
    },
    {
      id: "announcement2",
      title: "New Fitness Classes Added",
      content: "We're excited to announce new Zumba and Pilates classes starting next week!",
      authorId: "admin1",
      authorName: "Admin",
      createdAt: "2023-07-12T14:30:00Z",
      targetRoles: ["member"],
      channels: ["in-app"],
      sentCount: 98,
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Muscle Garage dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8">
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <CalendarCheck className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Upcoming Classes</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stay active and book your next class</p>
                <Button variant="ghost" className="mt-3 px-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-transparent" asChild>
                  <a href="/classes">View Schedule</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Fitness Goals</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress and stay motivated</p>
                <Button variant="ghost" className="mt-3 px-0 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-transparent" asChild>
                  <a href="/fitness/progress">See Progress</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <Utensils className="h-10 w-10 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Diet Recommendations</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fuel your body with the right nutrition</p>
                <Button variant="ghost" className="mt-3 px-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-transparent" asChild>
                  <a href="/fitness/diet">Explore Plans</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Classes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/classes">View All</a>
              </Button>
            </div>
            <CardDescription>Your scheduled classes for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingClasses classes={upcomingClasses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fitness Goals</CardTitle>
            </div>
            <CardDescription>Track your fitness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <FitnessGoals goals={fitnessGoals} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Diet Recommendations</CardTitle>
            </div>
            <CardDescription>Personalized diet tips for you</CardDescription>
          </CardHeader>
          <CardContent>
            <DietRecommendations recommendations={dietRecommendations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/communication/announcements">View All</a>
              </Button>
            </div>
            <CardDescription>Stay updated with gym news</CardDescription>
          </CardHeader>
          <CardContent>
            <Announcements announcements={recentAnnouncements} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
