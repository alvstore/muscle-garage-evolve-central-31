
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BranchForm from "./BranchForm";

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
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            <Plus className="w-4 h-4 mr-1" />
            New Branch
          </Button>
        </DialogTrigger>
      )}
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
  );
};

export default CreateBranchDialog;
