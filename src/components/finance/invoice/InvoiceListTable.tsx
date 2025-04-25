
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, Trash2, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { Invoice } from '@/types/finance';

export interface InvoiceListTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (id: string) => void;
  allowPayment?: boolean;
  allowDownload?: boolean;
}

export const InvoiceListTable: React.FC<InvoiceListTableProps> = ({
  invoices,
  isLoading,
  onEdit,
  onDelete,
  allowPayment = true,
  allowDownload = true,
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading invoices...</div>;
  }

  if (!invoices || invoices.length === 0) {
    return <div className="text-center py-10">No invoices found</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id.substring(0, 8)}...</TableCell>
              <TableCell>{invoice.memberName || 'Unknown'}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>{format(new Date(invoice.issued_date || invoice.issuedDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(invoice.due_date || invoice.dueDate), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {allowDownload && (
                    <Button size="sm" variant="outline" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {allowPayment && invoice.status !== 'paid' && (
                    <Button size="sm" variant="outline" title="Pay">
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}

                  {onEdit && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(invoice)} 
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onDelete(invoice.id)} 
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
