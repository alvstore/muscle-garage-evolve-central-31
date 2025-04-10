
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, BarChart2 } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DailySalesOverviewProps {
  salesData: {
    today: number;
    yesterday: number;
    weekly: number;
    monthly: number;
    percentChange: number;
  };
}

const DailySalesOverview: React.FC<DailySalesOverviewProps> = ({ salesData }) => {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#7367F0'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    grid: {
      show: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      }
    },
    tooltip: {
      enabled: false,
    },
  };

  // Placeholder data for the chart
  const series = [{
    name: 'Sales',
    data: [25, 35, 20, 45, 30, 55, 65, 40, 60, 45, 70, 50]
  }];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Daily Sales</CardTitle>
            <CardDescription>Today's Revenue</CardDescription>
          </div>
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <ShoppingCart size={20} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">
              ₹{salesData.today.toLocaleString()}
            </span>
            <Badge className={`px-2 py-1 ${salesData.percentChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {salesData.percentChange >= 0 ? '+' : ''}{salesData.percentChange}%
            </Badge>
          </div>
          
          <Tabs defaultValue="today" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Orders:</p>
                  <p className="text-sm font-semibold">24</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Order:</p>
                  <p className="text-sm font-semibold">₹1,200</p>
                </div>
              </div>
              <div className="h-20 mt-2">
                <ReactApexChart options={options} series={series} type="area" height="100%" />
              </div>
            </TabsContent>
            <TabsContent value="week" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Weekly Orders:</p>
                  <p className="text-sm font-semibold">158</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weekly Revenue:</p>
                  <p className="text-sm font-semibold">₹{salesData.weekly.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-20 mt-2">
                <ReactApexChart options={options} series={series} type="area" height="100%" />
              </div>
            </TabsContent>
            <TabsContent value="month" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Orders:</p>
                  <p className="text-sm font-semibold">649</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Revenue:</p>
                  <p className="text-sm font-semibold">₹{salesData.monthly.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-20 mt-2">
                <ReactApexChart options={options} series={series} type="area" height="100%" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySalesOverview;
