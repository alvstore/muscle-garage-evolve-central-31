
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Users, Activity, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { subDays } from 'date-fns';
import { useBranch } from '@/hooks/use-branch';
import { useDashboardSummary, DateRange } from '@/hooks/use-stats';
import StatCard from '@/components/analytics/StatCard';
import ChurnRiskList from '@/components/analytics/ChurnRiskList';
import TrainerPerformance from '@/components/analytics/TrainerPerformance';
import ClassPerformanceTable from '@/components/analytics/ClassPerformanceTable';
import InventoryAlertsList from '@/components/analytics/InventoryAlertsList';
import MembershipTrendChart from '@/components/analytics/MembershipTrendChart';
import RevenueChart from '@/components/analytics/RevenueChart';
import RevenueBreakdownChart from '@/components/analytics/RevenueBreakdownChart';

const AnalyticsDashboard = () => {
  const { branches, currentBranch, setCurrentBranch } = useBranch();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const { data: dashboardData, isLoading } = useDashboardSummary();

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExportData = () => {
    // In a full implementation, this would generate and download a report
    // For now, we'll just display a message
    alert('Exporting analytics data...');
  };

  const handleDateRangeChange = (range: { from: Date; to?: Date }) => {
    if (range.from && range.to) {
      setDateRange({
        from: range.from,
        to: range.to
      });
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights for your fitness business
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={handleExportData} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
            
            <Select 
              value={currentBranch?.id || ''}
              onValueChange={(value) => {
                const branch = branches.find(b => b.id === value);
                if (branch) setCurrentBranch(branch);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <DateRangePicker 
            date={dateRange} 
            onDateChange={handleDateRangeChange} 
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Members"
            value={dashboardData?.active_members || 0}
            description="Currently active"
            icon={<Users className="h-4 w-4" />}
            variant="neutral"
            isLoading={isLoading}
          />
          <StatCard
            title="New Members"
            value={dashboardData?.new_members_monthly || 0}
            description="In the last 30 days"
            icon={<TrendingUp className="h-4 w-4" />}
            variant="increase"
            isLoading={isLoading}
            trend={5}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(dashboardData?.total_revenue)}
            description="In the last 30 days"
            icon={<DollarSign className="h-4 w-4" />}
            variant="info"
            isLoading={isLoading}
            trend={8}
          />
          <StatCard
            title="Upcoming Renewals"
            value={dashboardData?.upcoming_renewals || 0}
            description="In the next 15 days"
            icon={<Calendar className="h-4 w-4" />}
            variant="warning"
            isLoading={isLoading}
          />
        </div>

        {/* Revenue & Membership trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <RevenueChart dateRange={dateRange} />
          <MembershipTrendChart dateRange={dateRange} />
        </div>

        {/* Churn & Trainers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ChurnRiskList />
          </div>
          <TrainerPerformance />
        </div>

        {/* Class Performance & Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ClassPerformanceTable />
          <RevenueBreakdownChart dateRange={dateRange} />
        </div>

        {/* Inventory Alerts */}
        <div className="mb-6">
          <InventoryAlertsList />
        </div>
      </div>
    </Container>
  );
};

export default AnalyticsDashboard;
