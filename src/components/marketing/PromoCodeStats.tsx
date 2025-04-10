
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
const usageData = [
  { date: '2023-07-01', usage: 5 },
  { date: '2023-07-02', usage: 3 },
  { date: '2023-07-03', usage: 8 },
  { date: '2023-07-04', usage: 12 },
  { date: '2023-07-05', usage: 7 },
  { date: '2023-07-06', usage: 10 },
  { date: '2023-07-07', usage: 15 },
];

const promoTypeData = [
  { name: 'Percentage', value: 45 },
  { name: 'Fixed Amount', value: 35 },
  { name: 'Free Product', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const conversionData = [
  { name: 'SUMMER23', conversion: 45 },
  { name: 'WELCOME10', conversion: 65 },
  { name: 'MEMBER20', conversion: 52 },
  { name: 'FLASH50', conversion: 78 },
  { name: 'LOYALTY15', conversion: 60 },
];

const PromoCodeStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Promo Code Usage</CardTitle>
          <CardDescription>Daily usage over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usageData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return `Date: ${d.toLocaleDateString()}`;
                  }}
                  formatter={(value) => [`${value} uses`, 'Usage']}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Promo Code Types</CardTitle>
          <CardDescription>Distribution by discount type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={promoTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {promoTypeData.map((entry, index) => (
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
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Promo Code Conversion Rates</CardTitle>
          <CardDescription>Percentage of users who used the code after viewing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Conversion Rate']}
                />
                <Bar dataKey="conversion" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodeStats;
