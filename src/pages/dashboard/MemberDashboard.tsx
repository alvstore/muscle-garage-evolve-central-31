import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck, MessageSquare, TrendingUp, Utensils, Search, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import UpcomingClasses from '@/components/dashboard/sections/UpcomingClasses';
import FitnessGoals from '@/components/dashboard/sections/FitnessGoals';
import DietRecommendations from '@/components/dashboard/sections/DietRecommendations';
import Announcements from '@/components/dashboard/Announcements';
import MemberInvoiceList from '@/components/finance/MemberInvoiceList';
import { Announcement } from '@/types/notification';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

const MemberDashboard = () => {
  const { user } = useAuth();
  
  const mockUpcomingClasses = [
    {
      id: '1',
      name: 'Yoga Class',
      time: '10:00 AM',
      trainer: 'John Doe'
    },
    {
      id: '2',
      name: 'CrossFit',
      time: '2:00 PM',
      trainer: 'Jane Smith'
    }
  ];
  
  const mockFitnessGoals = [
    {
      id: '1',
      name: 'Weight Loss',
      target: '10kg in 3 months',
      progress: 65
    },
    {
      id: '2',
      name: 'Muscle Gain',
      target: '5kg in 2 months',
      progress: 40
    }
  ];
  
  const mockDietRecommendations = [
    {
      id: '1',
      name: 'Breakfast',
      description: 'Oatmeal with fruits and nuts'
    },
    {
      id: '2',
      name: 'Lunch',
      description: 'Grilled chicken with vegetables'
    }
  ];
  
  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Gym Holiday Hours',
      content: 'The gym will be closed on Christmas Day.',
      createdAt: new Date().toISOString(),
      authorId: 'admin1',
      authorName: 'Admin',
      targetRoles: ['member'],
      channels: ['in-app'],
      priority: 'medium',
      channel: 'all',
      branchId: 'main-branch',
    },
    {
      id: '2',
      title: 'New Equipment',
      content: 'We have added new treadmills to the cardio section.',
      createdAt: new Date().toISOString(),
      authorId: 'admin1',
      authorName: 'Admin',
      targetRoles: ['member'],
      channels: ['in-app'],
      priority: 'low',
      channel: 'all',
      branchId: 'main-branch',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Muscle Garage dashboard</p>
        </div>
        <Button variant="outline" className="h-10">
          Today
        </Button>
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
            <UpcomingClasses classes={mockUpcomingClasses} />
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
            <FitnessGoals goals={mockFitnessGoals} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MemberInvoiceList showPendingOnly={true} />
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
            <DietRecommendations recommendations={mockDietRecommendations} />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  toast.success("Diet plan PDF generated");
                  // In a real implementation, this would generate and download a PDF
                }}
              >
                Print Plan
              </Button>
            </div>
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
            <Announcements announcements={mockAnnouncements} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
