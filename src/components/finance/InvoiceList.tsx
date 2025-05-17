import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Invoice } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branches";
import { InvoiceListTable } from "./invoice/InvoiceListTable";
import { supabase } from '@/services/api/supabaseClient';

interface InvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
}

const InvoiceList = ({ readonly = false, allowPayment = true, allowDownload = true }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { currentBranch } = useBranch();

  // Fetch invoices from Supabase
  useEffect(() => {
    fetchInvoices();
  }, [currentBranch]);

  const fetchInvoices = async () => {
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
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          payment_method: 'cash'
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setInvoices(invoices.map(invoice => 
        invoice.id === id
          ? { 
              ...invoice, 
              status: "paid" as const, 
              paid_date: new Date().toISOString(),
              payment_method: "cash"
            }
          : invoice
      ));
      toast.success("Invoice marked as paid");
      
      // Create transaction record for this payment
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        await supabase
          .from('transactions')
          .insert({
            type: 'income',
            amount: invoice.amount,
            description: `Payment for invoice #${id.substring(0, 8)}`,
            transaction_date: new Date().toISOString(),
            payment_method: 'cash',
            recorded_by: (await supabase.auth.getUser()).data.user?.id,
            branch_id: currentBranch?.id || invoice.branch_id,
            reference_id: id
          });
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const handleSendPaymentLink = (id: string) => {
    // In a real implementation, this would generate a payment link
    toast.success("Payment link sent successfully");
  };

  // Update the handleSaveInvoice function to be compatible with both notification and finance Invoice types
  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      setIsLoading(true);
      
      if (editingInvoice) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update({
            member_id: invoice.member_id || invoice.memberId,
            amount: invoice.amount,
            description: invoice.description,
            status: invoice.status,
            due_date: invoice.due_date || invoice.dueDate,
            items: invoice.items,
            notes: invoice.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', invoice.id);
          
        if (error) throw error;
        
        setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
        toast.success("Invoice updated successfully");
      } else {
        // Create new invoice with consistent field names
        const newInvoice = {
          ...invoice,
          branch_id: currentBranch?.id || 'branch-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: (await supabase.auth.getUser()).data.user?.id,
          items: invoice.items || [],
        };
        
        const { data, error } = await supabase
          .from('invoices')
          .insert(newInvoice)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setInvoices([...invoices, data[0] as Invoice]);
        }
        
        toast.success("Invoice created successfully");
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setIsLoading(false);
      setIsFormOpen(false);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
  };

  const handleDownload = (id: string) => {
    // In a real implementation, this would generate a PDF
    toast.success("Invoice downloaded");
  };
  
  const handleDeleteInvoice = async (id: string) => {
    try {
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
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          {!readonly && (
            <Button onClick={handleAddInvoice} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> Create Invoice
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <InvoiceListTable
            invoices={invoices}
            isLoading={isLoading}
            readonly={readonly}
            allowPayment={allowPayment}
            allowDownload={allowDownload}
            onEdit={handleEditInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onSendPaymentLink={handleSendPaymentLink}
            onDownload={handleDownload}
            onDelete={handleDeleteInvoice}
          />
        </CardContent>
      </Card>

      {isFormOpen && !readonly && (
        <InvoiceForm
          invoice={editingInvoice}
          onComplete={handleSaveInvoice} // Fixed: handleSaveInvoice now accepts an Invoice parameter
          onCancel={handleCancelForm}
        />
      )}
    </>
  );
};

export default InvoiceList;
