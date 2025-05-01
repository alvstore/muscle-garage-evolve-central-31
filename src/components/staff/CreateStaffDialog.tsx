
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateStaffForm, { StaffMember as FormStaffMember } from "./CreateStaffForm";
import { useStaff, StaffMember as HookStaffMember } from "@/hooks/use-staff";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateStaffDialog({ open, onOpenChange, onSuccess }: CreateStaffDialogProps) {
  const { staff, fetchStaff } = useStaff();
  
  // Map staff from the hook format to the format expected by the form
  const formattedStaff: FormStaffMember[] = staff.map(member => ({
    id: member.id,
    full_name: member.name,
    email: member.email,
    phone: member.phone || '',
    role: member.role as 'staff' | 'trainer' | 'admin',
    department: member.department || '',
    branch_id: member.branch_id,
    is_active: member.is_active !== undefined ? member.is_active : true,
    created_at: member.created_at || new Date().toISOString(),
    updated_at: member.updated_at || new Date().toISOString()
  }));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <CreateStaffForm 
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          staff={formattedStaff}
          refetch={fetchStaff}
        />
      </DialogContent>
    </Dialog>
  );
}
