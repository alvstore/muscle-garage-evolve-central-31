
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/notification';
import { InvoiceMemberFields } from './invoice/InvoiceMemberFields';
import { InvoiceDetailsFields } from './invoice/InvoiceDetailsFields';
import { InvoiceNotes } from './invoice/InvoiceNotes';
import { useInvoiceForm } from '@/hooks/use-invoice-form';

export interface InvoiceFormProps {
  invoice: Invoice | null;
  onComplete?: (invoice?: Invoice) => void;
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
    form,
    isSubmitting,
    onSubmit,
    formValues,
    handleChange,
    handleInputChange,
    handleTextAreaChange,
    handleStatusChange,
    handlePaymentMethodChange,
  } = useInvoiceForm(invoice, onComplete, onSave);

  // Form submit handler that adapts from React Hook Form to HTML form
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceMemberFields
            memberId={formValues.member_id}
            memberName={formValues.member_name}
            onChange={handleChange}
          />
          
          <InvoiceDetailsFields
            description={formValues.description || ''}
            amount={formValues.amount}
            status={formValues.status}
            dueDate={formValues.due_date}
            paymentMethod={formValues.payment_method || ''}
            onChange={handleInputChange}
            onStatusChange={handleStatusChange}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
          
          <InvoiceNotes
            notes={formValues.notes}
            onChange={handleTextAreaChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            {(onCancel || onComplete) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
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
