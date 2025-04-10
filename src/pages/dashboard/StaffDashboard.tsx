
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical, Users, UserPlus, DollarSign, CheckCheck, ListChecks, Calendar, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/hooks/use-branch";
import { useAuth } from "@/hooks/use-auth";
import { Announcement, DashboardSummary } from "@/types";

// Demo data for the example
const revenueData = [
  { date: "2023-01-01", amount: 4500 },
  { date: "2023-01-08", amount: 5200 },
  { date: "2023-01-15", amount: 6000 },
  { date: "2023-01-22", amount: 5800 },
  { date: "2023-01-29", amount: 6500 },
  { date: "2023-02-05", amount: 7000 },
  { date: "2023-02-12", amount: 7200 },
  { date: "2023-02-19", amount: 7500 },
  { date: "2023-02-26", amount: 8000 },
  { date: "2023-03-05", amount: 8500 },
  { date: "2023-03-12", amount: 9000 },
  { date: "2023-03-19", amount: 9500 },
  { date: "2023-03-26", amount: 10000 },
];

const mockMembers = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/avatars/avatar-2.png",
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/avatars/avatar-3.png",
  },
  {
    id: "4",
    name: "Emily Brown",
    avatar: "/avatars/avatar-4.png",
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "/avatars/avatar-5.png",
  },
  {
    id: "6",
    name: "Jessica Lee",
    avatar: "/avatars/avatar-6.png",
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New Fitness Class",
    content: "Join our new Zumba class every Monday at 6 PM!",
    createdAt: "2023-07-10T00:00:00Z",
    author: "Admin",
    priority: "high",
    targetRoles: ["member"],
  },
  {
    id: "2",
    title: "Gym Closure",
    content: "The gym will be closed on July 15th for maintenance.",
    createdAt: "2023-07-12T00:00:00Z",
    author: "Manager",
    priority: "medium",
    targetRoles: ["member", "staff"],
  },
  {
    id: "3",
    title: "Trainer Spotlight",
    content: "This month's featured trainer is Sarah Johnson!",
    createdAt: "2023-07-15T00:00:00Z",
    author: "Marketing",
    priority: "low",
    targetRoles: ["member"],
  },
];

// Mock dashboard summary data for the demo
const mockDashboardSummary: DashboardSummary = {
  activeMemberships: 450,
  totalRevenue: 25000,
  newMembers: 35,
  upcomingClasses: 12,
  occupancyRate: 78,
  totalMembers: 520,
  todayCheckIns: 124,
  pendingPayments: 18,
  upcomingRenewals: 24,
  attendanceTrend: [
    { date: "2023-06-01", count: 85 },
    { date: "2023-06-02", count: 92 },
    { date: "2023-06-03", count: 78 },
    { date: "2023-06-04", count: 65 },
    { date: "2023-06-05", count: 110 },
    { date: "2023-06-06", count: 115 },
    { date: "2023-06-07", count: 125 },
  ]
};

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  loading,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading ? <Skeleton className="h-8 w-20" /> : value}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const RecentMembers = ({
  members,
  loading,
}: {
  members: { id: string; name: string; avatar: string }[];
  loading?: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Members</CardTitle>
      <CardDescription>New members who joined recently</CardDescription>
    </CardHeader>
    <CardContent className="pl-2">
      <ScrollArea className="h-[300px] w-full space-y-2">
        {loading ? (
          <>
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
          </>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center space-x-4 mb-4 p-2">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">Member</p>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </CardContent>
  </Card>
);

const RevenueChart = ({ data }: { data: { date: string; amount: number }[] }) => {
  const [tooltip, setTooltip] = React.useState<{
    date: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue trend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onMouseMove={(e) => {
                if (e.activePayload && e.activePayload.length) {
                  const payload = e.activePayload[0].payload;
                  setTooltip({
                    date: payload.date,
                    amount: payload.amount,
                    x: e.chartX,
                    y: e.chartY - 10,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), "MMM")} 
              />
              <YAxis />
              <Tooltip 
                content={() => null} // Use custom tooltip
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {tooltip && (
            <div 
              className="absolute bg-background rounded-md border p-2 shadow-md"
              style={{ 
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none'
              }}
            >
              <p className="text-sm font-medium">
                {format(new Date(tooltip.date), "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                Revenue: ${tooltip.amount}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UpcomingRenewals = () => {
  const renewals = [
    { id: "1", memberName: "Alice Johnson", expiryDate: "2023-08-01" },
    { id: "2", memberName: "Bob Williams", expiryDate: "2023-08-05" },
    { id: "3", memberName: "Charlie Brown", expiryDate: "2023-08-10" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Renewals</CardTitle>
        <CardDescription>Memberships expiring soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renewals.map((renewal) => (
            <div key={renewal.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{renewal.memberName}</p>
                <p className="text-sm text-muted-foreground">
                  Expires on {format(new Date(renewal.expiryDate), "PP")}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Renew
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnnouncementsList = ({ announcements }: { announcements: Announcement[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Announcements</CardTitle>
      <CardDescription>Latest gym announcements</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{announcement.title}</h4>
              <Badge
                variant={
                  announcement.priority === "high"
                    ? "destructive"
                    : announcement.priority === "medium"
                    ? "default"
                    : "secondary"
                }
              >
                {announcement.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {announcement.content}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                By {announcement.author} • {format(new Date(announcement.createdAt), "PP")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const StaffDashboard = () => {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [summaryData, setSummaryData] = React.useState<DashboardSummary>(mockDashboardSummary);
  const [members, setMembers] = React.useState(mockMembers);
  const [announcements, setAnnouncements] = React.useState(mockAnnouncements);

  // In a real application, you would fetch this data from your API
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSummaryData(mockDashboardSummary);
        setMembers(mockMembers);
        setAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentBranch?.id]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MoreVertical className="mr-2 h-4 w-4" />
            Options
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Members"
          value={summaryData.totalMembers}
          description="Across all branches"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Active Memberships"
          value={summaryData.activeMemberships}
          description="Current subscription count"
          icon={<CheckCheck className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="New Members"
          value={summaryData.newMembers}
          description="Joined this month"
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Monthly Revenue"
          value={`$${summaryData.totalRevenue}`}
          description="This month's earnings"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Today's Check-ins"
          value={summaryData.todayCheckIns}
          description="Members who visited today"
          icon={<CheckCheck className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Upcoming Classes"
          value={summaryData.upcomingClasses}
          description="Scheduled for today"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Occupancy Rate"
          value={`${summaryData.occupancyRate}%`}
          description="Current gym capacity"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Pending Payments"
          value={summaryData.pendingPayments}
          description="Require attention"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={revenueData} />
        <RecentMembers members={members} loading={isLoading} />
        <AnnouncementsList announcements={announcements} />
        <UpcomingRenewals />
      </div>
    </div>
  );
};

export default StaffDashboard;
