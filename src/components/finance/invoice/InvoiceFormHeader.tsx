
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceFormHeaderProps } from "@/types/invoice";

export const InvoiceFormHeader = ({ isEditing }: InvoiceFormHeaderProps) => (
  <DialogHeader>
    <DialogTitle>{isEditing ? 'Edit' : 'Create'} Invoice</DialogTitle>
  </DialogHeader>
);

