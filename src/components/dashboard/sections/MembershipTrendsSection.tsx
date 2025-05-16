import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MembershipData {
  month: string;
  newJoins: number;
  renewals: number;
  cancellations: number;
  netGrowth: number;
}

interface MembershipTrendsSectionProps {
  data?: MembershipData[];
  isLoading?: boolean;
}

const defaultData: MembershipData[] = [
  { month: 'Jan', newJoins: 45, renewals: 120, cancellations: 15, netGrowth: 30 },
  { month: 'Feb', newJoins: 38, renewals: 110, cancellations: 18, netGrowth: 20 },
  { month: 'Mar', newJoins: 52, renewals: 135, cancellations: 12, netGrowth: 40 },
  { month: 'Apr', newJoins: 65, renewals: 125, cancellations: 10, netGrowth: 55 },
  { month: 'May', newJoins: 48, renewals: 140, cancellations: 22, netGrowth: 26 },
  { month: 'Jun', newJoins: 55, renewals: 130, cancellations: 18, netGrowth: 37 },
  { month: 'Jul', newJoins: 60, renewals: 145, cancellations: 14, netGrowth: 46 },
  { month: 'Aug', newJoins: 58, renewals: 150, cancellations: 20, netGrowth: 38 },
  { month: 'Sep', newJoins: 70, renewals: 155, cancellations: 16, netGrowth: 54 },
  { month: 'Oct', newJoins: 62, renewals: 160, cancellations: 18, netGrowth: 44 },
  { month: 'Nov', newJoins: 68, renewals: 165, cancellations: 14, netGrowth: 54 },
  { month: 'Dec', newJoins: 75, renewals: 170, cancellations: 12, netGrowth: 63 },
];

const MembershipTrendsSection: React.FC<MembershipTrendsSectionProps> = ({ data = defaultData, isLoading = false }) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-semibold">Membership Trends</CardTitle>
          <CardDescription>New joins, renewals, and cancellations</CardDescription>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="growth">Net Growth</TabsTrigger>
            <TabsTrigger value="joins">New Joins</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>
          <TabsContent value="growth" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
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
                  <Line 
                    type="monotone" 
                    dataKey="netGrowth" 
                    name="Net Growth" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="joins" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
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
                  <Line 
                    type="monotone" 
                    dataKey="newJoins" 
                    name="New Joins" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="retention" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
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
                  <Line 
                    type="monotone" 
                    dataKey="renewals" 
                    name="Renewals" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cancellations" 
                    name="Cancellations" 
                    stroke="#ff8042" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(MembershipTrendsSection);
