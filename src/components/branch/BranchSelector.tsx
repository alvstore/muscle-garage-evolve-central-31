
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, RefreshCw, Search } from 'lucide-react';
import { useBranch } from '@/hooks/use-branch';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Input } from '../ui/input';

const BranchSelector: React.FC = () => {
  const { branches, currentBranch, switchBranch, isLoading, fetchBranches, error } = useBranch();
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const initialFetchRef = useRef(false);
  
  // Filter branches based on search query
  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Only fetch on first mount
    if (!initialFetchRef.current) {
      console.log('BranchSelector fetching branches on mount');
      fetchBranches().then(() => {
        console.log('Initial branches fetch complete');
      }).catch(err => {
        console.error('Error fetching branches:', err);
      });
      initialFetchRef.current = true;
    }
  }, [fetchBranches]); 

  // Show toast notification when error occurs
  useEffect(() => {
    if (error) {
      toast.error(`Branch error: ${error}`);
    }
  }, [error]);

  // Handle branch selection
  const handleValueChange = useCallback((value: string) => {
    if (!value) return;
    
    console.log('Branch selected:', value); 
    switchBranch(value);
    setIsOpen(false);
  }, [switchBranch]);

  // Handle dropdown open/close
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchBranches();
      setSearchQuery('');
    }
  }, [fetchBranches]);

  // Handle refresh button click
  const handleRefresh = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setRefreshing(true);
    try {
      await fetchBranches();
      toast.success('Branches refreshed');
      setSearchQuery('');
    } catch (err) {
      toast.error('Failed to refresh branches');
    } finally {
      setRefreshing(false);
    }
  }, [fetchBranches]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Render loading state
  if (isLoading && !refreshing && !currentBranch) {
    return <Skeleton className="w-full h-10 rounded" />;
  }

  // Handle no branches case
  if (!branches || branches.length === 0) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-md">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span>No branches available</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="h-6 w-6 p-0"
          aria-label="Refresh branches"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Select
        value={currentBranch?.id || ''}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        open={isOpen}
      >
        <SelectTrigger 
          className="bg-secondary/50 border-0 focus:ring-0 text-white text-opacity-90"
          aria-label="Select branch"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <SelectValue placeholder="Select Branch">
              {currentBranch?.name || "Select Branch"}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="h-8 w-8 p-0"
                aria-label="Refresh branches"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <SelectGroup>
            <div className="px-2 py-1.5 flex justify-between items-center">
              <SelectLabel>Branches ({filteredBranches.length})</SelectLabel>
            </div>
            
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <SelectItem 
                  key={branch.id} 
                  value={branch.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span>{branch.name}</span>
                      {branch.address && (
                        <span className="text-xs text-muted-foreground">{branch.address}</span>
                      )}
                    </div>
                    {branch.id === currentBranch?.id && (
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-2">
                        Current
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                No branches found matching "{searchQuery}"
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
