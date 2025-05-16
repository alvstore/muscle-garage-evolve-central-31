import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
};

interface FinanceBarChartProps {
  data?: ChartDataItem[];
  keys?: {
    key: string;
    color: string;
    name: string;
  }[];
  title?: string;
  height?: number | string;
  showLegend?: boolean;
  stacked?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

const FinanceBarChart: React.FC<FinanceBarChartProps> = ({ 
  data = [], 
  keys,
  title = "Financial Comparison",
  height = 350,
  showLegend = true,
  stacked = false,
  isLoading = false,
  emptyMessage = "No data available"
}) => {
  // Convert data format if needed
  const prepareChartData = () => {
    if (!data || data.length === 0) return [];
    
    // If keys are provided, use the standard format
    if (keys && keys.length > 0) {
      return data.map(item => ({
        ...item,
        name: item.name.includes('-') 
          ? new Date(item.name).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : item.name
      }));
    }
    
    // If no keys are provided, transform the data for a single bar chart
    // This handles the format used in the dashboard (name, value, color)
    const transformedData = [{
      name: 'Categories',
      ...data.reduce((acc, item) => {
        acc[item.name] = item.value;
        return acc;
      }, {})
    }];
    
    // Create keys from the data
    const derivedKeys = data.map(item => ({
      key: item.name,
      name: item.name,
      color: item.color || `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
    
    return { chartData: transformedData, chartKeys: derivedKeys };
  };
  
  const { chartData, chartKeys } = prepareChartData() as any;
  const formattedData = chartData || [];
  const formattedKeys = chartKeys || keys || [];
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height }} className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!formattedData.length || !formattedKeys.length) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height }} className="flex items-center justify-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              {showLegend && <Legend />}
              
              {formattedKeys.map((item, index) => (
                <Bar 
                  key={item.key}
                  dataKey={item.key} 
                  name={item.name}
                  fill={item.color}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? "a" : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceBarChart;
