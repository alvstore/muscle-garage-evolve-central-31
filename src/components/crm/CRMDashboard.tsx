import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { followUpService } from '@/services/followUpService';
import { useBranch } from '@/hooks/use-branch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const CRMDashboard = () => {
  const { currentBranch } = useBranch();

  // Fetch leads data
  const { data: leads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  // Fetch follow-ups data - Fix the incorrect argument count
  const { data: followUps, isLoading: isLoadingFollowUps } = useQuery({
    queryKey: ['allFollowUps', currentBranch?.id],
    queryFn: () => followUpService.getFollowUpHistory(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  // Calculate leads by stage
  const leadsByStage = React.useMemo(() => {
    if (!leads) return [];
    
    const stages = ['cold', 'warm', 'hot', 'won', 'lost'];
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: leads.filter(lead => lead.funnel_stage === stage).length
    }));
  }, [leads]);

  // Calculate follow-up completion rate
  const followUpCompletion = React.useMemo(() => {
    if (!followUps) return [];
    
    const total = followUps.length;
    const completed = followUps.filter(f => f.status !== 'scheduled' && f.status !== 'pending').length;
    const pending = total - completed;
    
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending }
    ];
  }, [followUps]);

  // Calculate monthly lead acquisition
  const monthlyLeads = React.useMemo(() => {
    if (!leads) return [];
    
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthLeads = leads.filter(lead => {
        const createdAt = new Date(lead.created_at || '');
        return createdAt >= start && createdAt <= end;
      });
      
      return {
        name: format(date, 'MMM'),
        value: monthLeads.length
      };
    }).reverse();
    
    return months;
  }, [leads]);

  // Calculate conversion rate
  const conversionRate = React.useMemo(() => {
    if (!leads) return 0;
    
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'won' || lead.status === 'converted').length;
    
    return totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  }, [leads]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{leads?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{leads?.filter(l => l.funnel_stage === 'hot').length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{conversionRate}%</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingFollowUps ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{followUps?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads by Stage</CardTitle>
            <CardDescription>Distribution of leads across sales funnel stages</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsByStage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leadsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Lead Acquisition</CardTitle>
            <CardDescription>New leads acquired per month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyLeads}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>Leads recently converted to members</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLeads ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {leads?.filter(lead => lead.status === 'converted' || lead.status === 'won')
                  .sort((a, b) => {
                    const dateA = a.conversion_date ? new Date(a.conversion_date).getTime() : 0;
                    const dateB = b.conversion_date ? new Date(b.conversion_date).getTime() : 0;
                    return dateB - dateA;
                  })
                  .slice(0, 5)
                  .map(lead => (
                    <div key={lead.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">{lead.name || `${lead.first_name} ${lead.last_name}`}</div>
                        <div className="text-sm text-muted-foreground">{lead.email}</div>
                      </div>
                      <div className="text-sm">
                        {lead.conversion_date ? format(new Date(lead.conversion_date), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </div>
                  ))}
                {(leads?.filter(lead => lead.status === 'converted' || lead.status === 'won').length || 0) === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No conversions yet</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Completion</CardTitle>
            <CardDescription>Status of scheduled follow-ups</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFollowUps ? (
              <div className="h-60 flex items-center justify-center">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={followUpCompletion}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {followUpCompletion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FFBB28'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
