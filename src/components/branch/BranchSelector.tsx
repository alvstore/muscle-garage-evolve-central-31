
import { useState } from 'react';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

const BranchSelector = () => {
  const { branches, currentBranch, setCurrentBranch, isLoading } = useBranch();
  const { updateUserBranch } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChangeBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      updateUserBranch(branch.id);
    }
    setIsOpen(false);
  };
  
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className="w-[200px] justify-start">
        <Building2 className="mr-2 h-4 w-4" />
        <span>Loading branches...</span>
      </Button>
    );
  }
  
  if (!currentBranch) {
    return (
      <Button variant="outline" size="sm" disabled className="w-[200px] justify-start">
        <Building2 className="mr-2 h-4 w-4" />
        <span>No branches available</span>
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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-[200px] justify-start">
            <Building2 className="mr-2 h-4 w-4" />
            <span className="truncate">{currentBranch?.name}</span>
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {branches.map((branch) => (
            <DropdownMenuItem 
              key={branch.id}
              onClick={() => handleChangeBranch(branch.id)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{branch.name}</span>
              {currentBranch?.id === branch.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          
          <PermissionGuard permission="manage_branches">
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/branches" className="cursor-pointer">
                Manage Branches
              </a>
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </PermissionGuard>
  );
};

export default BranchSelector;
