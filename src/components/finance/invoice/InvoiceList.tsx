
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Invoice } from "@/types/finance";
import { toast } from "sonner";
import InvoiceForm from "./InvoiceForm";
import { InvoiceListHeader } from "./InvoiceListHeader";
import { InvoiceActions } from "./InvoiceActions";
import { useBranch } from "@/hooks/use-branch";
import PaymentRecordDialog from "./PaymentRecordDialog";
import { supabase } from "@/services/supabaseClient";

interface InvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  filter?: 'all' | 'pending' | 'paid' | 'overdue';
}

const InvoiceList = ({ 
  readonly = false, 
  allowPayment = true, 
  allowDownload = true,
  filter = 'all'
}: InvoiceListProps) => {
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
    <>
      <Card>
        <InvoiceListHeader 
          readonly={readonly}
          onAdd={handleAddInvoice}
        />
        <CardContent>
          {isLoading ? (
            <div className="h-52 flex items-center justify-center">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          ) : (
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
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No invoices found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.memberName}</TableCell>
                      <TableCell>{formatPrice(invoice.amount)}</TableCell>
                      <TableCell>{format(new Date(invoice.issuedDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <InvoiceActions 
                          invoice={invoice}
                          readonly={readonly}
                          allowPayment={allowPayment}
                          allowDownload={allowDownload}
                          onEdit={handleEditInvoice}
                          onMarkAsPaid={handleMarkAsPaid}
                          onSendPaymentLink={handleSendPaymentLink}
                          onDownload={handleDownload}
                          onRecordPayment={handleRecordPayment}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && !readonly && (
        <InvoiceForm
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      
      {paymentDialogOpen && selectedInvoice && (
        <PaymentRecordDialog
          isOpen={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          invoice={selectedInvoice}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}
    </>
  );
};

export default InvoiceList;
