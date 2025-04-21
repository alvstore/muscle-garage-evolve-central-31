
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Edit, Trash, PlusCircle } from 'lucide-react';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import BranchForm from './BranchForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BranchManagerProps {
  branches: Branch[];
  onBranchChange: () => void;
}

const BranchManager = ({ branches, onBranchChange }: BranchManagerProps) => {
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddBranch = () => {
    setCurrentBranch(null);
    setShowBranchForm(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    setShowBranchForm(true);
  };

  const handleFormComplete = () => {
    setShowBranchForm(false);
    onBranchChange();
  };

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Check if there are associated records
      const { count: memberCount, error: memberError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('branch_id', branchToDelete.id);
        
      if (memberError) throw memberError;
      
      if (memberCount && memberCount > 0) {
        toast.error(`Cannot delete branch that has ${memberCount} members associated with it`);
        return;
      }
      
      // No associated members, proceed with deletion
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchToDelete.id);
        
      if (error) throw error;
      
      toast.success(`Branch "${branchToDelete.name}" deleted successfully`);
      setBranchToDelete(null);
      onBranchChange();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete branch');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {showBranchForm ? (
        <BranchForm
          branch={currentBranch}
          onComplete={handleFormComplete}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <CardTitle>Branch Management</CardTitle>
            <Button onClick={handleAddBranch}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{branch.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{branch.address}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditBranch(branch)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setBranchToDelete(branch)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-1">
                    {branch.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{branch.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`text-sm ${branch.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <AlertDialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the branch "{branchToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranch}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchManager;
