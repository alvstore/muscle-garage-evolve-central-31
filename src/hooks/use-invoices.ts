
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, InvoiceStatus } from '@/types/finance';
import { toast } from 'sonner';

export const useInvoices = (memberId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('invoices').select('*, members(name)');
      
      if (memberId) {
        query = query.eq('member_id', memberId);
      }
      
      const { data, error } = await query.order('issued_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data to match the Invoice type
        const transformedInvoices: Invoice[] = data.map((invoice) => ({
          id: invoice.id,
          member_id: invoice.member_id,
          memberName: invoice.members?.name || 'Unknown',
          amount: invoice.amount,
          status: invoice.status as InvoiceStatus,
          due_date: invoice.due_date,
          issued_date: invoice.issued_date,
          paid_date: invoice.paid_date,
          payment_method: invoice.payment_method,
          created_at: invoice.created_at,
          updated_at: invoice.updated_at,
          items: invoice.items as InvoiceItem[],
          razorpay_order_id: invoice.razorpay_order_id,
          razorpay_payment_id: invoice.razorpay_payment_id,
          notes: invoice.notes,
          description: invoice.description,
          branch_id: invoice.branch_id
        }));
        
        setInvoices(transformedInvoices);
      }
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [memberId]);

  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          member_id: invoice.member_id,
          amount: invoice.amount,
          status: invoice.status,
          due_date: invoice.due_date,
          issued_date: invoice.issued_date || new Date().toISOString(),
          paid_date: invoice.paid_date,
          payment_method: invoice.payment_method,
          items: invoice.items,
          razorpay_order_id: invoice.razorpay_order_id,
          razorpay_payment_id: invoice.razorpay_payment_id,
          notes: invoice.notes,
          description: invoice.description,
          branch_id: invoice.branch_id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Fetch member name
        const { data: memberData } = await supabase
          .from('members')
          .select('name')
          .eq('id', data.member_id)
          .single();
        
        const newInvoice: Invoice = {
          ...data,
          memberName: memberData?.name || 'Unknown',
          items: data.items as InvoiceItem[]
        };
        
        setInvoices([newInvoice, ...invoices]);
        toast.success('Invoice created successfully');
        return newInvoice;
      }
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      toast.error('Failed to create invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setInvoices(invoices.map(invoice => 
          invoice.id === id ? { ...invoice, ...updates } : invoice
        ));
        toast.success('Invoice updated successfully');
        return data;
      }
    } catch (err: any) {
      console.error('Error updating invoice:', err);
      toast.error('Failed to update invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      toast.success('Invoice deleted successfully');
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      toast.error('Failed to delete invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPaid = async (id: string, paymentMethod: string, paymentId?: string) => {
    return updateInvoice(id, {
      status: 'paid',
      paid_date: new Date().toISOString(),
      payment_method: paymentMethod,
      razorpay_payment_id: paymentId
    });
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid
  };
};
