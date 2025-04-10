
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressMetrics } from '@/types/class';
import { format, parseISO } from 'date-fns';

interface ProgressData {
  date: string;
  metrics: ProgressMetrics;
}

interface MemberProgressChartProps {
  data: ProgressData[];
  memberId: string;
  memberName: string;
  metricType?: keyof ProgressMetrics;
}

const MemberProgressChart = ({ 
  data, 
  memberId, 
  memberName,
  metricType = 'weight'
}: MemberProgressChartProps) => {
  // Transform data for the selected metric
  const chartData = data.map(item => ({
    date: item.date,
    value: item.metrics[metricType]
  }));
  
  // Define colors based on metric type
  const getMetricColor = (type: keyof ProgressMetrics) => {
    switch(type) {
      case 'weight': return '#4f46e5'; // indigo
      case 'bodyFatPercentage': return '#ef4444'; // red
      case 'bmi': return '#f59e0b'; // amber
      case 'muscleGain': return '#10b981'; // emerald
      default: return '#6366f1';
    }
  };

  // Define labels based on metric type
  const getMetricLabel = (type: keyof ProgressMetrics) => {
    switch(type) {
      case 'weight': return 'Weight (kg)';
      case 'bodyFatPercentage': return 'Body Fat (%)';
      case 'bmi': return 'BMI';
      case 'muscleGain': return 'Muscle Gain (kg)';
      default: return 'Value';
    }
  };
  
  const lineColor = getMetricColor(metricType);
  
  // Format dates for the chart tooltip
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border shadow-sm rounded">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm">
            {getMetricLabel(metricType)}: <span className="font-medium">{payload[0].value.toFixed(1)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberProgressChart;
