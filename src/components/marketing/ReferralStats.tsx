
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock data
const referralData = [
  { month: 'Jan', count: 12, converted: 5 },
  { month: 'Feb', count: 19, converted: 8 },
  { month: 'Mar', count: 25, converted: 12 },
  { month: 'Apr', count: 32, converted: 18 },
  { month: 'May', count: 45, converted: 25 },
  { month: 'Jun', count: 38, converted: 20 },
  { month: 'Jul', count: 50, converted: 30 },
];

const statusData = [
  { name: 'Pending', value: 35 },
  { name: 'Approved', value: 45 },
  { name: 'Rewarded', value: 10 },
  { name: 'Rejected', value: 10 },
];

const COLORS = ['#FFB547', '#2196F3', '#4CAF50', '#F44336'];

const topReferrersData = [
  { name: 'John Doe', count: 15 },
  { name: 'Jane Smith', count: 12 },
  { name: 'Michael Brown', count: 8 },
  { name: 'Emily Davis', count: 7 },
  { name: 'David Wilson', count: 5 },
];

const ReferralStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Referral Performance</CardTitle>
          <CardDescription>Monthly referrals and conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={referralData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Total Referrals" dataKey="count" fill="#8884d8" />
                <Bar name="Converted" dataKey="converted" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Referral Status</CardTitle>
          <CardDescription>Distribution by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
          <CardDescription>Members with most successful referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topReferrersData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Referrals" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;
