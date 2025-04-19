
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Download, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SearchAndExportProps {
  onSearch: (query: string) => void;
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onExport: () => void;
}

export const SearchAndExport = ({ onSearch, onDateRangeChange, onExport }: SearchAndExportProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartDateOpen(false);
    onDateRangeChange(date, endDate);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndDateOpen(false);
    onDateRangeChange(startDate, date);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-48 mr-2"
        />
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8 absolute right-3 top-0"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 w-auto flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {startDate ? format(startDate, 'PP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 w-auto flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {endDate ? format(endDate, 'PP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="default" 
        className="h-8 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1"
        onClick={onExport}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

