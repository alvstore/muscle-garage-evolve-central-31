
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInvoices } from '@/hooks/use-invoices';
import { Invoice } from '@/types/finance';
import { InvoiceListHeader } from '@/components/finance/invoice/InvoiceListHeader';
import { InvoiceListTable } from '@/components/finance/invoice/InvoiceListTable';
import { InvoiceFormDialog } from '@/components/finance/invoice/InvoiceFormDialog';
import { toast } from 'sonner';

export interface EnhancedInvoiceListProps {
  filter?: string;
  allowPayment?: boolean;
  allowDownload?: boolean;
  readOnly?: boolean;
}

const EnhancedInvoiceList = ({ 
  filter = 'all',
  allowPayment = true,
  allowDownload = true,
  readOnly = false
}: EnhancedInvoiceListProps) => {
  const { invoices, isLoading, fetchInvoices, deleteInvoice } = useInvoices();
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (invoices) {
      let filtered = [...invoices];
      
      if (filter && filter !== 'all') {
        filtered = filtered.filter(invoice => invoice.status === filter);
      }
      
      setFilteredInvoices(filtered);
    }
  }, [invoices, filter]);

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleInvoiceFormComplete = () => {
    setShowInvoiceForm(false);
    fetchInvoices();
  };

  return (
    <Card>
      <InvoiceListHeader 
        readOnly={readOnly} 
        onAdd={handleCreateInvoice} 
      />
      
      <CardContent>
        <InvoiceListTable 
          invoices={filteredInvoices} 
          isLoading={isLoading}
          onEdit={readOnly ? undefined : handleEditInvoice}
          onDelete={readOnly ? undefined : handleDeleteInvoice}
          allowPayment={allowPayment}
          allowDownload={allowDownload}
        />
      </CardContent>
      
      {!readOnly && (
        <InvoiceFormDialog 
          open={showInvoiceForm} 
          onOpenChange={setShowInvoiceForm} 
          invoice={selectedInvoice}
          onComplete={handleInvoiceFormComplete}
        />
      )}
    </Card>
  );
};

export default EnhancedInvoiceList;
