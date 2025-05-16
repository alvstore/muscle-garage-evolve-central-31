
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/finance';
import { InvoiceMemberFields } from './invoice/InvoiceMemberFields';
import { InvoiceDetailsFields } from './invoice/InvoiceDetailsFields';
import { InvoiceNotes } from './invoice/InvoiceNotes';
import { useInvoiceForm } from '@/hooks/use-invoice-form';
import { ChangeEvent } from 'react';

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

  // Create wrapper handlers that transform the event before calling the original handlers
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const onStatusChange = (status: string) => {
    handleStatusChange(status as any);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceMemberFields
            memberId={formValues.member_id || ''}
            memberName={formValues.member_name || formValues.memberName || ''}
            onChange={handleChange}
          />
          
          <InvoiceDetailsFields
            description={formValues.description || ''}
            amount={formValues.amount}
            status={formValues.status}
            dueDate={formValues.due_date}
            paymentMethod={formValues.payment_method || ''}
            onChange={onInputChange}
            onStatusChange={onStatusChange}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
          
          <InvoiceNotes
            notes={formValues.notes || ''}
            onChange={onTextAreaChange}
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
