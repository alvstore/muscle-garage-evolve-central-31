
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InvoiceForm from "../InvoiceForm";
import { Invoice } from "@/types/finance";

interface InvoiceFormDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (invoice?: Invoice) => void;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  invoice,
  open,
  onOpenChange,
  onComplete,
}) => {
  // Function to handle form completion
  const handleComplete = (updatedInvoice?: Invoice) => {
    onComplete(updatedInvoice);
    onOpenChange(false);
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    onOpenChange(false);
  };

  // Convert notification invoice to finance invoice if needed
  const prepareInvoice = (invoice: Invoice | null): Invoice | null => {
    if (!invoice) return null;

    // If the invoice doesn't have items, add an empty items array
    const updatedInvoice: Invoice = {
      ...invoice,
      items: invoice.items || [],
    };

    return updatedInvoice;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          invoice={prepareInvoice(invoice)}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
