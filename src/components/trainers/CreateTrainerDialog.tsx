
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreateTrainerForm } from "./CreateTrainerForm";

interface CreateTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTrainerDialog({ open, onOpenChange, onSuccess }: CreateTrainerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trainer</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new trainer to the system. All required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <CreateTrainerForm onSuccess={() => {
          onSuccess?.();
          onOpenChange(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}
