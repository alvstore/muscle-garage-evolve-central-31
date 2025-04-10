
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

type StatChange = {
  direction: 'up' | 'down' | 'neutral';
  value: string;
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: StatChange;
}

const StatCard = ({ title, value, icon: Icon, change }: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            <div className="flex items-center mt-1">
              {change.direction === 'up' && (
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {change.value}
                </span>
              )}
              
              {change.direction === 'down' && (
                <span className="text-red-500 text-xs font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  {change.value}
                </span>
              )}
              
              {change.direction === 'neutral' && (
                <span className="text-gray-500 text-xs font-medium">
                  {change.value}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
