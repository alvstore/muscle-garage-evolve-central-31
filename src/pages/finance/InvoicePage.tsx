
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { InvoiceColumn } from '@/components/finance/invoice/InvoiceColumn';
import InvoiceFormDialog from '@/components/finance/invoice/InvoiceFormDialog';
import { Invoice } from '@/types/finance';
import { useInvoices } from '@/hooks/use-invoices';

const InvoicePage = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { invoices, isLoading, fetchInvoices } = useInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setOpenFormDialog(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenFormDialog(true);
  };

  const refreshInvoices = async () => {
    await fetchInvoices();
    setOpenFormDialog(false);
    setSelectedInvoice(null);
  };

  // Convert invoices to the format expected by InvoiceFormDialog
  const adaptedInvoices = invoices.map(invoice => ({
    ...invoice,
    paymentMethod: invoice.payment_method || '',
    // Add other required fields from notification.Invoice that might be missing
    description: invoice.description || '',
    createdAt: invoice.created_at || '',
    created_at: invoice.created_at || '',
    branchId: invoice.branch_id || '',
    branch_id: invoice.branch_id || '',
  }));

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button onClick={handleAddInvoice} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Invoice</span>
          </Button>
        </div>
        
        <div className="rounded-md border">
          <DataTable 
            columns={InvoiceColumn(handleEditInvoice)} 
            data={adaptedInvoices} 
            isLoading={isLoading}
          />
        </div>
        
        <InvoiceFormDialog 
          open={openFormDialog} 
          onOpenChange={setOpenFormDialog}
          invoice={selectedInvoice}
          onComplete={refreshInvoices}
        />
      </div>
    </Container>
  );
};

export default InvoicePage;
