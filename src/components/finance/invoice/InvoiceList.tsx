
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Invoice } from '@/types';
import { toast } from 'sonner';
import InvoiceFormDialog from './InvoiceFormDialog';
import InvoiceListTable from './InvoiceListTable';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  onAddInvoice: (invoice: Partial<Invoice>) => Promise<void>;
  onEditInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
  onMarkAsPaid: (id: string) => Promise<void>;
  onSendPaymentLink: (id: string) => Promise<void>;
  onDownloadInvoice: (id: string) => Promise<void>;
  showAddButton?: boolean;
  readonly?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  isLoading,
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onMarkAsPaid,
  onSendPaymentLink,
  onDownloadInvoice,
  showAddButton = true,
  readonly = false
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleAdd = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleSave = async (invoice: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        await onEditInvoice(editingInvoice.id, invoice);
        toast.success("Invoice updated successfully");
      } else {
        await onAddInvoice(invoice);
        toast.success("Invoice created successfully");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          {showAddButton && !readonly && (
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <InvoiceListTable
            invoices={invoices}
            isLoading={isLoading}
            readonly={readonly}
            allowPayment={!readonly}
            allowDownload={true}
            onEdit={handleEdit}
            onMarkAsPaid={onMarkAsPaid}
            onSendPaymentLink={onSendPaymentLink}
            onDownload={onDownloadInvoice}
            onDelete={onDeleteInvoice}
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <InvoiceFormDialog 
            invoice={editingInvoice}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceList;
