
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DateRange } from 'react-day-picker';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface RevenueBreakdownProps {
  dateRange: DateRange;
}

interface CategoryRevenue {
  name: string;
  value: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#7bd9dd', '#ff8042'];

const RevenueBreakdownChart: React.FC<RevenueBreakdownProps> = ({ dateRange }) => {
  const [data, setData] = useState<CategoryRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchRevenueBreakdown = async () => {
      if (!currentBranch?.id || !dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.rpc(
          'get_revenue_breakdown',
          {
            branch_id_param: currentBranch.id,
            start_date: format(dateRange.from, 'yyyy-MM-dd'),
            end_date: format(dateRange.to, 'yyyy-MM-dd')
          }
        );
        
        if (error) throw error;
        
        // Format the data for the pie chart
        const chartData = data.map(item => ({
          name: item.category,
          value: parseFloat(item.amount)
        }));
        
        setData(chartData);
      } catch (err) {
        console.error('Error fetching revenue breakdown:', err);
        setError('Failed to load revenue breakdown');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRevenueBreakdown();
  }, [currentBranch?.id, dateRange.from, dateRange.to]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Revenue Breakdown</CardTitle>
        <CardDescription>Revenue by category for the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full mx-auto" />
          </div>
        ) : error ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No revenue data available for this period</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownChart;
