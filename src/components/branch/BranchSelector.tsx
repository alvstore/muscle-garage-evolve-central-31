import { useState } from 'react';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const BranchSelector = () => {
  const { branches, currentBranch, setCurrentBranch, isLoading, fetchBranches } = useBranch();
  const { updateUserBranch } = useAuth();
  
  const handleChangeBranch = async (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      try {
        await updateUserBranch(branch.id);
        setCurrentBranch(branch);
        toast.success(`Switched to ${branch.name}`);
      } catch (error) {
        toast.error("Failed to switch branch");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="w-[200px] justify-start">
          <Building2 className="mr-2 h-4 w-4" />
          <span>Loading branches...</span>
        </Button>
      </div>
    );
  }

  return (
    <PermissionGuard permission="view_branch_data" fallback={
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
        <Building2 className="h-4 w-4 text-indigo-200" />
        <span className="text-indigo-100">{currentBranch?.name || 'No branch selected'}</span>
      </div>
    }>
      <div className="flex items-center gap-2">
        <Select
          value={currentBranch?.id}
          onValueChange={handleChangeBranch}
        >
          <SelectTrigger className="w-[200px] bg-indigo-900/50 border-indigo-700 text-indigo-100 hover:bg-indigo-800/70 focus:ring-indigo-500 truncate">
            <Building2 className="mr-2 h-4 w-4 text-indigo-300" />
            <SelectValue
              placeholder="Select branch"
              className="truncate"
            />
          </SelectTrigger>
          <SelectContent className="bg-indigo-950 border-indigo-800 text-indigo-100">
            {branches.map((branch) => (
              <SelectItem
                key={branch.id}
                value={branch.id}
                className="flex items-center justify-between hover:bg-indigo-900 focus:bg-indigo-900 truncate"
              >
                <div className="flex items-center gap-2 w-[160px] truncate">
                  <Building2 className="h-4 w-4 text-indigo-300" />
                  <span className="truncate">{branch.name}</span>
                </div>
                {currentBranch?.id === branch.id && (
                  <Check className="ml-2 h-4 w-4 text-green-400" />
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </PermissionGuard>
  );
};

export default BranchSelector;
