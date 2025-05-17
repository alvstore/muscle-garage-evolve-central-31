import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { useBranch } from '@/hooks/settings/use-branches';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, Filter, MoreHorizontal, PlusCircle, Search, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Invoice, InvoiceStatus } from '@/types/finance';
import { InvoiceService } from '@/services/finance/invoiceService';

const InvoicesPage = () => {
  // State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { currentBranch } = useBranch();
  
  // Fetch invoices
  useEffect(() => {
    if (currentBranch?.id) {
      loadInvoices();
    }
  }, [currentBranch?.id]);
  
  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await InvoiceService.getInvoices(currentBranch?.id);
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoice data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      (invoice.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(invoice.amount).includes(searchTerm);
      
    const matchesStatus = 
      selectedStatus === 'all' || invoice.status === selectedStatus;
      
    return matchesSearch && matchesStatus;
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: InvoiceStatus) => {
    switch(status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'overdue':
        return "bg-red-100 text-red-800";
      case 'draft':
        return "bg-gray-100 text-gray-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'partially_paid':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Define columns for data table
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'issued_date',
      header: 'Date',
      cell: ({ row }) => {
        return format(new Date(row.original.issued_date), 'dd MMM yyyy');
      },
    },
    {
      accessorKey: 'memberName',
      header: 'Member',
      cell: ({ row }) => {
        return row.original.memberName || 'N/A';
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return row.original.description || 'Invoice';
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return formatCurrency(row.original.amount);
      },
    },
    {
      accessorKey: 'due_date',
      header: 'Due Date',
      cell: ({ row }) => {
        return format(new Date(row.original.due_date), 'dd MMM yyyy');
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={getStatusBadgeClass(status)}>
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = `/finance/invoices/${row.original.id}`}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => InvoiceService.generateInvoicePdf(row.original)}>
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => toast.info('Delete functionality will be implemented soon')}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button onClick={() => window.location.href = '/finance/invoices/new'}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>
              View and manage all invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-0 h-9 w-9 p-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => loadInvoices()}>
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredInvoices} />
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default InvoicesPage;
