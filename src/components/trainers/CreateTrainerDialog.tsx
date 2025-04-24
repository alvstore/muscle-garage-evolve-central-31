
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateTrainerForm } from "./CreateTrainerForm";

interface CreateTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTrainerDialog({ open, onOpenChange, onSuccess }: CreateTrainerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Trainer</DialogTitle>
        </DialogHeader>
        <CreateTrainerForm onSuccess={() => {
          onSuccess?.();
          onOpenChange(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}
