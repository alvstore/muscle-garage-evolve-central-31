
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBranch } from '@/hooks/use-branches';
import { Branch } from '@/types';

export interface BranchSelectorProps {
  branches: Branch[];
  onSelect: (branch: Branch) => void;
  disabled?: boolean;
}

export default function BranchSelector({ branches = [], onSelect, disabled = false }: BranchSelectorProps) {
  const { currentBranch, setCurrentBranch } = useBranch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentBranch?.id || "");

  // Sync local state with context
  useEffect(() => {
    if (currentBranch?.id) {
      setValue(currentBranch.id);
    }
  }, [currentBranch]);

  // Auto-select first branch if none selected
  useEffect(() => {
    if (branches.length > 0 && !currentBranch && !value) {
      const firstBranch = branches[0];
      setValue(firstBranch.id);
      setCurrentBranch(firstBranch);
    }
  }, [branches, currentBranch, value, setCurrentBranch]);

  const handleSelect = (branch: Branch) => {
    if (!branch) return;
    
    try {
      // Update local state
      setValue(branch.id);
      setOpen(false);
      
      // Update the branch context
      setCurrentBranch(branch);
      
      // Notify parent component
      if (onSelect) {
        onSelect(branch);
      }
    } catch (error) {
      console.error('Error selecting branch:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between text-sm"
          disabled={disabled}
        >
          {value
            ? branches.find((branch) => branch.id === value)?.name
            : "Select branch..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandEmpty>No branch found.</CommandEmpty>
          <CommandGroup>
            {branches.map((branch) => (
              <CommandItem
                key={branch.id}
                value={branch.id}
                onSelect={() => handleSelect(branch)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === branch.id ? "opacity-100" : "opacity-0"
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
