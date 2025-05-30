
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Process data based on selected timeframe
  const processedData = () => {
    if (selectedTimeframe === 'monthly') {
      return [...data]; // Return original monthly data
    } else if (selectedTimeframe === 'quarterly') {
      // Group by quarters
      const quarterMap: Record<string, any> = {
        'Q1': { month: 'Q1', revenue: 0, expenses: 0, profit: 0 },
        'Q2': { month: 'Q2', revenue: 0, expenses: 0, profit: 0 },
        'Q3': { month: 'Q3', revenue: 0, expenses: 0, profit: 0 },
        'Q4': { month: 'Q4', revenue: 0, expenses: 0, profit: 0 }
      };
      
      const monthToQuarter: Record<string, string> = {
        'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
        'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
        'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
        'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
      };
      
      data.forEach(item => {
        const quarter = monthToQuarter[item.month];
        if (quarter) {
          quarterMap[quarter].revenue += item.revenue;
          quarterMap[quarter].expenses += item.expenses;
          quarterMap[quarter].profit += item.profit;
        }
      });
      
      return Object.values(quarterMap);
    } else {
      // Yearly - aggregate all months
      const yearlyData = {
        month: 'Year',
        revenue: data.reduce((sum, item) => sum + item.revenue, 0),
        expenses: data.reduce((sum, item) => sum + item.expenses, 0),
        profit: data.reduce((sum, item) => sum + item.profit, 0)
      };
      return [yearlyData];
    }
  };
  
  const chartData = processedData();

  // Calculate totals
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);

  const exportData = () => {
    // Create CSV content
    const headers = "Period,Revenue,Expenses,Profit\n";
    const csvContent = chartData.reduce((content, row) => {
      return content + `${row.month},${row.revenue},${row.expenses},${row.profit}\n`;
    }, headers);
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue_${selectedTimeframe}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>Financial performance over time</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md shadow-sm">
            <Button 
              variant={selectedTimeframe === 'monthly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTimeframe('monthly')}
              className="rounded-r-none"
            >
              Monthly
            </Button>
            <Button 
              variant={selectedTimeframe === 'quarterly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTimeframe('quarterly')}
              className="rounded-none border-x-0"
            >
              Quarterly
            </Button>
            <Button 
              variant={selectedTimeframe === 'yearly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTimeframe('yearly')}
              className="rounded-l-none"
            >
              Yearly
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalProfit.toLocaleString()}</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
                width={40}
              />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" barSize={20} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" barSize={20} />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
