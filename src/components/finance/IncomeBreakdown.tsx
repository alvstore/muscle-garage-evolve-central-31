
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IncomeBreakdownProps {
  data: {
    category: string;
    amount: number;
    color: string;
  }[];
  period?: 'monthly' | 'quarterly' | 'yearly';
}

const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#ec4899', '#f59e0b'];

const IncomeBreakdown: React.FC<IncomeBreakdownProps> = ({ 
  data = [], 
  period = 'monthly' 
}) => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'quarterly' | 'yearly'>(period);
  
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount,
    color: item.color || COLORS[Math.floor(Math.random() * COLORS.length)]
  }));
  
  const totalIncome = chartData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Income Breakdown</CardTitle>
        <CardDescription>Income by category</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            {chartData.length > 0 ? (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categories</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {chartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No income data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quarterly" className="h-[300px] flex items-center justify-center text-muted-foreground">
            Quarterly breakdown coming soon
          </TabsContent>
          
          <TabsContent value="yearly" className="h-[300px] flex items-center justify-center text-muted-foreground">
            Yearly breakdown coming soon
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IncomeBreakdown;
