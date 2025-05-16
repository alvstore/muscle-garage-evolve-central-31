import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinanceBarChartProps {
  data: {
    name: string;
    [key: string]: any;
  }[];
  keys: {
    key: string;
    color: string;
    name: string;
  }[];
  title?: string;
  height?: number | string;
  showLegend?: boolean;
  stacked?: boolean;
}

const FinanceBarChart: React.FC<FinanceBarChartProps> = ({ 
  data, 
  keys,
  title = "Financial Comparison",
  height = 350,
  showLegend = true,
  stacked = false
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
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
              
              {keys.map((item, index) => (
                <Bar 
                  key={item.key}
                  dataKey={item.key} 
                  name={item.name}
                  fill={item.color}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? "a" : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceBarChart;
