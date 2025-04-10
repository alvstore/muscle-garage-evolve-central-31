import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart } from 'recharts';
import { CalendarRange, Clock, DumbellIcon, Heart, TrendingUp, Users, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HealthStatsChart } from '@/components/dashboard/HealthStatsChart';
import { WorkoutHistoryChart } from '@/components/dashboard/WorkoutHistoryChart';
import { DatePickerWithRange } from '@/components/datePicker';
import { cn } from '@/lib/utils';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { PendingAction } from '@/components/dashboard/PendingAction';
import { useToast } from '@/components/ui/use-toast';
import UpcomingClassCard from '@/components/dashboard/UpcomingClassCard';
import { UpcomingRenewalsCard } from '@/components/dashboard/UpcomingRenewalsCard';
import { AttendanceStats } from '@/components/dashboard/AttendanceStats';
import { FeedbackSection } from '@/components/dashboard/sections/FeedbackSection';
import { HealthSummary } from '@/components/dashboard/HealthSummary';
import { MembershipSummary } from '@/components/dashboard/MembershipSummary';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { Member, Class } from '@/types';
import { Announcement } from '@/types/notification';
import { DashboardAnnouncements } from '@/components/dashboard/DashboardAnnouncements';

// Updated imports from mock data
import { mockClasses, mockMembers, announcements } from '@/data/mockData';

const MemberDashboard = () => {
  const [date, setDate] = useState<undefined | {
    from?: Date;
    to?: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [dashboardAnnouncements, setDashboardAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setClasses(mockClasses);
    setMembers(mockMembers);
    setDashboardAnnouncements(announcements);
  }, []);

  useEffect(() => {
    // Filter classes based on the selected date range
    if (date?.from && date?.to) {
      const filtered = classes.filter((workout) => {
        const workoutDate = new Date(); // Replace with actual workout date if available
        return isAfter(workoutDate, date.from!) && isBefore(workoutDate, date.to!);
      });
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }

    // Filter members based on the selected date range
    if (date?.from && date?.to) {
      const filtered = members.filter((member) => {
        const memberDate = new Date(member.membershipStartDate || ""); // Replace with actual member date if available
        return isAfter(memberDate, date.from!) && isBefore(memberDate, date.to!);
      });
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [date, classes, members]);

  const handleDateChange = (newDate: { from?: Date; to?: Date }) => {
    setDate(newDate);
  };

  const handleClassRegistration = (classId: string) => {
    // Simulate class registration
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId ? { ...cls, enrolled: cls.enrolled + 1 } : cls
      )
    );
    toast({
      title: "Success",
      description: "You have successfully registered for the class.",
    });
  };

  const handleAnnouncementDismiss = (announcementId: string) => {
    // Simulate announcement dismissal
    setDashboardAnnouncements((prevAnnouncements) =>
      prevAnnouncements.filter((announcement) => announcement.id !== announcementId)
    );
    toast({
      title: "Success",
      description: "You have dismissed the announcement.",
    });
  };

  return (
    <Container>
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.name}
          </h2>
          <p className="text-muted-foreground">
            Here is an overview of your account
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange date={date} onDateChange={handleDateChange} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-sm text-muted-foreground">
              {filteredMembers.length} in the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Memberships
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">382</div>
            <p className="text-sm text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-sm text-muted-foreground">
              {filteredClasses.length} in the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-ins
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-sm text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4 mt-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MembershipSummary />
            <HealthSummary />
            <AttendanceStats />
          </div>
          <DashboardAnnouncements
            announcements={dashboardAnnouncements}
            onDismiss={handleAnnouncementDismiss}
          />
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <UpcomingClassCard
                key={cls.id}
                cls={cls}
                onRegister={handleClassRegistration}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="membership" className="space-y-4">
          <UpcomingRenewalsCard />
        </TabsContent>
        <TabsContent value="health" className="space-y-4">
          <HealthStatsChart />
        </TabsContent>
        <TabsContent value="progress" className="space-y-4">
          <ProgressCard />
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSection />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default MemberDashboard;
