
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from 'lucide-react';
import { useBranch } from '@/hooks/use-branch';
import { Skeleton } from '../ui/skeleton';

const BranchSelector: React.FC = () => {
  const { branches, currentBranch, switchBranch, isLoading, fetchBranches } = useBranch();
  const [isOpen, setIsOpen] = useState(false);

  // Add this useEffect to fetch branches on component mount
  useEffect(() => {
    console.log('BranchSelector mounted, fetching branches...');
    fetchBranches().then(fetchedBranches => {
      console.log('Fetched branches:', fetchedBranches);
    });
  }, [fetchBranches]);

  const handleValueChange = (value: string) => {
    console.log('Switching to branch:', value);
    switchBranch(value);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Refresh branches list when opening selector
      console.log('Selector opened, refreshing branches...');
      fetchBranches();
    }
    setIsOpen(open);
  };

  console.log('BranchSelector render state:', { branches, currentBranch, isLoading });

  if (isLoading) {
    return (
      <Skeleton className="w-full h-10 rounded" />
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-md">
        <Building2 className="h-4 w-4" />
        <span>No branches available</span>
      </div>
    );
  }

  return (
    <Select
      value={currentBranch?.id || ''}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <SelectTrigger className="bg-secondary/50 border-0 focus:ring-0 text-white text-opacity-90">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <SelectValue placeholder="Select Branch" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Branches</SelectLabel>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BranchSelector;
