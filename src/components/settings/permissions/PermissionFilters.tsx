
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search } from 'lucide-react';

interface PermissionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedModule: string;
  onModuleChange: (value: string) => void;
  modules: string[];
  onAddRoleClick: () => void;
}

export const PermissionFilters: React.FC<PermissionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedModule,
  onModuleChange,
  modules,
  onAddRoleClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between">
      <div className="flex flex-1 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={selectedModule} onValueChange={onModuleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onAddRoleClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Role
      </Button>
    </div>
  );
};
