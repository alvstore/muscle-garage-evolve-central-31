import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Invoice, InvoiceStatus } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branch";
import { InvoiceListTable } from "./invoice/InvoiceListTable";
import { supabase } from '@/services/supabaseClient';

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

  const statusColors: Record<InvoiceStatus, string> = {
    paid: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    overdue: "text-red-600 bg-red-100",
    draft: "text-gray-600 bg-gray-100",
    canceled: "text-gray-600 bg-gray-100",
    partially_paid: "text-blue-600 bg-blue-100"
  };

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
      
      const formattedInvoices = data.map(invoice => ({
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
              status: "paid" as InvoiceStatus, 
              paid_date: new Date().toISOString(),
              payment_method: "cash"
            }
          : invoice
      ));
      toast.success("Invoice marked as paid");
      
      // Create transaction record for this payment
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        const { error: transError } = await supabase
          .from('transactions')
          .insert([{
            amount: invoice.amount,
            type: 'income',
            description: `Payment for invoice #${invoice.id.substring(0, 8)}`,
            payment_method: 'cash',
            reference_id: invoice.id,
            transaction_date: new Date().toISOString()
          }]);
        
        if (transError) {
          console.error("Error creating transaction record:", transError);
        }
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to update invoice status");
    }
  };

  const handleInvoiceFormClose = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const handleInvoiceSaved = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
    fetchInvoices();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        {!readonly && (
          <Button onClick={handleAddInvoice}>
            <PlusIcon className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <InvoiceListTable
          invoices={invoices} 
          isLoading={isLoading}
          onEdit={readonly ? undefined : handleEditInvoice}
          onMarkAsPaid={readonly || !allowPayment ? undefined : handleMarkAsPaid}
          statusColors={statusColors}
          allowDownload={allowDownload}
        />
      </CardContent>

      {isFormOpen && (
        <InvoiceForm
          invoice={editingInvoice} 
          onComplete={handleInvoiceFormClose}
          onCancel={handleInvoiceFormClose}
          onSaved={handleInvoiceSaved}
        />
      )}
    </Card>
  );
};

export default InvoiceList;
