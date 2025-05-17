import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branches';
import { formatCurrency } from '@/utils/stringUtils';

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueSectionProps {
  data?: RevenueData[];
}

const RevenueSection = ({ data: initialData }: RevenueSectionProps) => {
  const [data, setData] = useState<RevenueData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      return;
    }
    
    const fetchRevenueData = async () => {
      if (!currentBranch?.id) return;

      setIsLoading(true);
      
      try {
        // Get the last 6 months
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push(month);
        }
        
        // Format months for query and display
        const monthData = await Promise.all(months.map(async (month) => {
          const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
          const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
          
          const monthName = month.toLocaleString('default', { month: 'short' });
          
          // Fetch income for the month
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('branch_id', currentBranch.id)
            .eq('type', 'income')
            .gte('transaction_date', startDate.toISOString())
            .lte('transaction_date', endDate.toISOString());
            
          if (incomeError) {
            console.error('Error fetching income data:', incomeError);
            throw incomeError;
          }
          
          // Fetch expenses for the month
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('branch_id', currentBranch.id)
            .eq('type', 'expense')
            .gte('transaction_date', startDate.toISOString())
            .lte('transaction_date', endDate.toISOString());
            
          if (expenseError) {
            console.error('Error fetching expense data:', expenseError);
            throw expenseError;
          }
          
          const revenue = incomeData.reduce((sum, item) => sum + (item.amount || 0), 0);
          const expenses = expenseData.reduce((sum, item) => sum + (item.amount || 0), 0);
          const profit = revenue - expenses;
          
          return {
            month: monthName,
            revenue,
            expenses,
            profit
          };
        }));
        
        setData(monthData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [currentBranch?.id, initialData]);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue, expenses and profit</CardDescription>
        </div>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalProfit)}</p>
          </div>
        </div>
        
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading revenue data...</p>
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
                  tickFormatter={(value) => `${formatCurrency(value).replace('₹', '₹')}`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
                <Bar dataKey="profit" name="Profit" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
