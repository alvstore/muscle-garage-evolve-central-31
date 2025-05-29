import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { CreateTeamMemberForm } from "./CreateTeamMemberForm";

interface CreateTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTeamMemberDialog({ open, onOpenChange, onSuccess }: CreateTeamMemberDialogProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new team member to your organization.
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            <CreateTeamMemberForm
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeamMemberDialog;
