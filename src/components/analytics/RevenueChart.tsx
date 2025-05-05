
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface RevenueChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ dateRange }) => {
  // Generate data based on the date range
  const generateData = () => {
    const data = [];
    const totalDays = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24));
    const daysToShow = Math.min(totalDays, 30); // Limit to 30 days

    for (let i = 0; i < daysToShow; i++) {
      const date = subDays(dateRange.to, i);
      data.unshift({
        date: format(date, 'MMM dd'),
        revenue: Math.floor(Math.random() * 5000) + 2000,
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis 
          dataKey="date" 
          tick={false} 
          hide 
        />
        <YAxis 
          hide 
        />
        <Tooltip 
          formatter={(value: number) => [`₹${value}`, 'Revenue']}
          labelFormatter={(label: string) => `${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={2} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
