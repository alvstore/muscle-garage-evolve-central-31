import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock } from 'lucide-react';

interface HourlyData {
  hour: string;
  weekday: number;
  weekend: number;
}

interface PeakHoursSectionProps {
  data?: HourlyData[];
  isLoading?: boolean;
}

const defaultData: HourlyData[] = [
  { hour: '6 AM', weekday: 15, weekend: 8 },
  { hour: '7 AM', weekday: 28, weekend: 12 },
  { hour: '8 AM', weekday: 45, weekend: 25 },
  { hour: '9 AM', weekday: 35, weekend: 38 },
  { hour: '10 AM', weekday: 28, weekend: 52 },
  { hour: '11 AM', weekday: 25, weekend: 60 },
  { hour: '12 PM', weekday: 32, weekend: 55 },
  { hour: '1 PM', weekday: 38, weekend: 48 },
  { hour: '2 PM', weekday: 30, weekend: 40 },
  { hour: '3 PM', weekday: 25, weekend: 35 },
  { hour: '4 PM', weekday: 40, weekend: 30 },
  { hour: '5 PM', weekday: 65, weekend: 28 },
  { hour: '6 PM', weekday: 85, weekend: 25 },
  { hour: '7 PM', weekday: 72, weekend: 20 },
  { hour: '8 PM', weekday: 55, weekend: 15 },
  { hour: '9 PM', weekday: 30, weekend: 10 },
  { hour: '10 PM', weekday: 15, weekend: 5 },
];

const PeakHoursSection: React.FC<PeakHoursSectionProps> = ({ data = defaultData, isLoading = false }) => {
  // Memoize the max capacity calculation to prevent unnecessary recalculations
  const maxCapacity = React.useMemo(() => {
    const allValues = data.flatMap(item => [item.weekday, item.weekend]);
    return Math.max(...allValues) + 10; // Add some padding
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-semibold">Peak Hours Analysis</CardTitle>
          <CardDescription>Member traffic throughout the day</CardDescription>
        </div>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="combined">Combined</TabsTrigger>
            <TabsTrigger value="weekday">Weekday</TabsTrigger>
            <TabsTrigger value="weekend">Weekend</TabsTrigger>
          </TabsList>
          <TabsContent value="combined" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, maxCapacity]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="weekday" 
                    name="Weekday" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weekend" 
                    name="Weekend" 
                    stackId="2"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="weekday" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, maxCapacity]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="weekday" 
                    name="Weekday" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="weekend" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, maxCapacity]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="weekend" 
                    name="Weekend" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(PeakHoursSection);
