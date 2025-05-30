import { useState, useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Feedback } from "@/types/notification";

interface FeedbackSummaryChartProps {
  feedback: Feedback[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const FeedbackSummaryChart = ({ feedback }: FeedbackSummaryChartProps) => {
  const [chartView, setChartView] = useState<"rating" | "type">("rating");

  // Group by feedback type
  const feedbackByType = useMemo(() => {
    const byType: Record<string, number> = {};
    
    feedback.forEach((item) => {
      const type = item.type || 'general';
      if (!byType[type]) {
        byType[type] = 0;
      }
      byType[type]++;
    });
    
    return Object.entries(byType).map(([type, count]) => ({
      type,
      count
    }));
  }, [feedback]);

  // Process feedback data for the rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
    const count = feedback.filter(f => f.rating === rating).length;
    return {
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      value: count,
      color: rating === 5 ? "#10b981" : 
             rating === 4 ? "#3b82f6" : 
             rating === 3 ? "#f59e0b" : 
             rating === 2 ? "#ef4444" : "#b91c1c"
    };
  });

  // Process feedback data for the feedback type distribution
  const typeMap: Record<string, string> = {
    'class': 'Class Feedback',
    'trainer': 'Trainer Feedback',
    'fitness-plan': 'Fitness Plan',
    'general': 'General Feedback'
  };
  
  const typeDistribution = Object.entries(
    feedback.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count], index) => ({
    name: typeMap[type] || type,
    value: count,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate average rating
  const averageRating = feedback.length ? 
    (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1) : 
    'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Summary</CardTitle>
        <CardDescription>
          Average Rating: <span className="font-medium text-primary">{averageRating}</span> from {feedback.length} responses
        </CardDescription>
        <Tabs defaultValue="rating" className="w-full" onValueChange={(value) => setChartView(value as "rating" | "type")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rating">Rating Distribution</TabsTrigger>
            <TabsTrigger value="type">Feedback Type</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartView === "rating" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingDistribution}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} responses`, "Count"]}
                />
                <Bar dataKey="value">
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} responses`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSummaryChart;
