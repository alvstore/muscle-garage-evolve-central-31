
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

const CreateBranchDialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="w-4 h-4 mr-1" />
          New Branch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
        </DialogHeader>
        <BranchForm onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBranchDialog;
