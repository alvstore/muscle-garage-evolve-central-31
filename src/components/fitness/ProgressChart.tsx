
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart - in a real application, this would come from props
const sampleData = [
  { month: 'Jan', weight: 75, bodyFat: 20 },
  { month: 'Feb', weight: 74.2, bodyFat: 19.5 },
  { month: 'Mar', weight: 73.5, bodyFat: 19 },
  { month: 'Apr', weight: 72.8, bodyFat: 18.5 },
  { month: 'May', weight: 71.5, bodyFat: 17.8 },
];

export const ProgressChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={sampleData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
        <YAxis 
          yAxisId="left" 
          stroke="#6B7280" 
          fontSize={12} 
          domain={['auto', 'auto']}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke="#6B7280" 
          fontSize={12} 
          domain={['auto', 'auto']}
        />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="weight" 
          stroke="#4f46e5" 
          name="Weight (kg)" 
          activeDot={{ r: 8 }} 
          strokeWidth={2}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="bodyFat" 
          stroke="#ef4444" 
          name="Body Fat (%)" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
