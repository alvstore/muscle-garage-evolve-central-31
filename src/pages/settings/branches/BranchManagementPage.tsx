
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Edit, Trash2, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBranch } from "@/hooks/settings/use-branches";
import { Branch } from "@/types/settings/branch";
import { toast } from "sonner";
import CreateBranchDialog from "@/components/branch/CreateBranchDialog";
import EditBranchDialog from "@/components/branch/EditBranchDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BranchManagementPage = () => {
  const { branches, isLoading, deleteBranch, fetchBranches } = useBranch();
  const [isCreating, setIsCreating] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeBranches = branches.filter(branch => branch.is_active);
  const inactiveBranches = branches.filter(branch => !branch.is_active);

  const handleRefresh = async () => {
    await fetchBranches();
    toast.success("Branches refreshed");
  };

  const handleDelete = async () => {
    if (!deletingBranch) return;
    
    setIsDeleting(true);
    try {
      await deleteBranch(deletingBranch.id);
      toast.success(`Branch ${deletingBranch.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error("Failed to delete branch");
    } finally {
      setIsDeleting(false);
      setDeletingBranch(null);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Branch Management</h1>
            <p className="text-muted-foreground">Manage your gym branches</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                    {branch.name}
                  </CardTitle>
                  <Badge variant={branch.is_active ? "secondary" : "destructive"}>
                    {branch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{branch.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {branch.branch_code && (
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium mr-1">Code:</span> {branch.branch_code}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Manager:</span> {branch.manager_id || "Not assigned"}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {branch.phone || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {branch.email || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Hours:</span> {branch.opening_hours || "--"} to {branch.closing_hours || "--"}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingBranch(branch)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setDeletingBranch(branch)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CreateBranchDialog
          open={isCreating}
          onOpenChange={setIsCreating}
          onComplete={() => {
            setIsCreating(false);
          }}
        />

        {editingBranch && (
          <EditBranchDialog
            open={!!editingBranch}
            onOpenChange={(open) => {
              if (!open) setEditingBranch(null);
            }}
            branch={editingBranch}
            onComplete={() => {
              setEditingBranch(null);
            }}
          />
        )}

        <AlertDialog open={!!deletingBranch} onOpenChange={(open) => {
          if (!open) setDeletingBranch(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the branch
                <strong> {deletingBranch?.name}</strong> and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Container>
  );
};

export default BranchManagementPage;
