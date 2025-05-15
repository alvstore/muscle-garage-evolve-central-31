
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { followUpService } from '@/services/followUpService';
import { useBranch } from '@/hooks/use-branch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LeadsList } from '@/components/crm/LeadsList';
import { Lead, FollowUpHistory } from '@/types/crm';
import { Skeleton } from '@/components/ui/skeleton';

const CRMDashboard: React.FC = () => {
  const { currentBranch } = useBranch();
  const [leadData, setLeadData] = useState<Lead[]>([]);
  const [followUpData, setFollowUpData] = useState<FollowUpHistory[]>([]);

  // Fetch leads data
  const { data: leadsResponse, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  // Fetch follow-up data
  const { data: followUpsResponse, isLoading: isLoadingFollowUps } = useQuery({
    queryKey: ['followups', currentBranch?.id],
    queryFn: () => followUpService.getFollowUpHistory(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  useEffect(() => {
    if (leadsResponse) {
      // Make sure we're working with an array of leads
      if (Array.isArray(leadsResponse)) {
        setLeadData(leadsResponse);
      } else if (leadsResponse.data && Array.isArray(leadsResponse.data)) {
        setLeadData(leadsResponse.data);
      }
    }
  }, [leadsResponse]);

  useEffect(() => {
    if (followUpsResponse) {
      // Make sure we're working with an array of follow-ups
      if (Array.isArray(followUpsResponse)) {
        setFollowUpData(followUpsResponse);
      } else if (followUpsResponse.data && Array.isArray(followUpsResponse.data)) {
        setFollowUpData(followUpsResponse.data);
      }
    }
  }, [followUpsResponse]);

  // Calculate statistics and prepare chart data
  const stats = React.useMemo(() => {
    const totalLeads = leadData.length || 0;
    const newLeads = leadData.filter(lead => lead.status === 'new').length || 0;
    const contactedLeads = leadData.filter(lead => lead.status === 'contacted').length || 0;
    const qualifiedLeads = leadData.filter(lead => lead.status === 'qualified').length || 0;
    const convertedLeads = leadData.filter(lead => lead.status === 'converted').length || 0;
    
    const totalFollowUps = followUpData.length || 0;
    const scheduledFollowUps = followUpData.filter(f => f.status === 'scheduled').length || 0;
    const completedFollowUps = followUpData.filter(f => f.status === 'completed' || f.status === 'sent').length || 0;
    
    const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    
    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      totalFollowUps,
      scheduledFollowUps,
      completedFollowUps,
      conversionRate,
    };
  }, [leadData, followUpData]);
  
  // Prepare funnel stage data for the chart
  const funnelStageData = React.useMemo(() => {
    const stageMap: Record<string, number> = {
      cold: 0,
      warm: 0,
      hot: 0,
      proposal: 0,
      negotiation: 0,
      closed_won: 0,
      closed_lost: 0,
    };
    
    leadData.forEach(lead => {
      if (lead.funnel_stage && stageMap[lead.funnel_stage] !== undefined) {
        stageMap[lead.funnel_stage]++;
      }
    });
    
    return Object.entries(stageMap).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()),
      value
    }));
  }, [leadData]);
  
  // Prepare source data for pie chart
  const sourceData = React.useMemo(() => {
    const sourceMap: Record<string, number> = {};
    
    leadData.forEach(lead => {
      if (lead.source) {
        sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1;
      }
    });
    
    return Object.entries(sourceMap).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()),
      value
    }));
  }, [leadData]);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50', '#F44336'];
  
  // Loading state
  if (isLoadingLeads || isLoadingFollowUps) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newLeads} new leads this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.convertedLeads} converted leads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFollowUps}</div>
            <p className="text-xs text-muted-foreground">
              {stats.scheduledFollowUps} scheduled follow-ups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.contactedLeads} contacted leads
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts & Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Funnel Stage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Leads by Funnel Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={funnelStageData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Source Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;
