import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import Announcements from "@/components/dashboard/Announcements";
import RenewalsSection from "@/components/dashboard/sections/RenewalsSection";
import RevenueSection from "@/components/dashboard/sections/RevenueSection";
import StaffDashboardHeader from "@/components/dashboard/staff/StaffDashboardHeader";
import StaffStatsOverview from "@/components/dashboard/staff/StaffStatsOverview";
import { useBranch } from "@/hooks/use-branch";
import { supabase } from "@/services/supabaseClient";
import { DashboardSummary } from "@/hooks/use-dashboard";

const StaffDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    totalTrainers: 0,
    totalStaff: 0,
    activeClasses: 0,
    totalClasses: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
    unpaidInvoices: 0,
    pendingPayments: {
      total: 0,
      count: 0
    },
    todayCheckIns: 0,
    upcomingRenewals: 0,
    attendanceTrend: [],
    expiringMemberships: 0,
    revenue: {
      current: 0,
      previous: 0,
      percentChange: 0
    }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
    fetchPendingPayments();
    fetchAnnouncements();
    fetchRevenueData();
  }, [currentBranch]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = {
        totalMembers: 0,
        activeMembers: 0,
        totalTrainers: 0,
        totalStaff: 0,
        activeClasses: 0,
        totalClasses: 0,
        revenueToday: 0,
        revenueThisMonth: 0,
        unpaidInvoices: 0,
        pendingPayments: {
          total: 0,
          count: 0
        },
        todayCheckIns: 0,
        upcomingRenewals: 0,
        attendanceTrend: [],
        expiringMemberships: 0,
        revenue: {
          current: 0,
          previous: 0,
          percentChange: 0
        }
      };
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data: checkIns } = await supabase
        .from('member_attendance')
        .select(`
          id, check_in, member_id,
          members:member_id (name)
        `)
        .match(currentBranch?.id ? { branch_id: currentBranch.id } : {})
        .order('check_in', { ascending: false })
        .limit(5);
      
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          id, payment_date, amount, payment_method, member_id,
          members:member_id (name)
        `)
        .match(currentBranch?.id ? { branch_id: currentBranch.id } : {})
        .order('payment_date', { ascending: false })
        .limit(5);
      
      const activities = [
        ...(checkIns || []).map(item => ({
          id: item.id,
          type: 'check-in',
          date: item.check_in,
          name: (item.members && typeof item.members === 'object' ? item.members?.name || 'Unknown Member' : 'Unknown Member'),
          memberId: item.member_id,
          details: 'Checked in at the gym'
        })),
        ...(payments || []).map(item => ({
          id: item.id,
          type: 'payment',
          date: item.payment_date,
          name: (item.members && typeof item.members === 'object' ? item.members?.name || 'Unknown Member' : 'Unknown Member'),
          memberId: item.member_id,
          amount: item.amount,
          method: item.payment_method,
          details: `Paid ${item.amount} via ${item.payment_method}`
        }))
      ];
      
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setRecentActivities(activities.slice(0, 10));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const { data } = await supabase
        .from('invoices')
        .select(`
          id, amount, due_date, status, member_id,
          members:member_id (name)
        `)
        .match(currentBranch?.id ? { branch_id: currentBranch.id } : {})
        .in('status', ['pending', 'overdue'])
        .order('due_date', { ascending: true })
        .limit(10);
      
      setPendingPayments(data ? data.map(item => ({
        id: item.id,
        memberId: item.member_id,
        memberName: item.members?.name || 'Unknown',
        amount: item.amount,
        dueDate: item.due_date,
        status: item.status,
        overdue: new Date(item.due_date) < new Date()
      })) : []);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setAnnouncements(data ? data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        authorName: item.author_name,
        createdAt: item.created_at,
        priority: item.priority,
        channel: item.channel,
        branchId: item.branch_id
      })) : []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      const data = [];
      
      for (let i = 5; i >= 0; i--) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentDate.getFullYear() - (currentMonth < i ? 1 : 0);
        
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        const { data: income } = await supabase
          .from('transactions')
          .select('amount')
          .match({ 
            type: 'income',
            ...(currentBranch?.id ? { branch_id: currentBranch.id } : {})
          })
          .gte('transaction_date', startDate.toISOString())
          .lte('transaction_date', endDate.toISOString());
          
        const { data: expenses } = await supabase
          .from('transactions')
          .select('amount')
          .match({ 
            type: 'expense',
            ...(currentBranch?.id ? { branch_id: currentBranch.id } : {})
          })
          .gte('transaction_date', startDate.toISOString())
          .lte('transaction_date', endDate.toISOString());
        
        const totalIncome = income?.reduce((sum, item) => sum + item.amount, 0) || 0;
        const totalExpenses = expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
        
        data.push({
          month: months[month],
          revenue: totalIncome,
          expenses: totalExpenses,
          profit: totalIncome - totalExpenses
        });
      }
      
      setRevenueData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast("Refreshing dashboard data", {
      description: "Please wait while we fetch the latest information."
    });
    
    Promise.all([
      fetchDashboardData(),
      fetchRecentActivities(),
      fetchPendingPayments(),
      fetchAnnouncements(),
      fetchRevenueData()
    ]).finally(() => {
      setIsLoading(false);
      toast("Dashboard updated", {
        description: "All data has been refreshed with the latest information."
      });
    });
  };

  return (
    <div className="space-y-6">
      <StaffDashboardHeader isLoading={isLoading} onRefresh={handleRefresh} />
      <StaffStatsOverview isLoading={isLoading} dashboardData={{
        ...dashboardData
      }} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <AttendanceChart data={dashboardData.attendanceTrend || []} />
          )}
        </div>
        
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <Card>
              <RevenueSection data={revenueData} />
            </Card>
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
