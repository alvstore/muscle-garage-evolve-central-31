
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/finance';
import { InvoiceMemberFields } from './invoice/InvoiceMemberFields';
import { InvoiceDetailsFields } from './invoice/InvoiceDetailsFields';
import { InvoiceNotes } from './invoice/InvoiceNotes';
import { useInvoiceForm } from '@/hooks/use-invoice-form';

export interface InvoiceFormProps {
  invoice: Invoice | null;
  onComplete?: (invoice?: Invoice) => void;  // Modified to accept optional Invoice
  onSave?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onComplete,
  onSave,
  onCancel,
}) => {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleSubmit,
  } = useInvoiceForm(invoice, () => {
    // If onComplete is provided without an Invoice, call it without parameters
    if (onComplete) onComplete();
  }, onSave);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceMemberFields
            memberId={formData.member_id}
            memberName={formData.member_name}
            onChange={handleChange}
          />
          
          <InvoiceDetailsFields
            description={formData.description || ''}
            amount={formData.amount}
            status={formData.status}
            dueDate={formData.due_date}
            paymentMethod={formData.payment_method || ''}
            onChange={handleChange}
            onStatusChange={handleStatusChange}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
          
          <InvoiceNotes
            notes={formData.notes}
            onChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            {(onCancel || onComplete) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onCancel) {
                    onCancel();
                  } else if (onComplete) {
                    onComplete();
                  }
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default InvoiceForm;
