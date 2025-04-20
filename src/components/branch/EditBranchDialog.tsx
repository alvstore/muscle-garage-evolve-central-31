
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BranchForm from "./BranchForm";
import { Branch } from "@/types/branch";

interface EditBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  onComplete: () => void;
}

const EditBranchDialog = ({ 
  open, 
  onOpenChange, 
  branch, 
  onComplete 
}: EditBranchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        {branch && (
          <BranchForm 
            branch={branch} 
            onComplete={onComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBranchDialog;
