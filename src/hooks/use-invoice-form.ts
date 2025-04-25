
import { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/types/finance';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export interface InvoiceFormState {
  member_id: string;
  member_name: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  payment_method: string;
  notes: string;
}

export const useInvoiceForm = (
  invoice: Invoice | null, 
  onComplete?: () => void, 
  onSave?: (invoice: Invoice) => void
) => {
  const { currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormState>({
    member_id: invoice?.member_id || '',
    member_name: invoice?.memberName || '',
    description: invoice?.description || '',
    amount: invoice?.amount || 0,
    status: invoice?.status || 'pending' as InvoiceStatus,
    due_date: invoice?.due_date || invoice?.dueDate || new Date().toISOString().split('T')[0],
    payment_method: invoice?.payment_method || '',
    notes: invoice?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as InvoiceStatus }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, payment_method: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submittedInvoice: Invoice = {
        ...(invoice || {}),
        ...formData,
        id: invoice?.id || `temp-${Date.now()}`,
        branch_id: currentBranch?.id || '',
        created_at: invoice?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      if (invoice?.id) {
        await supabase
          .from('invoices')
          .update(submittedInvoice)
          .eq('id', invoice.id);
          
        toast.success('Invoice updated successfully');
      } else {
        await supabase
          .from('invoices')
          .insert(submittedInvoice);
          
        toast.success('Invoice created successfully');
      }
      
      if (onSave) {
        onSave(submittedInvoice);
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleSubmit,
  };
};
