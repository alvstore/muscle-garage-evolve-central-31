import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancePieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  title?: string;
  height?: number | string;
  colors?: string[];
  showLegend?: boolean;
  showLabels?: boolean;
}

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#3F51B5', '#E91E63', '#009688'];

const FinancePieChart: React.FC<FinancePieChartProps> = ({ 
  data, 
  title = "Breakdown",
  height = 300,
  colors = COLORS,
  showLegend = true,
  showLabels = false
}) => {
  // Filter out any items with zero value
  const filteredData = data.filter(item => item.value > 0);
  
  // If no data, show empty state
  if (filteredData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-muted-foreground">No data available</p>
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
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={showLabels}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={showLabels ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              {showLegend && (
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value, entry, index) => {
                    const item = filteredData[index];
                    return (
                      <span className="text-sm">
                        {value} (₹{item.value.toLocaleString()})
                      </span>
                    );
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancePieChart;
