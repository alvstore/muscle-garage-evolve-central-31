import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Dumbbell, ChevronRight, Bell as BellIcon, BarChart2, Trophy } from 'lucide-react';
import MemberProgressChart from '@/components/dashboard/MemberProgressChart';
import Announcements from '@/components/dashboard/Announcements';
import { toast } from 'sonner';
import { GymClass } from '@/types/class';
import { useNavigate } from 'react-router-dom';
import MemberDashboardHeader from '@/components/dashboard/sections/MemberDashboardHeader';
import QuickStatsSection from '@/components/dashboard/sections/QuickStatsSection';
import FitnessPlansSection from '@/components/dashboard/sections/FitnessPlansSection';
import { Announcement as NotificationAnnouncement } from '@/types/notification';
import { UserRole } from '@/types';

interface MemberDashboardProps {
  classes?: GymClass[];
}

const MemberDashboard = ({ classes = [] }: MemberDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const progressData = [
    { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];
  
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  const formatClassTime = (startTime: string) => {
    return format(new Date(startTime), 'h:mm a');
  };
  
  const upcomingClasses = classes
    .filter(c => new Date(c.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  const handleViewClasses = () => {
    navigate('/classes');
    toast.success("Redirecting to classes page");
  };
  
  const recentAnnouncements: NotificationAnnouncement[] = [
    {
      id: "announcement1",
      title: "Gym Closure for Maintenance",
      content: "The gym will be closed on July 15th for routine maintenance. We apologize for any inconvenience.",
      authorId: "admin1",
      authorName: "Admin",
      createdAt: "2023-07-10T10:00:00Z",
      targetRoles: ["member" as UserRole],
      channels: ["in-app"],
      sentCount: 120,
      priority: "medium",
      createdBy: "admin1"
    },
    {
      id: "announcement2",
      title: "New Fitness Classes Added",
      content: "We're excited to announce new Zumba and Pilates classes starting next week!",
      authorId: "admin1",
      authorName: "Admin",
      createdAt: "2023-07-12T14:30:00Z",
      targetRoles: ["member" as UserRole],
      channels: ["in-app"],
      sentCount: 98,
      priority: "low",
      createdBy: "admin1"
    }
  ];

  return (
    <div className="space-y-6">
      <MemberDashboardHeader username={user?.name || ""} date={today} />
      
      <QuickStatsSection />
      
      <div className="grid gap-6 md:grid-cols-2">
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
                
                <Button className="w-full" onClick={handleViewClasses}>
                  View All Classes
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Classes</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven't booked any classes yet.
                </p>
                <Button onClick={handleViewClasses}>
                  View All Classes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FitnessPlansSection />
        
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
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">Pending</Badge>
                    <Button size="sm" variant="outline" onClick={() => navigate('/invoices')}>
                      Pay
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="/invoices">View All Invoices</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
  );
};

export default MemberDashboard;
