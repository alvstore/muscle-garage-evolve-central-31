
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Invoice } from '@/types/notification';

export const useInvoiceForm = (
  initialInvoice: Invoice | null, 
  onComplete?: (invoice?: Invoice) => void,
  onSave?: (invoice: Invoice) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set default values based on the initial invoice
  const defaultValues = initialInvoice || {
    member_id: '',
    member_name: '',
    amount: 0,
    description: '',
    status: 'pending' as const,
    due_date: new Date().toISOString(),
    payment_method: '',
    notes: '',
    created_at: new Date().toISOString(),
  };
  
  const form = useForm({
    defaultValues
  });
  
  // Form values for simpler access in components
  const [formValues, setFormValues] = useState(defaultValues);
  
  // Handler functions
  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleStatusChange = (status: string) => {
    setFormValues(prev => ({
      ...prev,
      status: status as any
    }));
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setFormValues(prev => ({
      ...prev,
      payment_method: method
    }));
  };
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Merge form values with any data directly from the form
      const invoiceData = {
        ...formValues,
        ...data,
      };
      
      if (onSave) {
        await onSave(invoiceData);
      }
      
      if (onComplete) {
        onComplete(invoiceData);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    formValues,
    handleChange,
    handleStatusChange,
    handlePaymentMethodChange,
    onSubmit
  };
};
