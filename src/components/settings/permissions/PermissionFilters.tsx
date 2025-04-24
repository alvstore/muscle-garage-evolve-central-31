
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PermissionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedModule: string;
  onModuleChange: (value: string) => void;
  modules: string[];
  onAddRoleClick: () => void;
}

export function PermissionFilters({
  searchTerm,
  onSearchChange,
  selectedModule,
  onModuleChange,
  modules,
  onAddRoleClick,
}: PermissionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value.toLowerCase())}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={selectedModule} onValueChange={onModuleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map(module => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onAddRoleClick}>Add New Role</Button>
      </div>
    </div>
  );
}
