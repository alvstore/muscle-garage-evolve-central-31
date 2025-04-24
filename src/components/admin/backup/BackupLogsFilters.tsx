
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface BackupLogsFiltersProps {
  currentTab: string;
  setCurrentTab: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const BackupLogsFilters = ({
  currentTab,
  setCurrentTab,
  filter,
  setFilter,
  searchTerm,
  setSearchTerm
}: BackupLogsFiltersProps) => {
  return (
    <>
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="export">Exports</TabsTrigger>
          <TabsTrigger value="import">Imports</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user or module"
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Successful Only</SelectItem>
            <SelectItem value="failed">Failed Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BackupLogsFilters;
