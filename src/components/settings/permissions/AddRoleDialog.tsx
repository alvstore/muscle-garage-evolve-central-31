
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AddRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRoleName: string;
  onRoleNameChange: (value: string) => void;
  newRoleDescription: string;
  onRoleDescriptionChange: (value: string) => void;
  onAddRole: () => void;
}

export function AddRoleDialog({
  isOpen,
  onOpenChange,
  newRoleName,
  onRoleNameChange,
  newRoleDescription,
  onRoleDescriptionChange,
  onAddRole,
}: AddRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Add a new role with custom permissions
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Role Name</label>
            <Input
              id="name"
              value={newRoleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              placeholder="e.g., Marketing Staff"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Input
              id="description"
              value={newRoleDescription}
              onChange={(e) => onRoleDescriptionChange(e.target.value)}
              placeholder="Describe role permissions and responsibilities"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddRole}>
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
