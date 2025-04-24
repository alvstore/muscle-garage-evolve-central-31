import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Invoice } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Eye, Download, Trash2 } from "lucide-react";
import { InvoiceStatsOverview } from "./InvoiceStatsOverview";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import PaymentRecordDialog from "./PaymentRecordDialog";
import { supabase } from "@/services/supabaseClient";
import { InvoiceActions } from "./InvoiceActions";
import { InvoiceListHeader } from "./InvoiceListHeader";

const InvoiceList = ({ 
  readonly = false, 
  allowPayment = true, 
  allowDownload = true,
  filter = 'all'
}: { 
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  filter?: 'all' | 'pending' | 'paid' | 'overdue';
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { currentBranch } = useBranch();

  // Fetch invoices from the database
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('invoices')
          .select('*');
        
        // Apply branch filter if branch is selected
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        // Apply status filter if provided
        if (filter && filter !== 'all') {
          query = query.eq('status', filter);
        }
        
        const { data, error } = await query.order('issued_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Convert database format to our Invoice type
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
    
    fetchInvoices();
    
    // Set up real-time subscription for invoice updates
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
  }, [currentBranch, filter]);

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          payment_method: 'cash'
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Invoice marked as paid");
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error('Failed to update invoice');
    }
  };

  const handleSendPaymentLink = (id: string) => {
    // In a real application, you would generate and send a payment link
    toast.success("Payment link sent successfully");
  };

  const handleDownload = (id: string) => {
    // In a real application, you would generate and download an invoice PDF
    toast.success("Invoice downloaded");
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handlePaymentRecorded = () => {
    // Refresh the invoices list (handled by the real-time subscription)
  };

  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      if (editingInvoice) {
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
          
        if (error) {
          throw error;
        }
        
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
          
        if (error) {
          throw error;
        }
        
        toast.success("Invoice created successfully");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      partial: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge variant="outline" className={statusMap[status as keyof typeof statusMap]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-8">
      <InvoiceStatsOverview />
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select defaultValue="10">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            {!readonly && (
              <Button 
                onClick={() => setIsFormOpen(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Input 
              placeholder="Search Invoice" 
              className="w-full sm:w-[300px]" 
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Invoice Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No invoices found</p>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="group">
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <span className="text-indigo-600 font-medium">#{invoice.id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        invoice.status === 'paid' 
                          ? 'bg-green-50 text-green-700' 
                          : invoice.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        {invoice.memberName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{invoice.memberName}</p>
                        <p className="text-sm text-gray-500">{invoice.memberId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${invoice.amount}</TableCell>
                  <TableCell>{format(new Date(invoice.issuedDate), "yyyy-MM-dd")}</TableCell>
                  <TableCell>
                    <span className={invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}>
                      ${invoice.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}
    </div>
  );
};

export default InvoiceList;
