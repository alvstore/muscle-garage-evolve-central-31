
import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '@/types/finance';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useBranch } from './use-branch';
import { normalizeInvoiceData, normalizeInvoiceItemData } from '@/utils/invoiceUtils';

export const useInvoices = (options: { memberId?: string; filter?: string } = {}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('invoices')
        .select(`
          *,
          members(name)
        `);
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      if (options.memberId) {
        query = query.eq('member_id', options.memberId);
      }
      
      if (options.filter && options.filter !== 'all') {
        query = query.eq('status', options.filter);
      }
      
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      if (data) {
        const formattedInvoices: Invoice[] = data.map(item => {
          // Parse items from JSON if needed
          const invoiceItems: InvoiceItem[] = Array.isArray(item.items) ? 
            item.items.map((dbItem: any) => normalizeInvoiceItemData({
              id: dbItem.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: dbItem.name || '',
              quantity: dbItem.quantity || 0,
              price: dbItem.price || dbItem.unitPrice || 0,
              description: dbItem.description || '',
              unitPrice: dbItem.unitPrice || dbItem.price || 0
            })) : [];
          
          // Create normalized invoice with both snake_case and camelCase properties
          const invoice: Invoice = normalizeInvoiceData({
            id: item.id,
            member_id: item.member_id,
            amount: item.amount,
            status: item.status,
            issued_date: item.issued_date,
            due_date: item.due_date,
            paid_date: item.paid_date,
            payment_method: item.payment_method,
            notes: item.notes || '',
            items: invoiceItems,
            description: item.description || '',
            branch_id: item.branch_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            created_by: item.created_by,
            membership_plan_id: item.membership_plan_id,
            razorpay_order_id: item.razorpay_order_id || '',
            razorpay_payment_id: item.razorpay_payment_id || '',
            // Additional properties for compatibility
            memberId: item.member_id,
            dueDate: item.due_date,
            issuedDate: item.issued_date,
            memberName: item.members?.name || 'Unknown',
            branchId: item.branch_id
          });
          
          return invoice;
        });
        
        setInvoices(formattedInvoices);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err as Error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvoices();
    
    // Optional: Set up real-time subscription
    const channel = supabase
      .channel('invoice-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          fetchInvoices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch?.id, options.memberId, options.filter]);
  
  const refresh = () => {
    fetchInvoices();
  };
  
  return { invoices, loading, error, refresh };
};
