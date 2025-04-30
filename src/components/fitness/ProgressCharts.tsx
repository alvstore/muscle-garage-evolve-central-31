
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BodyMeasurement, PROGRESS_TIMEFRAMES, ProgressTimeframe } from '@/types/measurements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProgressChartsProps {
  measurements: BodyMeasurement[];
  timeframe: ProgressTimeframe['value'];
  onTimeframeChange: (timeframe: ProgressTimeframe['value']) => void;
  isLoading: boolean;
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({
  measurements,
  timeframe,
  onTimeframeChange,
  isLoading
}) => {
  // Filter measurements by timeframe
  const filteredMeasurements = React.useMemo(() => {
    if (timeframe === 'all') return [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeframe) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return [...measurements]
      .filter(m => new Date(m.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [measurements, timeframe]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (measurements.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No measurement data available.</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first measurement to start tracking progress.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Progress Trends</h3>
        <Select
          value={timeframe}
          onValueChange={(value) => onTimeframeChange(value as ProgressTimeframe['value'])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {PROGRESS_TIMEFRAMES.map((tf) => (
              <SelectItem key={tf.value} value={tf.value}>
                {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="weight">
        <TabsList className="mb-4">
          <TabsTrigger value="weight">Weight / BMI</TabsTrigger>
          <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
          <TabsTrigger value="bodyFat">Body Fat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={filteredMeasurements.map(m => ({
                    date: formatDate(m.date),
                    weight: m.weight,
                    bmi: m.bmi
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bmi"
                    name="BMI"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="measurements">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={filteredMeasurements.map(m => ({
                    date: formatDate(m.date),
                    chest: m.chest,
                    waist: m.waist,
                    hips: m.hips,
                    biceps: m.biceps,
                    thighs: m.thighs
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chest" name="Chest (cm)" stroke="#8884d8" />
                  <Line type="monotone" dataKey="waist" name="Waist (cm)" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="hips" name="Hips (cm)" stroke="#ffc658" />
                  <Line type="monotone" dataKey="biceps" name="Biceps (cm)" stroke="#ff8042" />
                  <Line type="monotone" dataKey="thighs" name="Thighs (cm)" stroke="#0088fe" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bodyFat">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={filteredMeasurements.map(m => ({
                    date: formatDate(m.date),
                    bodyFat: m.bodyFat
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    name="Body Fat %"
                    stroke="#ff8042"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressCharts;
