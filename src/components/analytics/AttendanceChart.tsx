
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', attendance: 45 },
  { day: 'Tue', attendance: 52 },
  { day: 'Wed', attendance: 49 },
  { day: 'Thu', attendance: 63 },
  { day: 'Fri', attendance: 56 },
  { day: 'Sat', attendance: 37 },
  { day: 'Sun', attendance: 29 },
];

const AttendanceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tick={false} hide />
        <YAxis hide />
        <Tooltip 
          formatter={(value) => [`${value} members`, 'Attendance']}
          labelFormatter={(label) => `${label}`}
        />
        <Area 
          type="monotone" 
          dataKey="attendance" 
          stroke="#6366f1" 
          fillOpacity={1} 
          fill="url(#colorAttendance)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
