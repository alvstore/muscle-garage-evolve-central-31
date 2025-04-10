import React from 'react';
import { format, subDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Chart as ChartPrimitive,
  ChartLegend,
  ChartLine,
  Chart,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart";
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
import { memberService } from "@/services/memberService";
import { paymentService } from "@/services/paymentService";
import { announcementService } from "@/services/announcementService";
import { useBranch } from "@/hooks/use-branch";
import { useAuth } from "@/hooks/use-auth";
import { Announcement } from "@/types";
import { DashboardSummary } from "@/types/index";

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
    date: "2023-07-10",
    author: "Admin",
    priority: "high",
    targetRoles: ["member"],
  },
  {
    id: "2",
    title: "Gym Closure",
    content: "The gym will be closed on July 15th for maintenance.",
    date: "2023-07-12",
    author: "Manager",
    priority: "medium",
    targetRoles: ["member", "staff"],
  },
  {
    id: "3",
    title: "Trainer Spotlight",
    content: "This month's featured trainer is Sarah Johnson!",
    date: "2023-07-15",
    author: "Marketing",
    priority: "low",
    targetRoles: ["member"],
  },
];

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
        {loading ? <Skeleton width={80} /> : value}
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
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center space-x-4">
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
          <ChartPrimitive className="h-full w-full">
            <ChartXAxis tickFormatter={(input) => format(new Date(input), "MMM")} />
            <ChartYAxis />
            <ChartLine
              data={data}
              x="date"
              y="amount"
              onCursorChange={(d) => {
                if (!d) {
                  setTooltip(null);
                  return;
                }
                const data = d.value as { date: string; amount: number };
                setTooltip({
                  ...data,
                  x: d.x,
                  y: d.y,
                });
              }}
            />
            {tooltip && (
              <ChartTooltip x={tooltip.x} y={tooltip.y}>
                <div className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  <p className="text-sm font-medium">
                    {format(new Date(tooltip.date), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Revenue: ${tooltip.amount}
                  </p>
                </div>
              </ChartTooltip>
            )}
          </ChartPrimitive>
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
        <div className="divide-y divide-border">
          {renewals.map((renewal) => (
            <div
              key={renewal.id}
              className="flex items-center justify-between py-2"
            >
              <p className="text-sm font-medium">{renewal.memberName}</p>
              <Badge variant="secondary">
                Expires on {format(new Date(renewal.expiryDate), "MMM dd, yyyy")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Announcements = ({ announcements }: { announcements: Announcement[] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Announcements</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Recent gym announcements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="space-y-2">
              <h3 className="text-sm font-semibold">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">
                {announcement.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(announcement.date), "MMM dd, yyyy")} -{" "}
                {announcement.author}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StaffDashboard = () => {
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  const { data: dashboardSummary, isLoading: isLoadingSummary } = useQuery<DashboardSummary>(
    ['dashboard-summary', currentBranch?.id],
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        activeMemberships: 342,
        totalRevenue: 48250,
        newMembers: 27,
        upcomingClasses: 15,
        occupancyRate: 78,
        totalMembers: 450,
        todayCheckIns: 87,
        pendingPayments: 12,
        upcomingRenewals: 23,
        attendanceTrend: Array(7).fill(0).map((_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
          count: 50 + Math.floor(Math.random() * 40)
        }))
      };
    }
  );

  const { data: members, isLoading: isLoadingMembers } = useQuery(
    ['recent-members', currentBranch?.id],
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMembers;
    }
  );

  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery(
    ['announcements', currentBranch?.id],
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAnnouncements;
    }
  );

  if (!currentBranch) {
    return <div>Loading branch information...</div>;
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const membersCount = members?.length || 0;

  const notificationAnnouncements = announcements?.map(announcement => ({
    ...announcement,
    targetRoles: announcement.targetRoles || ['member'], // Ensure targetRoles exists
    priority: announcement.priority || 'medium' // Ensure priority exists
  })) || [];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Staff Dashboard - {currentBranch.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Members"
          value={dashboardSummary?.totalMembers || 0}
          description="Total number of gym members"
          icon={<Users className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Active Memberships"
          value={dashboardSummary?.activeMemberships || 0}
          description="Currently active memberships"
          icon={<ListChecks className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="New Members"
          value={dashboardSummary?.newMembers || 0}
          description="Members who joined this month"
          icon={<UserPlus className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${dashboardSummary?.totalRevenue || 0}`}
          description="Total revenue generated this month"
          icon={<DollarSign className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Today's Check-ins"
          value={dashboardSummary?.todayCheckIns || 0}
          description="Number of members checked-in today"
          icon={<CheckCheck className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Upcoming Classes"
          value={dashboardSummary?.upcomingClasses || 0}
          description="Classes scheduled for the next week"
          icon={<Calendar className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Occupancy Rate"
          value={`${dashboardSummary?.occupancyRate || 0}%`}
          description="Current gym occupancy rate"
          icon={<TrendingUp className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
        <DashboardCard
          title="Pending Payments"
          value={dashboardSummary?.pendingPayments || 0}
          description="Number of payments pending"
          icon={<DollarSign className="h-4 w-4" />}
          loading={isLoadingSummary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenueData} />
        <RecentMembers members={members || []} loading={isLoadingMembers} />
        <Announcements announcements={notificationAnnouncements} />
        <UpcomingRenewals />
      </div>
    </div>
  );
};

export default StaffDashboard;
