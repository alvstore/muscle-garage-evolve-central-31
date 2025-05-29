
import React from 'react';
import { Invoice } from '@/types/finance';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/stringUtils';

interface InvoiceColumnProps {
  invoice: Invoice;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const InvoiceColumn: React.FC<InvoiceColumnProps> = ({ invoice }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">#{invoice.id.substring(0, 8)}</span>
        <Badge className={getStatusColor(invoice.status)}>
          {invoice.status}
        </Badge>
      </div>
      <div className="text-sm text-gray-600">
        <p>Member: {invoice.member_name || 'Unknown'}</p>
        <p>Amount: {formatCurrency(invoice.amount)}</p>
        <p>Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
