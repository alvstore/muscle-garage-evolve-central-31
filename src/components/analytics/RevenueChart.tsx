
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from '@/hooks/use-stats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface RevenueChartProps {
  dateRange: DateRange;
  data?: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const RevenueChart = ({ dateRange, data = [] }: RevenueChartProps) => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use provided data or simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Use provided data if available, otherwise use sample data
      if (data && data.length > 0) {
        setRevenueData(data);
      } else {
        // Simulate API fetch with sample data
        const sampleData = [
          { month: 'Jan', revenue: 25000 },
          { month: 'Feb', revenue: 35000 },
          { month: 'Mar', revenue: 32000 },
          { month: 'Apr', revenue: 27000 },
          { month: 'May', revenue: 30000 },
          { month: 'Jun', revenue: 42000 },
        ];
        
        setRevenueData(sampleData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load revenue data'));
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-72">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-72 text-red-500">
            {error.message || 'Error loading data'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
