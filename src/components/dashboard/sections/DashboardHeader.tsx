
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Bell, Settings, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to Muscle Garage management system</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
        <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
