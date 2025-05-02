
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { format, subDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MembershipTrendProps {
  dateRange: DateRange;
}

const MembershipTrendChart: React.FC<MembershipTrendProps> = ({ dateRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMembershipTrends = async () => {
      if (!currentBranch?.id || !dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.rpc(
          'get_membership_trend',
          {
            branch_id_param: currentBranch.id,
            start_date: format(dateRange.from, 'yyyy-MM-dd'),
            end_date: format(dateRange.to, 'yyyy-MM-dd')
          }
        );
        
        if (error) throw error;
        
        // Format the data for the chart
        const chartData = data.map(day => ({
          date: format(new Date(day.date_point), 'MMM dd'),
          'New Members': day.new_members,
          'Cancelled': day.cancelled_members,
          'Net Change': day.net_change
        }));
        
        setData(chartData);
      } catch (err) {
        console.error('Error fetching membership trends:', err);
        setError('Failed to load membership trends');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembershipTrends();
  }, [currentBranch?.id, dateRange.from, dateRange.to]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Membership Trends</CardTitle>
        <CardDescription>New and cancelled memberships over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : error ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <Tabs defaultValue="bar">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="bar" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="New Members" fill="#8884d8" />
                  <Bar dataKey="Cancelled" fill="#ff7f7f" />
                  <Bar dataKey="Net Change" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="line" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="New Members" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Cancelled" stroke="#ff7f7f" />
                  <Line type="monotone" dataKey="Net Change" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipTrendChart;
