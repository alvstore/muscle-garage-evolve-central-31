
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

const BranchSelector = () => {
  const { branches, currentBranch, setCurrentBranch, isLoading } = useBranch();
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
      <Button variant="outline" size="sm" disabled className="w-[200px] justify-start">
        <Building2 className="mr-2 h-4 w-4" />
        <span>Loading branches...</span>
      </Button>
    );
  }

  return (
    <PermissionGuard permission="view_branch_data" fallback={
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
        <Building2 className="h-4 w-4" />
        <span>{currentBranch?.name || 'No branch selected'}</span>
      </div>
    }>
      <Select
        value={currentBranch?.id}
        onValueChange={handleChangeBranch}
      >
        <SelectTrigger className="w-[200px]">
          <Building2 className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem
              key={branch.id}
              value={branch.id}
              className="flex items-center justify-between"
            >
              <span>{branch.name}</span>
              {currentBranch?.id === branch.id && (
                <Check className="ml-2 h-4 w-4" />
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PermissionGuard>
  );
};

export default BranchSelector;
