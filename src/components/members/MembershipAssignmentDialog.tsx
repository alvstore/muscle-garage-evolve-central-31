
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MembershipAssignmentForm from '@/components/membership/MembershipAssignmentForm';

interface MembershipAssignmentDialogProps {
  memberId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const MembershipAssignmentDialog: React.FC<MembershipAssignmentDialogProps> = ({
  memberId,
  onSuccess,
  trigger
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Assign Membership</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Membership</DialogTitle>
        </DialogHeader>
        <MembershipAssignmentForm
          memberId={memberId}
          onComplete={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MembershipAssignmentDialog;
