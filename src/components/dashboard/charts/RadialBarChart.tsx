
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexOptions } from 'apexcharts';

interface RadialBarChartProps {
  title: string;
  subtitle?: string;
  value: number;
  color?: string;
  label?: string;
  additionalInfo?: string;
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({
  title,
  subtitle,
  value,
  color = '#7367F0',
  label,
  additionalInfo
}) => {
  const options: ApexOptions = {
    chart: {
      height: 250,
      type: 'radialBar',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
        },
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            color: undefined,
            offsetY: -10
          },
          value: {
            offsetY: 5,
            fontSize: '22px',
            color: undefined,
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [color],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    colors: [color],
    labels: [label || 'Completed'],
  };

  const series = [value];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col items-center">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={250}
          />
          {additionalInfo && (
            <div className="text-sm text-muted-foreground mt-4 text-center">
              {additionalInfo}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadialBarChart;
