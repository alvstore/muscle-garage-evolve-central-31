
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';

interface MembershipChartProps {
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const MembershipChart: React.FC<MembershipChartProps> = ({ dateRange }) => {
  // Generate data based on the date range or use default data
  const generateData = () => {
    if (!dateRange) {
      return [
        { month: 'Jan', new: 10, cancelled: 3 },
        { month: 'Feb', new: 14, cancelled: 5 },
        { month: 'Mar', new: 12, cancelled: 2 },
        { month: 'Apr', new: 19, cancelled: 4 },
        { month: 'May', new: 15, cancelled: 6 },
        { month: 'Jun', new: 21, cancelled: 3 },
      ];
    }
    
    const data = [];
    // Get last 6 months from the end date
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(dateRange.to, i);
      data.push({
        month: format(date, 'MMM'),
        new: Math.floor(Math.random() * 20) + 5,
        cancelled: Math.floor(Math.random() * 8) + 1,
      });
    }
    return data;
  };
  
  const data = generateData();
  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" tick={false} hide />
        <YAxis hide />
        <Tooltip 
          formatter={(value, name) => [value, name === 'new' ? 'New Members' : 'Cancelled']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="new" fill="#22c55e" stackId="stack" />
        <Bar dataKey="cancelled" fill="#ef4444" stackId="stack" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MembershipChart;
