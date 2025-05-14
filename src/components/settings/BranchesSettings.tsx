import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BranchForm from '@/components/branch/BranchForm';
import { Branch } from '@/types/branch';

export const BranchesSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { branches, isLoading, error, fetchBranches, addBranch, updateBranch, deleteBranch } = useBranch();

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBranch(null);
  };

  const handleToggleActive = async (id: string, isCurrentlyActive: boolean) => {
    try {
      await updateBranch(id, { is_active: !isCurrentlyActive });
      toast({
        title: "Branch updated",
        description: `Branch status has been ${!isCurrentlyActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error("Failed to toggle branch status:", error);
      toast({
        title: "Error",
        description: "Failed to update branch status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Branches</CardTitle>
            <CardDescription>Add, edit, and manage your gym branches</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading branches...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : branches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No branches found. Add your first branch to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>{branch.city}, {branch.state}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={branch.is_active ? "default" : "outline"}
                          className={branch.is_active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {branch.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(branch)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(branch.id, branch.is_active)}
                          >
                            {branch.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBranch ? 'Edit Branch' : 'Create Branch'}</DialogTitle>
          </DialogHeader>
          <BranchForm 
            branch={selectedBranch}
            onComplete={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
