
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Invoice } from '@/types/finance';
import { InvoiceActions } from './InvoiceActions';

export interface InvoiceListTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  onEdit?: (invoice: Invoice) => void;
  onMarkAsPaid?: (id: string) => void;
  onSendPaymentLink?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const InvoiceListTable: React.FC<InvoiceListTableProps> = ({
  invoices,
  isLoading,
  readonly = false,
  allowPayment = true,
  allowDownload = true,
  onEdit,
  onMarkAsPaid,
  onSendPaymentLink,
  onDownload,
  onDelete,
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading invoices...</div>;
  }

  if (!invoices || invoices.length === 0) {
    return <div className="text-center py-10">No invoices found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id.substring(0, 8)}...</TableCell>
              <TableCell>{invoice.memberName || 'Unknown'}</TableCell>
              <TableCell>${invoice.amount.toLocaleString()}</TableCell>
              <TableCell>{format(new Date(invoice.issued_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <Badge 
                  variant={invoice.status === "paid" ? "default" : 
                         invoice.status === "pending" ? "outline" : 
                         "destructive"}
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <InvoiceActions
                  invoice={invoice}
                  readonly={readonly}
                  allowPayment={allowPayment}
                  allowDownload={allowDownload}
                  onEdit={onEdit || (() => {})}
                  onMarkAsPaid={onMarkAsPaid || (() => {})}
                  onSendPaymentLink={onSendPaymentLink || (() => {})}
                  onDownload={onDownload || (() => {})}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
