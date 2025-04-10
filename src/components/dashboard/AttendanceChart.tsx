
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{format(parseISO(label), "MMM dd, yyyy")}</p>
        <p className="text-accent">
          {payload[0].value} check-ins
        </p>
      </div>
    );
  }
  return null;
};

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>Daily gym check-ins over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), "MMM dd")}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickCount={6}
                domain={[0, 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--accent))"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
