
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceFormHeaderProps } from "@/types/invoice";

export const InvoiceFormHeader = ({ isEdit }: InvoiceFormHeaderProps) => (
  <DialogHeader>
    <DialogTitle>{isEdit ? 'Edit' : 'Create'} Invoice</DialogTitle>
  </DialogHeader>
);
