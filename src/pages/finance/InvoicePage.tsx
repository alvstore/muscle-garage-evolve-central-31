
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import InvoiceList from '@/components/finance/invoice/InvoiceList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import InvoiceFormDialog from '@/components/finance/invoice/InvoiceFormDialog';
import { useInvoices } from '@/hooks/use-invoices';

const InvoicePage = () => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const { fetchInvoices } = useInvoices();

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices & Payments</h1>
          <Button
            onClick={() => setIsCreatingInvoice(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>New Invoice</span>
          </Button>
        </div>

        <InvoiceList />

        <InvoiceFormDialog
          open={isCreatingInvoice}
          onOpenChange={setIsCreatingInvoice}
          onSuccess={fetchInvoices}
        />
      </div>
    </Container>
  );
};

export default InvoicePage;
