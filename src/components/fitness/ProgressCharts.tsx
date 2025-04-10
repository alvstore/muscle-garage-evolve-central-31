
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BodyMeasurement, PROGRESS_TIMEFRAMES } from "@/types/measurements";
import { format, parseISO, subDays, subMonths, subYears } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ProgressChartsProps {
  measurements: BodyMeasurement[];
}

type MeasurementKey = "weight" | "bodyFat" | "chest" | "waist" | "hips" | "biceps" | "thighs" | "bmi";

interface ChartMetric {
  key: MeasurementKey;
  label: string;
  color: string;
  unit: string;
  showChange?: boolean;
}

const CHART_METRICS: ChartMetric[] = [
  { key: "weight", label: "Weight", color: "#3b82f6", unit: "kg", showChange: true },
  { key: "bodyFat", label: "Body Fat", color: "#ef4444", unit: "%", showChange: true },
  { key: "bmi", label: "BMI", color: "#8b5cf6", unit: "", showChange: true },
  { key: "chest", label: "Chest", color: "#10b981", unit: "cm" },
  { key: "waist", label: "Waist", color: "#f59e0b", unit: "cm", showChange: true },
  { key: "hips", label: "Hips", color: "#ec4899", unit: "cm" },
  { key: "biceps", label: "Biceps", color: "#6366f1", unit: "cm" },
  { key: "thighs", label: "Thighs", color: "#14b8a6", unit: "cm" }
];

const ProgressCharts: React.FC<ProgressChartsProps> = ({ measurements }) => {
  const [timeframe, setTimeframe] = useState<string>("30days");
  const [selectedTab, setSelectedTab] = useState<MeasurementKey>("weight");
  
  const filteredMeasurements = useMemo(() => {
    return measurements
      .filter(measurement => {
        const measurementDate = new Date(measurement.date);
        const today = new Date();
        
        switch (timeframe) {
          case "7days":
            return measurementDate >= subDays(today, 7);
          case "30days":
            return measurementDate >= subDays(today, 30);
          case "3months":
            return measurementDate >= subMonths(today, 3);
          case "6months":
            return measurementDate >= subMonths(today, 6);
          case "1year":
            return measurementDate >= subYears(today, 1);
          default:
            return true; // "all" timeframe
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [measurements, timeframe]);

  const chartData = useMemo(() => {
    return filteredMeasurements.map(m => ({
      date: format(parseISO(m.date), "MMM dd"),
      fullDate: m.date,
      weight: m.weight,
      bodyFat: m.bodyFat,
      bmi: m.bmi,
      chest: m.chest,
      waist: m.waist,
      hips: m.hips,
      biceps: m.biceps,
      thighs: m.thighs
    }));
  }, [filteredMeasurements]);

  const getChange = (metric: MeasurementKey): { value: number; isImprovement: boolean } | null => {
    if (chartData.length < 2) return null;
    
    const firstValue = chartData[0][metric];
    const lastValue = chartData[chartData.length - 1][metric];
    
    if (firstValue === undefined || lastValue === undefined) return null;
    
    const change = lastValue - firstValue;
    
    // For weight, waist, body fat, and BMI, a decrease is an improvement
    // For other measurements (muscle), an increase is an improvement
    const isImprovement = metric === "weight" || metric === "waist" || metric === "bodyFat" || metric === "bmi" 
      ? change < 0 
      : change > 0;
    
    return { value: change, isImprovement };
  };

  const currentMetric = CHART_METRICS.find(m => m.key === selectedTab) || CHART_METRICS[0];
  const change = currentMetric.showChange ? getChange(currentMetric.key) : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="font-medium">{format(parseISO(data.fullDate), "MMM dd, yyyy")}</p>
          <p className="text-sm">
            {currentMetric.label}: {payload[0].value}{currentMetric.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Progress Charts</CardTitle>
            <CardDescription>
              Visual representation of your body measurement progress
            </CardDescription>
          </div>
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-36">
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as MeasurementKey)}>
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4">
            {CHART_METRICS.map(metric => (
              <TabsTrigger key={metric.key} value={metric.key}>
                {metric.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {CHART_METRICS.map(metric => (
            <TabsContent key={metric.key} value={metric.key}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{metric.label} Progress</h3>
                  {metric.showChange && change && (
                    <div className={`text-sm font-medium px-2 py-1 rounded-full 
                      ${change.isImprovement ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}{metric.unit}
                    </div>
                  )}
                </div>
                
                <div className="h-[300px] w-full">
                  {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={metric.color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={metric.color} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          domain={['auto', 'auto']}
                          tickFormatter={(value) => `${value}${metric.unit}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey={metric.key} 
                          stroke={metric.color} 
                          fillOpacity={1}
                          fill={`url(#gradient-${metric.key})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Not enough data to display chart. Add more measurements to see progress.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
