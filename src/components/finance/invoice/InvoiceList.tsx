import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/types/finance";
import { InvoiceStatsOverview } from "./InvoiceStatsOverview";
import { InvoiceFormDialog } from "./InvoiceFormDialog";
import { InvoiceListHeader } from "./InvoiceListHeader";
import { InvoiceListTable } from "./InvoiceListTable";

interface InvoiceListProps {
  invoices: Invoice[];
  readOnly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  onAdd: () => void;
  onEdit: (invoice: Invoice) => void;
  onMarkAsPaid: (id: string) => void;
  onSendPaymentLink: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const InvoiceList = ({
  invoices,
  readOnly,
  allowPayment,
  allowDownload,
  onAdd,
  onEdit,
  onMarkAsPaid,
  onSendPaymentLink,
  onDownload,
  onDelete,
}: InvoiceListProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);

  const handleAdd = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
    onAdd();
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
    onEdit(invoice);
  };

  const handleComplete = (invoice?: Invoice) => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <Card>
      <InvoiceListHeader readOnly={readOnly} onAdd={handleAdd} />
      <CardContent>
        <InvoiceStatsOverview invoices={invoices} />
        <InvoiceListTable
          invoices={invoices}
          readonly={readOnly}
          allowPayment={allowPayment}
          allowDownload={allowDownload}
          onEdit={handleEdit}
          onMarkAsPaid={onMarkAsPaid}
          onSendPaymentLink={onSendPaymentLink}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </CardContent>
      <InvoiceFormDialog
        invoice={selectedInvoice}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onComplete={handleComplete}
      />
    </Card>
  );
};
