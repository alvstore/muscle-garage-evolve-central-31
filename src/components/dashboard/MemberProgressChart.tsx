
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ProgressMetrics } from "@/types/class";

interface MemberProgressChartProps {
  data: {
    date: string;
    metrics: ProgressMetrics;
  }[];
  memberId: string;
  memberName: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{format(parseISO(label), "MMM dd, yyyy")}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === "Weight" ? "kg" : entry.name === "Body Fat" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MemberProgressChart = ({ data, memberId, memberName }: MemberProgressChartProps) => {
  const [metricType, setMetricType] = useState<string>("weight");
  
  // Transform data for the selected metric
  const chartData = data.map(item => ({
    date: item.date,
    weight: item.metrics.weight,
    bodyFat: item.metrics.bodyFatPercentage,
    bmi: item.metrics.bmi,
    muscleGain: item.metrics.muscleGain
  }));

  const getMetricLabel = (type: string) => {
    switch (type) {
      case "weight": return "Weight (kg)";
      case "bodyFat": return "Body Fat (%)";
      case "bmi": return "BMI";
      case "muscleGain": return "Muscle Gain (kg)";
      default: return "";
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case "weight": return "#3b82f6"; // blue
      case "bodyFat": return "#ef4444"; // red
      case "bmi": return "#8b5cf6"; // purple
      case "muscleGain": return "#10b981"; // green
      default: return "#3b82f6";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{memberName}'s Progress</CardTitle>
          <CardDescription>Track progress over time</CardDescription>
        </div>
        <Select
          value={metricType}
          onValueChange={(value) => setMetricType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weight">Weight</SelectItem>
            <SelectItem value="bodyFat">Body Fat %</SelectItem>
            <SelectItem value="bmi">BMI</SelectItem>
            <SelectItem value="muscleGain">Muscle Gain</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), "MMM dd")}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
                label={{ 
                  value: getMetricLabel(metricType), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey={metricType}
                stroke={getMetricColor(metricType)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberProgressChart;
