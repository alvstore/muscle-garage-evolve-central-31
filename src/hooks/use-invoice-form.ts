
import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Invoice, InvoiceStatus } from '@/types/finance';

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
    status: 'pending' as InvoiceStatus,
    due_date: new Date().toISOString(),
    payment_method: '',
    notes: '',
    created_at: new Date().toISOString(),
    items: [],
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

  // Create wrapper functions that handle events
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.name, e.target.value);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value);
  };
  
  const handleStatusChange = (status: InvoiceStatus) => {
    setFormValues(prev => ({
      ...prev,
      status: status
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
    handleInputChange,
    handleTextAreaChange,
    handleStatusChange,
    handlePaymentMethodChange,
    onSubmit
  };
};
