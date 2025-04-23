import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BranchForm from "./BranchForm";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
interface CreateBranchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete: () => void;
}
const CreateBranchDialog = ({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onComplete
}: CreateBranchDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const {
    can,
    userRole
  } = usePermissions();
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  // Only show for admin role
  if (userRole !== 'admin') return null;
  return <PermissionGuard permission="manage_branches">
      <Dialog open={open} onOpenChange={setOpen}>
        {!isControlled && <DialogTrigger asChild>
            
          </DialogTrigger>}
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
          </DialogHeader>
          <BranchForm onComplete={() => {
          setOpen(false);
          onComplete();
        }} />
        </DialogContent>
      </Dialog>
    </PermissionGuard>;
};
export default CreateBranchDialog;