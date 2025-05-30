import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalendarDays } from 'lucide-react';

interface ClassData {
  name: string;
  attendance: number;
  capacity: number;
  revenue: number;
}

interface ClassPerformanceSectionProps {
  data?: ClassData[];
  isLoading?: boolean;
}

const defaultData: ClassData[] = [
  { name: 'Yoga', attendance: 85, capacity: 100, revenue: 42500 },
  { name: 'CrossFit', attendance: 92, capacity: 100, revenue: 55200 },
  { name: 'Zumba', attendance: 78, capacity: 100, revenue: 31200 },
  { name: 'HIIT', attendance: 88, capacity: 100, revenue: 44000 },
  { name: 'Pilates', attendance: 72, capacity: 100, revenue: 28800 },
  { name: 'Spinning', attendance: 95, capacity: 100, revenue: 57000 },
];

const ClassPerformanceSection: React.FC<ClassPerformanceSectionProps> = ({ data = defaultData, isLoading = false }) => {
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const getAttendancePercentage = (attendance: number, capacity: number) => {
    return Math.round((attendance / capacity) * 100);
  };

  // Memoize sorted data to prevent unnecessary recalculations
  const sortedByAttendance = React.useMemo(() => 
    [...data].sort((a, b) => 
      getAttendancePercentage(b.attendance, b.capacity) - getAttendancePercentage(a.attendance, a.capacity)
    ), [data]
  );

  const sortedByRevenue = React.useMemo(() => 
    [...data].sort((a, b) => b.revenue - a.revenue), [data]
  );

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-semibold">Class Performance</CardTitle>
          <CardDescription>Attendance and revenue by class type</CardDescription>
        </div>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedByAttendance}
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
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'attendance') {
                        const item = props.payload;
                        return [`${getAttendancePercentage(item.attendance, item.capacity)}%`, 'Attendance'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="attendance" 
                    name="Attendance" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    // Custom data for display
                    data={sortedByAttendance.map(item => ({
                      ...item,
                      attendance: getAttendancePercentage(item.attendance, item.capacity)
                    }))}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedByRevenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue" 
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(ClassPerformanceSection);
