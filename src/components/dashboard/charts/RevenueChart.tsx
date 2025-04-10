
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ApexOptions } from 'apexcharts';

interface RevenueChartProps {
  data: number[];
  categories: string[];
  title: string;
  subtitle?: string;
  percentChange?: number;
  total: string | number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  categories, 
  title, 
  subtitle, 
  percentChange, 
  total 
}) => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3,
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
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#888',
          fontSize: '12px',
        },
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
        style: {
          colors: '#888',
          fontSize: '12px',
        },
        formatter: (value) => `${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false,
      },
    },
  };

  const series = [{
    name: 'Revenue',
    data: data
  }];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {percentChange !== undefined && (
            <Badge className={`px-2 py-1 ${percentChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange}%
            </Badge>
          )}
        </div>
        <div className="mt-1">
          <span className="text-2xl font-bold">{typeof total === 'number' ? total.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) : total}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-[200px]">
          <ReactApexChart options={options} series={series} type="area" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
