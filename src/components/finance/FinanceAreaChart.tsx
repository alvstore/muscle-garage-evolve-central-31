import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinanceAreaChartProps {
  data: {
    name: string;
    revenue?: number;
    expenses?: number;
    profit?: number;
  }[];
  title?: string;
  height?: number | string;
  showLegend?: boolean;
}

const FinanceAreaChart: React.FC<FinanceAreaChartProps> = ({ 
  data, 
  title = "Revenue Overview",
  height = 350,
  showLegend = true
}) => {
  // Format the data for better display
  const formattedData = data.map(item => ({
    ...item,
    name: item.name.includes('-') 
      ? new Date(item.name).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : item.name
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              {showLegend && <Legend />}
              {data.some(item => 'revenue' in item) && (
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4CAF50" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Revenue"
                />
              )}
              {data.some(item => 'expenses' in item) && (
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#F44336" 
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                  name="Expenses"
                />
              )}
              {data.some(item => 'profit' in item) && (
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#2196F3" 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  name="Profit"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceAreaChart;
