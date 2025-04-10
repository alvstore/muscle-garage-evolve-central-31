
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useBranch } from '@/hooks/use-branch';
import { cn } from '@/lib/utils';

export function BranchSelector() {
  const [open, setOpen] = useState(false);
  const { branches, currentBranch, isLoading, selectBranch, fetchBranches } = useBranch();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[200px] justify-start">
        <span className="animate-pulse">Loading branches...</span>
      </Button>
    );
  }

  if (!currentBranch) {
    return (
      <Button variant="outline" className="w-[200px] justify-start">
        No branches available
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentBranch.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandEmpty>No branch found.</CommandEmpty>
          <CommandGroup>
            {branches.map((branch) => (
              <CommandItem
                key={branch.id}
                value={branch.id}
                onSelect={() => {
                  selectBranch(branch.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentBranch.id === branch.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {branch.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
