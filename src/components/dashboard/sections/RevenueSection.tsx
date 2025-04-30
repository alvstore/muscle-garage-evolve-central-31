
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

interface RevenueSectionProps {
  data?: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

const RevenueSection = ({ data: initialData }: RevenueSectionProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialData);
  const { currentBranch } = useBranch();

  useEffect(() => {
    // If initial data was provided, use it
    if (initialData) {
      setData(initialData);
      return;
    }
    
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        // Get the current date
        const now = new Date();
        // Get date 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        
        // Fetch income data
        let incomeQuery = supabase
          .from('transactions')
          .select('amount, transaction_date')
          .eq('type', 'income')
          .gte('transaction_date', sixMonthsAgo.toISOString())
          .order('transaction_date', { ascending: true });
        
        // Fetch expense data
        let expenseQuery = supabase
          .from('transactions')
          .select('amount, transaction_date')
          .eq('type', 'expense')
          .gte('transaction_date', sixMonthsAgo.toISOString())
          .order('transaction_date', { ascending: true });
        
        // Apply branch filter if available
        if (currentBranch?.id) {
          incomeQuery = incomeQuery.eq('branch_id', currentBranch.id);
          expenseQuery = expenseQuery.eq('branch_id', currentBranch.id);
        }
        
        // Execute queries in parallel
        const [incomeResult, expenseResult] = await Promise.all([
          incomeQuery,
          expenseQuery
        ]);
        
        if (incomeResult.error) throw incomeResult.error;
        if (expenseResult.error) throw expenseResult.error;
        
        // Process the data to group by month
        const months: {[key: string]: {revenue: number, expenses: number, profit: number}} = {};
        
        // Process income data
        (incomeResult.data || []).forEach(item => {
          const date = new Date(item.transaction_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleString('default', { month: 'short' });
          const yearMonth = `${monthName} ${date.getFullYear()}`;
          
          if (!months[monthKey]) {
            months[monthKey] = { 
              month: yearMonth, 
              revenue: 0, 
              expenses: 0, 
              profit: 0 
            };
          }
          
          months[monthKey].revenue += item.amount || 0;
        });
        
        // Process expense data
        (expenseResult.data || []).forEach(item => {
          const date = new Date(item.transaction_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleString('default', { month: 'short' });
          const yearMonth = `${monthName} ${date.getFullYear()}`;
          
          if (!months[monthKey]) {
            months[monthKey] = { 
              month: yearMonth, 
              revenue: 0, 
              expenses: 0, 
              profit: 0 
            };
          }
          
          months[monthKey].expenses += item.amount || 0;
        });
        
        // Calculate profits and transform to array sorted by date
        const chartData = Object.keys(months)
          .sort()
          .map(key => {
            const monthData = months[key];
            monthData.profit = monthData.revenue - monthData.expenses;
            return monthData;
          });
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [initialData, currentBranch?.id]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue, expenses and profit</CardDescription>
        </div>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[350px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
              <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
              <Bar dataKey="profit" name="Profit" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
