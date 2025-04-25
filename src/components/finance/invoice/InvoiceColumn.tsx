
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Invoice } from '@/types/notification';

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Helper function for invoice status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Paid</Badge>;
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    case 'overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

// Define the columns for the invoice data table
export const InvoiceColumn = (onEdit: (invoice: Invoice) => void): ColumnDef<Invoice>[] => [
  {
    accessorKey: 'id',
    header: 'Invoice ID',
    cell: ({ row }) => <span className="font-medium">{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'memberName',
    header: 'Member',
    cell: ({ row }) => row.getValue('memberName'),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatPrice(row.getValue('amount')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    accessorKey: 'issuedDate',
    header: 'Issued Date',
    cell: ({ row }) => {
      const date = row.getValue('issuedDate');
      if (!date) return '-';
      return format(new Date(date as string), 'MMM dd, yyyy');
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => {
      const date = row.getValue('dueDate');
      if (!date) return '-';
      return format(new Date(date as string), 'MMM dd, yyyy');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              View/Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Send to Email</DropdownMenuItem>
            {invoice.status === 'pending' && (
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
