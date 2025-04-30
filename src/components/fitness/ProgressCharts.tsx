
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays } from 'date-fns';
import { BodyMeasurement, PROGRESS_TIMEFRAMES } from '@/types/measurements';
import { Loader2 } from 'lucide-react';

interface ProgressChartsProps {
  measurements: BodyMeasurement[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  isLoading: boolean;
}

const ProgressCharts = ({ 
  measurements,
  timeframe,
  onTimeframeChange,
  isLoading
}: ProgressChartsProps) => {
  const [metricType, setMetricType] = useState('weight');

  const getFilteredData = () => {
    if (measurements.length === 0) return [];

    // Apply timeframe filter
    let filteredData = [...measurements];
    const now = new Date();
    
    switch (timeframe) {
      case '7d':
        filteredData = measurements.filter(m => new Date(m.date) >= subDays(now, 7));
        break;
      case '30d':
        filteredData = measurements.filter(m => new Date(m.date) >= subDays(now, 30));
        break;
      case '90d':
        filteredData = measurements.filter(m => new Date(m.date) >= subDays(now, 90));
        break;
      case '6m':
        filteredData = measurements.filter(m => new Date(m.date) >= subDays(now, 180));
        break;
      case '1y':
        filteredData = measurements.filter(m => new Date(m.date) >= subDays(now, 365));
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    // Sort by date ascending
    return filteredData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const filteredData = getFilteredData();

  // Format data for Recharts
  const chartData = filteredData.map(measurement => ({
    date: format(new Date(measurement.date), 'MMM dd'),
    weight: measurement.weight || null,
    bodyFat: measurement.body_fat_percentage || null,
    chest: measurement.chest || null,
    waist: measurement.waist || null,
    hips: measurement.hips || null
  }));

  const getMetricLabel = () => {
    switch (metricType) {
      case 'weight': return 'Weight (kg)';
      case 'bodyFat': return 'Body Fat (%)';
      case 'chest': return 'Chest (cm)';
      case 'waist': return 'Waist (cm)';
      case 'hips': return 'Hips (cm)';
      default: return '';
    }
  };

  const getLineColor = () => {
    switch (metricType) {
      case 'weight': return '#8884d8';
      case 'bodyFat': return '#82ca9d';
      case 'chest': return '#ffc658';
      case 'waist': return '#ff8042';
      case 'hips': return '#0088fe';
      default: return '#8884d8';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Progress Analytics</h3>
          <p className="text-muted-foreground">Track changes over time</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {PROGRESS_TIMEFRAMES.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="bodyFat">Body Fat</SelectItem>
              <SelectItem value="chest">Chest</SelectItem>
              <SelectItem value="waist">Waist</SelectItem>
              <SelectItem value="hips">Hips</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getMetricLabel()} Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : chartData.length > 1 ? (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={metricType} 
                    stroke={getLineColor()} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {chartData.length === 0 ? (
                <p>No measurement data available for the selected timeframe.</p>
              ) : (
                <p>Need at least two measurements to display a chart.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
