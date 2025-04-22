import { useState, useEffect } from "react";
import { Users, DollarSign, UserCheck, CalendarCheck2, RefreshCcw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import UpcomingRenewals from "@/components/dashboard/UpcomingRenewals";
import Announcements from "@/components/dashboard/Announcements";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Announcement } from "@/types/notification";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/hooks/use-auth";
import { useBranch } from "@/hooks/use-branch";

interface StaffProfile {
  full_name: string;
  avatar_url: string;
  phone?: string;
}

interface MembershipPlan {
  name: string;
}

const StaffDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    todayCheckIns: 0,
    pendingPayments: { total: 0, count: 0 },
    upcomingRenewals: 0,
    attendanceTrend: []
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    fetchDashboardData();
  }, [currentBranch?.id]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      const branchFilter = currentBranch?.id ? { branch_id: currentBranch.id } : {};
      
      const { count: membersCount, error: membersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'member')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (membersError) throw membersError;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: checkInsCount, error: checkInsError } = await supabase
        .from('member_attendance')
        .select('id', { count: 'exact' })
        .gte('check_in', today.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (checkInsError) throw checkInsError;
      
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (paymentsError) throw paymentsError;
      
      const pendingPaymentsTotal = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      
      const { count: renewalsCount, error: renewalsError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .lte('end_date', oneWeekLater.toISOString().split('T')[0])
        .gt('end_date', today.toISOString().split('T')[0])
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (renewalsError) throw renewalsError;
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('member_attendance')
        .select('check_in')
        .gte('check_in', sevenDaysAgo.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (attendanceError) throw attendanceError;
      
      const attendanceTrend = processAttendanceTrend(attendanceData);
      
      const { data: activities, error: activitiesError } = await supabase
        .from('member_attendance')
        .select(`
          id,
          check_in,
          member_id,
          profiles:member_id (full_name, avatar_url)
        `)
        .order('check_in', { ascending: false })
        .limit(5)
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (activitiesError) throw activitiesError;
      
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        title: "Member Check-in",
        description: `${activity.profiles?.full_name || 'Member'} checked in`,
        user: {
          name: activity.profiles?.full_name || 'Unknown Member',
          avatar: activity.profiles?.avatar_url || '/placeholder.svg',
        },
        time: formatRelativeTime(new Date(activity.check_in)),
        type: "check-in"
      }));
      
      const { data: pendingPaymentsData, error: pendingPaymentsError } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          payment_date,
          status,
          member_id,
          profiles:member_id (full_name, avatar_url, phone)
        `)
        .eq('status', 'pending')
        .order('payment_date', { ascending: false })
        .limit(5)
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (pendingPaymentsError) throw pendingPaymentsError;
      
      const formattedPendingPayments = pendingPaymentsData.map(payment => ({
        id: payment.id,
        memberId: payment.member_id,
        memberName: payment.profiles?.full_name || 'Unknown Member',
        memberAvatar: payment.profiles?.avatar_url || '/placeholder.svg',
        membershipPlan: 'Membership Payment',
        amount: Number(payment.amount),
        dueDate: payment.payment_date,
        status: payment.status,
        contactInfo: payment.profiles?.phone || 'No phone'
      }));
      
      const { data: upcomingRenewalsData, error: upcomingRenewalsError } = await supabase
        .from('member_memberships')
        .select(`
          id,
          end_date,
          total_amount,
          status,
          member_id,
          profiles:member_id (full_name, avatar_url),
          memberships:membership_id (name)
        `)
        .lte('end_date', oneWeekLater.toISOString().split('T')[0])
        .gt('end_date', today.toISOString().split('T')[0])
        .eq('status', 'active')
        .order('end_date', { ascending: true })
        .limit(5)
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (upcomingRenewalsError) throw upcomingRenewalsError;
      
      const formattedUpcomingRenewals = upcomingRenewalsData.map(renewal => ({
        id: renewal.id,
        memberName: renewal.profiles?.full_name || 'Unknown Member',
        memberAvatar: renewal.profiles?.avatar_url || '/placeholder.svg',
        membershipPlan: renewal.memberships?.name || 'Standard Membership',
        expiryDate: renewal.end_date,
        status: renewal.status,
        renewalAmount: Number(renewal.total_amount)
      }));
      
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          created_at,
          priority,
          created_by,
          profiles:created_by (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (announcementsError) throw announcementsError;
      
      const formattedAnnouncements = announcementsData.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        authorId: announcement.created_by,
        authorName: (announcement.profiles as StaffProfile)?.full_name || 'Staff Member',
        createdAt: announcement.created_at,
        priority: announcement.priority || 'medium',
        targetRoles: ['member', 'trainer', 'staff'],
        channels: ['in-app'] as NotificationChannel[],
        sentCount: 0,
        forRoles: ['member', 'trainer', 'staff'],
        createdBy: announcement.created_by
      }));
      
      setDashboardData({
        totalMembers: membersCount || 0,
        todayCheckIns: checkInsCount || 0,
        pendingPayments: { 
          total: pendingPaymentsTotal,
          count: payments.length 
        },
        upcomingRenewals: renewalsCount || 0,
        attendanceTrend
      });
      
      setRecentActivities(formattedActivities);
      setPendingPayments(formattedPendingPayments);
      setUpcomingRenewals(formattedUpcomingRenewals);
      setAnnouncements(formattedAnnouncements);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Failed to load dashboard data",
        description: "Please try refreshing the page"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processAttendanceTrend = (attendanceData) => {
    const days = [];
    const counts = new Array(7).fill(0);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(formatDate(date));
      
      for (const attendance of attendanceData) {
        const checkInDate = new Date(attendance.check_in);
        checkInDate.setHours(0, 0, 0, 0);
        
        if (checkInDate.getTime() === date.getTime()) {
          counts[6 - i]++;
        }
      }
    }
    
    return days.map((day, index) => ({
      name: day,
      total: counts[index]
    }));
  };

  const formatDate = (date: Date) => {
    const options = { weekday: 'short' as const };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Refreshing dashboard data",
      description: "Please wait while we fetch the latest information."
    });
    
    fetchDashboardData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Members"
          value={isLoading ? "Loading..." : dashboardData.totalMembers}
          description="Active and inactive members"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={UserCheck}
          title="Today's Check-ins"
          value={isLoading ? "Loading..." : dashboardData.todayCheckIns}
          description="Members visited today"
          iconColor="text-green-600"
        />
        <StatCard
          icon={DollarSign}
          title="Pending Payments"
          value={isLoading ? "Loading..." : `$${dashboardData.pendingPayments.total}`}
          description={`${dashboardData.pendingPayments.count} invoices pending`}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={CalendarCheck2}
          title="Upcoming Renewals"
          value={isLoading ? "Loading..." : dashboardData.upcomingRenewals}
          description="Expiring in the next 7 days"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <AttendanceChart data={dashboardData.attendanceTrend} />
          )}
        </div>
        
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <UpcomingRenewals renewals={upcomingRenewals} />
          )}
        </div>
      </div>

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
            <PendingPayments payments={pendingPayments} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <Announcements announcements={announcements} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
