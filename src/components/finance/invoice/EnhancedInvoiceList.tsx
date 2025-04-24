
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Download, Eye, MoreHorizontal, Pencil, Plus, Trash2, CreditCard, Search, Filter } from 'lucide-react';
import { useInvoices } from '@/hooks/use-invoices';
import { useToast } from '@/components/ui/use-toast';
import { Invoice, InvoiceItem, InvoiceStatus } from '@/types/finance';

// Status colors for different invoice statuses
const statusColors: Record<InvoiceStatus, string> = {
  'paid': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'overdue': 'bg-red-100 text-red-800',
  'cancelled': 'bg-gray-100 text-gray-800',
  'draft': 'bg-blue-100 text-blue-800',
  'partially_paid': 'bg-indigo-100 text-indigo-800'
};

interface EnhancedInvoiceListProps {
  onCreateNew?: () => void;
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: string) => void;
  onPayment?: (invoice: Invoice) => void;
}

const EnhancedInvoiceList = ({ 
  onCreateNew, 
  onView, 
  onEdit, 
  onDelete, 
  onPayment 
}: EnhancedInvoiceListProps) => {
  const { toast } = useToast();
  const { invoices, isLoading, deleteInvoice } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      // Apply search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.memberName.toLowerCase().includes(searchLower) ||
        invoice.description?.toLowerCase().includes(searchLower);
      
      // Apply status filter
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.issued_date).getTime() - new Date(b.issued_date).getTime()
          : new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime();
      } else if (sortBy === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        // sort by status
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });
  
  const handleDelete = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
      if (onDelete) onDelete(invoiceId);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    toast({
      title: "Download initiated",
      description: `Invoice #${invoice.id.substring(0, 8)} is being prepared for download`
    });
    // In a real app, implement PDF generation and download
  };

  const toggleSort = (field: 'date' | 'amount' | 'status') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage and track your client invoices</CardDescription>
          </div>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-1 gap-2">
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => setSortBy(value as 'date' | 'amount' | 'status')}>
              <SelectTrigger className="w-full">
                <span>Sort By</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('amount')}>
                  Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('date')}>
                  Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('status')}>
                  Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 h-[200px]">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
                      Loading invoices...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 h-[200px]">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' ? (
                        <>
                          <p>No matching invoices found.</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                            }}
                          >
                            Clear filters
                          </Button>
                        </>
                      ) : (
                        <>
                          <p>No invoices found.</p>
                          <Button variant="link" onClick={onCreateNew}>
                            Create your first invoice
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{invoice.memberName}</TableCell>
                    <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(invoice.issued_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[invoice.status]} border-none`}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onView && onView(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                            <DropdownMenuItem onClick={() => onEdit && onEdit(invoice)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'partially_paid') && (
                            <DropdownMenuItem onClick={() => onPayment && onPayment(invoice)}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Record Payment
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== 'paid' && (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(invoice.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedInvoiceList;
