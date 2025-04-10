
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexOptions } from 'apexcharts';

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  categories: string[];
  colors?: string[];
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  categories,
  colors = ['#7367F0'],
  horizontal = false
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        columnWidth: '55%',
        borderRadius: 4,
        distributed: colors.length > 1,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
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
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => `${value.toLocaleString()}`
      }
    },
    legend: {
      show: false,
    }
  };

  const series = [{
    name: title,
    data: data
  }];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-[300px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
