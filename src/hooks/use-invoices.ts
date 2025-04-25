
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Invoice } from '@/types/finance';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('invoices')
        .select(`
          *,
          members(name)
        `)
        .order('issued_date', { ascending: false });
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedInvoices: Invoice[] = data.map(invoice => ({
        ...invoice,
        memberName: invoice.members?.name || 'Unknown'
      }));
      
      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            ...invoice,
            branch_id: invoice.branch_id || currentBranch?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Fetch member name for the new invoice
      if (data && data[0].member_id) {
        const { data: memberData } = await supabase
          .from('members')
          .select('name')
          .eq('id', data[0].member_id)
          .single();
          
        const newInvoice = {
          ...data[0],
          memberName: memberData?.name || 'Unknown'
        };
        
        setInvoices([newInvoice, ...invoices]);
      } else {
        setInvoices([data[0], ...invoices]);
      }
      
      toast.success('Invoice created successfully');
      return data[0];
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('invoices')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setInvoices(invoices.map(invoice => 
        invoice.id === id ? { ...invoice, ...updates } : invoice
      ));
      
      toast.success('Invoice updated successfully');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { 
    invoices, 
    isLoading, 
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
};
