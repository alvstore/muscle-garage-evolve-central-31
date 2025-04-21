
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface MemberDashboardHeaderProps {
  username: string;
  date: string;
}

const MemberDashboardHeader = ({ username, date }: MemberDashboardHeaderProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    toast.success(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {username}</h1>
        <p className="text-muted-foreground">{date}</p>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-auto">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="h-10">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MemberDashboardHeader;
