
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/finance';
import { toast } from 'sonner';
import { useBranch } from './use-branches';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  const fetchInvoices = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, cannot fetch invoices');
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          members(name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('issued_date', { ascending: false });
      
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
    if (!currentBranch?.id) {
      toast.error('Please select a branch first');
      return null;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            ...invoice,
            branch_id: currentBranch.id,
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
        return newInvoice;
      } else {
        const newInvoice = data[0];
        setInvoices([newInvoice, ...invoices]);
        return newInvoice;
      }
      
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
      return { ...invoices.find(inv => inv.id === id), ...updates };
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
    if (currentBranch?.id) {
      fetchInvoices();
    }
  }, [fetchInvoices, currentBranch?.id]);

  return { 
    invoices, 
    isLoading, 
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
};
