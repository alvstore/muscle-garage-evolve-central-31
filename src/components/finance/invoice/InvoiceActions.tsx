
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileTextIcon, CreditCardIcon, DownloadIcon } from "lucide-react";
import { Invoice } from "@/types/finance";

interface InvoiceActionsProps {
  invoice: Invoice;
  readonly: boolean;
  allowPayment: boolean;
  allowDownload: boolean;
  onEdit: (invoice: Invoice) => void;
  onMarkAsPaid: (id: string) => void;
  onSendPaymentLink: (id: string) => void;
  onDownload: (id: string) => void;
  onRecordPayment?: (invoice: Invoice) => void;
}

export const InvoiceActions = ({
  invoice,
  readonly,
  allowPayment,
  allowDownload,
  onEdit,
  onMarkAsPaid,
  onSendPaymentLink,
  onDownload,
  onRecordPayment
}: InvoiceActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {!readonly && (
        <Button variant="ghost" size="sm" onClick={() => onEdit(invoice)}>
          <FileTextIcon className="h-4 w-4" />
        </Button>
      )}
      
      {!readonly && (invoice.status === "pending" || invoice.status === "partially_paid") && (
        <Button variant="ghost" size="sm" onClick={() => onMarkAsPaid(invoice.id)}>
          <CreditCardIcon className="h-4 w-4" />
        </Button>
      )}

      {!readonly && onRecordPayment && (invoice.status === "pending" || invoice.status === "partially_paid") && (
        <Button variant="ghost" size="sm" onClick={() => onRecordPayment(invoice)}>
          <CreditCardIcon className="h-4 w-4" />
        </Button>
      )}
      
      {allowPayment && (invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "partially_paid") && (
        <Button variant="ghost" size="sm" onClick={() => onSendPaymentLink(invoice.id)}>
          <CreditCardIcon className="h-4 w-4" />
        </Button>
      )}
      
      {allowDownload && (
        <Button variant="ghost" size="sm" onClick={() => onDownload(invoice.id)}>
          <DownloadIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
