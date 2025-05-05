
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', new: 10, cancelled: 3 },
  { month: 'Feb', new: 14, cancelled: 5 },
  { month: 'Mar', new: 12, cancelled: 2 },
  { month: 'Apr', new: 19, cancelled: 4 },
  { month: 'May', new: 15, cancelled: 6 },
  { month: 'Jun', new: 21, cancelled: 3 },
];

const MembershipChart: React.FC = () => {
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
