
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import ClassesSection from '@/components/dashboard/sections/ClassesSection';
import MemberStatusSection from '@/components/dashboard/sections/MemberStatusSection';
import RevenueSection from '@/components/dashboard/sections/RevenueSection';
import ActivitySection from '@/components/dashboard/sections/ActivitySection';
import AttendanceSection from '@/components/dashboard/sections/AttendanceSection';
import RenewalsSection from '@/components/dashboard/sections/RenewalsSection';
import AdminDashboardTools from './AdminDashboardTools';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayAttendance: 0,
    monthlyRevenue: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setLoading(true);
    
    setTimeout(() => {
      // Mock data
      setStats({
        totalMembers: 256,
        activeMembers: 187,
        todayAttendance: 42,
        monthlyRevenue: 15780,
      });
      
      setAttendanceData([
        { date: '2023-05-01', count: 35 },
        { date: '2023-05-02', count: 28 },
        { date: '2023-05-03', count: 42 },
        { date: '2023-05-04', count: 39 },
        { date: '2023-05-05', count: 56 },
        { date: '2023-05-06', count: 47 },
        { date: '2023-05-07', count: 41 },
      ]);
      
      setLoading(false);
    }, 1000);
  }, [currentBranch?.id]);

  if (loading) {
    return (
      <Container>
        <div className="py-6">
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back, {user?.name || 'Admin'}
          </div>
        </div>

        <OverviewStats 
          totalMembers={stats.totalMembers}
          activeMembers={stats.activeMembers}
          todayAttendance={stats.todayAttendance}
          monthlyRevenue={stats.monthlyRevenue}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AttendanceSection data={attendanceData} />
          <RevenueSection />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MemberStatusSection />
          <RenewalsSection />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <AdminDashboardTools />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ClassesSection />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ActivitySection />
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
