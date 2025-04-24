
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/stringUtils";
import { format } from "date-fns";
import { Plus, Eye, Download, Edit, Trash2, MoreHorizontal, Copy, ArrowUpDown } from "lucide-react";
import { Invoice } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { supabase } from "@/services/supabaseClient";
import { useBranch } from "@/hooks/use-branch";
import { toast } from "sonner";
import { InvoiceStatsOverview } from "./InvoiceStatsOverview";
import PaymentRecordDialog from "./PaymentRecordDialog";
import { useAuth } from "@/hooks/use-auth";

interface EnhancedInvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  filter?: string;
}

const EnhancedInvoiceList: React.FC<EnhancedInvoiceListProps> = ({
  readonly = false,
  allowPayment = true,
  allowDownload = true,
  filter = 'all'
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  
  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    draft: "bg-blue-100 text-blue-800",
    sent: "bg-purple-100 text-purple-800",
    "partial payment": "bg-indigo-100 text-indigo-800",
    "past due": "bg-rose-100 text-rose-800",
  };
  
  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('invoices')
        .select('*');
      
      // Apply branch filter
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter.toLowerCase());
      }
      
      // Apply search filter
      if (searchQuery) {
        query = query.or(`member_name.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
      }
      
      // Calculate pagination
      const from = (currentPage - 1) * parseInt(rowsPerPage);
      const to = currentPage * parseInt(rowsPerPage) - 1;
      
      // Get total count for pagination
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });
      
      setTotalPages(Math.ceil((count || 0) / parseInt(rowsPerPage)));
      
      // Add pagination to query
      const { data, error } = await query
        .order('issued_date', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      if (data) {
        const formattedInvoices: Invoice[] = data.map(invoice => ({
          id: invoice.id,
          memberId: invoice.member_id,
          memberName: invoice.member_name,
          amount: invoice.amount,
          status: invoice.status,
          dueDate: invoice.due_date,
          issuedDate: invoice.issued_date,
          paidDate: invoice.paid_date,
          paymentMethod: invoice.payment_method,
          items: invoice.items || [],
          notes: invoice.notes,
          membershipPlanId: invoice.membership_plan_id,
          branchId: invoice.branch_id,
          razorpayOrderId: invoice.razorpay_order_id,
          razorpayPaymentId: invoice.razorpay_payment_id,
        }));
        
        setInvoices(formattedInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvoices();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('invoice_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          fetchInvoices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch, statusFilter, searchQuery, rowsPerPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, rowsPerPage]);

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(invoices.map(invoice => invoice.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, invoices]);

  const handleRowCheckboxChange = (invoiceId: string) => {
    setSelectedRows(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };
  
  const handleDeleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicatedInvoice = {
      ...invoice,
      id: "",
      status: "draft",
      issuedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: null,
      razorpayOrderId: null,
      razorpayPaymentId: null,
    };
    
    setEditingInvoice(duplicatedInvoice);
    setIsFormOpen(true);
  };

  const handleDownloadInvoice = (id: string) => {
    // In a real app, this would generate and download a PDF
    toast.success("Invoice download started");
  };
  
  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      if (invoice.id) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update({
            member_id: invoice.memberId,
            member_name: invoice.memberName,
            amount: invoice.amount,
            status: invoice.status,
            due_date: invoice.dueDate,
            issued_date: invoice.issuedDate,
            items: invoice.items,
            notes: invoice.notes,
            membership_plan_id: invoice.membershipPlanId,
          })
          .eq('id', invoice.id);
          
        if (error) throw error;
        
        toast.success("Invoice updated successfully");
      } else {
        // Create new invoice
        const { error } = await supabase
          .from('invoices')
          .insert({
            member_id: invoice.memberId,
            member_name: invoice.memberName,
            amount: invoice.amount,
            status: invoice.status,
            due_date: invoice.dueDate,
            issued_date: invoice.issuedDate,
            items: invoice.items,
            notes: invoice.notes,
            membership_plan_id: invoice.membershipPlanId,
            branch_id: currentBranch?.id,
          });
          
        if (error) throw error;
        
        toast.success("Invoice created successfully");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const renderPaginationControls = () => {
    return (
      <div className="flex items-center justify-between border-t pt-4 mt-2">
        <div className="text-sm text-gray-500">
          Showing {Math.min((currentPage - 1) * parseInt(rowsPerPage) + 1, invoices.length + ((currentPage - 1) * parseInt(rowsPerPage)))} to {Math.min(currentPage * parseInt(rowsPerPage), invoices.length + ((currentPage - 1) * parseInt(rowsPerPage)))} of {totalPages * parseInt(rowsPerPage)} entries
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = currentPage <= 3
              ? i + 1
              : currentPage >= totalPages - 2
                ? totalPages - 4 + i
                : currentPage - 2 + i;
                
            if (pageNum <= totalPages) {
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <InvoiceStatsOverview />
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select 
              value={rowsPerPage} 
              onValueChange={setRowsPerPage}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            {!readonly && (
              <Button 
                onClick={handleAddInvoice} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Invoice
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Input 
              placeholder="Search Invoice" 
              className="w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Invoice Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="partial payment">Partial Payment</SelectItem>
                <SelectItem value="past due">Past Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)} 
                />
              </TableHead>
              <TableHead className="text-indigo-600 cursor-pointer" onClick={() => toast.info("Sorting not implemented in this demo")}>
                # <ArrowUpDown className="h-4 w-4 inline-block ml-1" />
              </TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>CLIENT</TableHead>
              <TableHead className="text-right">TOTAL</TableHead>
              <TableHead>ISSUED DATE</TableHead>
              <TableHead className="text-right">BALANCE</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">Loading invoices...</p>
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No invoices found</p>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="group">
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedRows.includes(invoice.id)}
                      onChange={() => handleRowCheckboxChange(invoice.id)} 
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-indigo-600 font-medium">#{invoice.id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[invoice.status] || "bg-gray-100 text-gray-800"}
                    >
                      {invoice.status === 'paid' ? 'Paid' : 
                       invoice.status === 'pending' ? 'Pending' :
                       invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        {invoice.memberName ? getInitials(invoice.memberName) : 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{invoice.memberName}</p>
                        <p className="text-xs text-gray-500">{invoice.memberId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{format(new Date(invoice.issuedDate), "yyyy-MM-dd")}</TableCell>
                  <TableCell className="text-right">
                    <span className={invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(invoice.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {renderPaginationControls()}
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-[800px] sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle>{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</SheetTitle>
          </SheetHeader>
          <InvoiceForm
            invoice={editingInvoice}
            onSave={handleSaveInvoice}
            onCancel={() => setIsFormOpen(false)}
          />
        </SheetContent>
      </Sheet>
      
      {paymentDialogOpen && selectedInvoice && (
        <PaymentRecordDialog
          isOpen={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          invoice={selectedInvoice}
          onPaymentRecorded={() => fetchInvoices()}
        />
      )}
    </div>
  );
};

export default EnhancedInvoiceList;
