
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRoleName: string;
  onRoleNameChange: (value: string) => void;
  newRoleDescription: string;
  onRoleDescriptionChange: (value: string) => void;
  onAddRole: () => void;
}

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  isOpen,
  onOpenChange,
  newRoleName,
  onRoleNameChange,
  newRoleDescription,
  onRoleDescriptionChange,
  onAddRole
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={newRoleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              placeholder="Enter role name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newRoleDescription}
              onChange={(e) => onRoleDescriptionChange(e.target.value)}
              placeholder="Describe this role's purpose and access level"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onAddRole}
            disabled={!newRoleName.trim()}
          >
            Add Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
