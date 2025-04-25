
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Invoice } from '@/types/finance';
import InvoiceForm from './InvoiceForm';

export interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onComplete?: () => void;
}

export const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onComplete,
}) => {
  const isEditing = Boolean(invoice);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update invoice details below' : 'Enter invoice details below to create a new invoice.'}
          </DialogDescription>
        </DialogHeader>
        <InvoiceForm 
          invoice={invoice} 
          onComplete={handleComplete} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
