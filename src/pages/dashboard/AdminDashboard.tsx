
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCcw, PlusCircle, Star, Edit } from 'lucide-react';
import { SearchAndExport } from '@/components/dashboard/sections/SearchAndExport';
import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import RevenueSection from '@/components/dashboard/sections/RevenueSection';
import MemberStatusSection from '@/components/dashboard/sections/MemberStatusSection';
import AttendanceSection from '@/components/dashboard/sections/AttendanceSection';
import MemberProgressSection from '@/components/dashboard/sections/MemberProgressSection';
import ChurnPredictionSection from '@/components/dashboard/sections/ChurnPredictionSection';
import RenewalsSection from '@/components/dashboard/sections/RenewalsSection';
import { usePermissions } from '@/hooks/use-permissions';
import { useBranch } from '@/hooks/use-branch';
import { useDashboard } from '@/hooks/use-dashboard';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  branch_id?: string;
  status?: string;
  branch_name?: string;
  avatar_url?: string;
  rating?: number;
}

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [pendingPayments, setPendingPayments] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error' | 'loading' | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  
  const { isSuperAdmin } = usePermissions();
  const { currentBranch } = useBranch();
  const { dashboardData, isLoading, refreshData } = useDashboard();
  const navigate = useNavigate();

  // Transform revenue data to the format expected by RevenueSection
  const transformedRevenueData = React.useMemo(() => {
    if (!dashboardData?.revenueData) return [];
    
    return dashboardData.revenueData.map(item => ({
      month: item.month,
      revenue: item.revenue || 0,
      expenses: item.expenses || 0,
      profit: item.profit || 0
    }));
  }, [dashboardData]);

  useEffect(() => {
    // Only refresh when branch actually changes
    if (currentBranch?.id) {
      refreshData();
      fetchTrainers();
    }
  }, [currentBranch?.id]);

  const fetchTrainers = async () => {
    setLoadingTrainers(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department,
          branch_id,
          avatar_url,
          rating,
          branches:branch_id (name)
        `)
        .eq('role', 'trainer')
        .limit(3); // Limit to 3 trainers for the dashboard
      
      // If a branch is selected, filter by that branch
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedData = data.map(trainer => ({
        id: trainer.id,
        full_name: trainer.full_name || '',
        email: trainer.email || '',
        phone: trainer.phone || '',
        specialization: trainer.department || '',
        branch_id: trainer.branch_id || '',
        branch_name: trainer.branches ? (trainer.branches as any).name : '',
        status: 'active', // Assuming all fetched trainers are active
        avatar_url: trainer.avatar_url || '',
        rating: trainer.rating || 0
      }));
      
      setTrainers(formattedData);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoadingTrainers(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setToastMessage(`Searching for: ${query}`);
    setToastType('info');
  };

  useEffect(() => {
    if (toastMessage && toastType) {
      if (toastType === 'loading') {
        toast.loading(toastMessage, {
          id: 'refresh-toast',
          description: toastMessage
        });
      } else {
        toast[toastType](toastMessage);
      }
      setToastMessage(null);
      setToastType(null);
    }
  }, [toastMessage, toastType]);

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setToastMessage(`Date range selected: ${startDate?.toDateString()} - ${endDate?.toDateString()}`);
    setToastType('info');
  };

  const handleExport = () => {
    setToastMessage('Dashboard data exported successfully');
    setToastType('success');
  };

  const handleRefresh = async () => {
    try {
      setToastMessage("Refreshing dashboard data");
      setToastType('loading');
      
      await refreshData();
      await fetchTrainers();
      
      setToastMessage("Dashboard data refreshed successfully");
      setToastType('success');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      setToastMessage("Failed to refresh dashboard data");
      setToastType('error');
    }
  };

  const handleViewAllTrainers = () => {
    navigate('/trainers');
  };

  const dashboardTitle = currentBranch ? `${currentBranch.name} Dashboard` : "All Branches Dashboard";
  const scopeDescription = currentBranch 
    ? `Showing data for ${currentBranch.name}` 
    : isSuperAdmin() ? "Showing data for all branches" : "Please select a branch";

  // Ensure we have a default dashboard data object that includes totalIncome
  const defaultDashboardData = {
    totalMembers: 0,
    activeMembers: 0,
    todayCheckIns: 0,
    upcomingRenewals: 0,
    revenue: { daily: 0, weekly: 0, monthly: 0 },
    pendingPayments: { count: 0, total: 0 },
    newMembers: 0,
    expiringMemberships: 0,
    totalIncome: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h1>
          <p className="text-muted-foreground">{scopeDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <SearchAndExport 
            onSearch={setSearchQuery}
            onDateRangeChange={(startDate, endDate) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            onExport={() => toast.success('Dashboard data exported')}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="w-full h-24 animate-pulse bg-muted"></Card>
            ))}
          </div>
        ) : (
          <OverviewStats data={dashboardData || defaultDashboardData} />
        )}
        
        {/* Trainers Section */}
        <div className="mt-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trainers</h2>
            <Button variant="outline" size="sm" onClick={handleViewAllTrainers}>
              <PlusCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          {loadingTrainers ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trainers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No trainers found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainers.map((trainer) => (
                <Card key={trainer.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24 flex items-center justify-center">
                      <div className="flex items-center justify-center">
                        <div className="flex space-x-1 mt-12">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                (trainer.rating || 0) >= star
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-14 relative">
                    <div className="absolute -top-10 left-6">
                      <Avatar className="h-16 w-16 border-4 border-background">
                        {trainer.avatar_url ? (
                          <AvatarImage src={trainer.avatar_url} alt={trainer.full_name} />
                        ) : (
                          <AvatarFallback className="text-lg font-medium">
                            {getInitials(trainer.full_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{trainer.full_name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {trainer.email}
                        </p>
                        {trainer.phone && (
                          <p className="text-muted-foreground text-sm">
                            {trainer.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {trainer.specialization && (
                          <Badge variant="secondary">{trainer.specialization}</Badge>
                        )}
                        {trainer.branch_name && (
                          <Badge variant="outline">{trainer.branch_name}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-80 animate-pulse bg-muted"></Card>
              <Card className="w-full h-80 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <MemberProgressSection />
              <ChurnPredictionSection />
            </>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-96 animate-pulse bg-muted"></Card>
              <Card className="w-full h-96 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <RevenueSection data={transformedRevenueData} />
              <MemberStatusSection data={dashboardData?.membersByStatus || {
                active: 0,
                inactive: 0,
                expired: 0
              }} />
            </>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-72 animate-pulse bg-muted"></Card>
              <Card className="w-full h-72 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <AttendanceSection data={dashboardData?.attendanceTrend || []} />
              <RenewalsSection renewals={upcomingRenewals} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
