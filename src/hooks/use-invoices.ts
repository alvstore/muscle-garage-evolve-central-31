
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, InvoiceStatus, adaptInvoiceFromDB } from '@/types/finance';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';

export const useInvoices = (memberId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('invoices').select('*, members(name)');
      
      if (memberId) {
        query = query.eq('member_id', memberId);
      }
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query.order('issued_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data to match the Invoice type with both snake_case and camelCase properties
        const transformedInvoices: Invoice[] = data.map((invoice) => {
          const transformed = adaptInvoiceFromDB({
            ...invoice,
            memberName: invoice.members?.name || 'Unknown',
            items: invoice.items as InvoiceItem[]
          });
          
          return transformed;
        });
        
        setInvoices(transformedInvoices);
      }
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [memberId, currentBranch?.id]);

  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      // Ensure we have both snake_case and camelCase properties set correctly
      const dataToInsert = {
        member_id: invoice.member_id || invoice.memberId,
        amount: invoice.amount,
        status: invoice.status,
        due_date: invoice.due_date || invoice.dueDate,
        issued_date: invoice.issued_date || invoice.issuedDate || new Date().toISOString(),
        paid_date: invoice.paid_date || invoice.paidDate,
        payment_method: invoice.payment_method,
        items: invoice.items.map(item => ({
          ...item,
          price: item.price || item.unitPrice
        })),
        razorpay_order_id: invoice.razorpay_order_id,
        razorpay_payment_id: invoice.razorpay_payment_id,
        notes: invoice.notes,
        description: invoice.description,
        branch_id: invoice.branch_id || invoice.branchId || currentBranch?.id
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(dataToInsert)
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
        
        const newInvoice = adaptInvoiceFromDB({
          ...data,
          memberName: memberData?.name || 'Unknown',
          items: data.items as InvoiceItem[]
        });
        
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
      // Transform data to ensure snake_case DB format
      const dbUpdates = {
        ...(updates.member_id || updates.memberId ? { member_id: updates.member_id || updates.memberId } : {}),
        ...(updates.amount ? { amount: updates.amount } : {}),
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.due_date || updates.dueDate ? { due_date: updates.due_date || updates.dueDate } : {}),
        ...(updates.issued_date || updates.issuedDate ? { issued_date: updates.issued_date || updates.issuedDate } : {}),
        ...(updates.paid_date || updates.paidDate ? { paid_date: updates.paid_date || updates.paidDate } : {}),
        ...(updates.payment_method ? { payment_method: updates.payment_method } : {}),
        ...(updates.items ? { 
          items: updates.items.map(item => ({
            ...item,
            price: item.price || item.unitPrice
          }))
        } : {}),
        ...(updates.razorpay_order_id ? { razorpay_order_id: updates.razorpay_order_id } : {}),
        ...(updates.razorpay_payment_id ? { razorpay_payment_id: updates.razorpay_payment_id } : {}),
        ...(updates.notes ? { notes: updates.notes } : {}),
        ...(updates.description ? { description: updates.description } : {}),
        ...(updates.branch_id || updates.branchId ? { branch_id: updates.branch_id || updates.branchId } : {}),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const updatedInvoice = adaptInvoiceFromDB({
          ...data,
          memberName: invoices.find(inv => inv.id === id)?.memberName || '',
          items: data.items as InvoiceItem[]
        });
        
        setInvoices(invoices.map(invoice => 
          invoice.id === id ? updatedInvoice : invoice
        ));
        
        toast.success('Invoice updated successfully');
        return updatedInvoice;
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
