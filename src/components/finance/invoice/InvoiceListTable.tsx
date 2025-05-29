
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/finance';
import { formatCurrency } from '@/utils/stringUtils';
import { Eye, Edit, Trash2, Download, CreditCard, Send } from 'lucide-react';

interface InvoiceListTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  onEdit: (invoice: Invoice) => void;
  onMarkAsPaid: (id: string) => void;
  onSendPaymentLink: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Invoice #</th>
            <th className="text-left p-2">Member</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Due Date</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              <td className="p-2">#{invoice.id.substring(0, 8)}</td>
              <td className="p-2">{invoice.member_name || 'Unknown'}</td>
              <td className="p-2">{formatCurrency(invoice.amount)}</td>
              <td className="p-2">
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </td>
              <td className="p-2">{new Date(invoice.due_date).toLocaleDateString()}</td>
              <td className="p-2">
                <div className="flex gap-1">
                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(invoice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {allowPayment && invoice.status !== 'paid' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsPaid(invoice.id)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendPaymentLink(invoice.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {allowDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(invoice.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
