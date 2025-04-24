
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, FileTextIcon, CreditCardIcon, DownloadIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { Invoice, InvoiceStatus } from "@/types/finance";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branch";
import PaymentRecordDialog from "./PaymentRecordDialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import InvoiceForm from "../InvoiceForm";
import { InvoiceStatsOverview } from "./InvoiceStatsOverview";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/utils/stringUtils";

interface EnhancedInvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
  filter?: string;
}

const EnhancedInvoiceList = ({ 
  readonly = false, 
  allowPayment = true, 
  allowDownload = true, 
  filter = "all" 
}: EnhancedInvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formSheetOpen, setFormSheetOpen] = useState<boolean>(false);
  
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const isMember = user?.role === "member";

  useEffect(() => {
    fetchInvoices();
    
    // Set up real-time listener
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
  }, [currentBranch, refreshData, filter, user]);

  const fetchInvoices = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          profiles:member_id(full_name)
        `);

      // Filter by branch
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }

      // Filter by member if user is a member
      if (isMember) {
        query = query.eq('member_id', user?.id);
      }

      // Apply status filter if not "all"
      if (filter && filter !== "all") {
        query = query.eq('status', filter);
      }

      // Sort by issued date, newest first
      query = query.order('issued_date', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        const formattedInvoices: Invoice[] = data.map(item => ({
          id: item.id,
          status: item.status as InvoiceStatus,
          issuedDate: item.issued_date,
          dueDate: item.due_date,
          paidDate: item.paid_date,
          razorpayOrderId: item.razorpay_order_id,
          razorpayPaymentId: item.razorpay_payment_id,
          memberId: item.member_id,
          memberName: item.profiles?.full_name || 'Unknown Member',
          amount: item.amount,
          items: item.items || [],
          branchId: item.branch_id,
          membershipPlanId: item.membership_plan_id,
          description: item.description,
          paymentMethod: item.payment_method,
          notes: item.notes
        }));
        
        setInvoices(formattedInvoices);
      }
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setFormSheetOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormSheetOpen(true);
  };

  const handleOpenPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handleFormSave = async (invoiceData: any) => {
    try {
      if (selectedInvoice) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update({
            amount: invoiceData.amount,
            status: invoiceData.status,
            due_date: invoiceData.dueDate,
            items: invoiceData.items,
            description: invoiceData.description,
            notes: invoiceData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedInvoice.id);
          
        if (error) throw error;
        toast.success('Invoice updated successfully');
      } else {
        // Create new invoice
        const newInvoice = {
          member_id: invoiceData.memberId,
          amount: invoiceData.amount,
          status: invoiceData.status as InvoiceStatus,
          issued_date: invoiceData.issuedDate,
          due_date: invoiceData.dueDate,
          items: invoiceData.items,
          branch_id: currentBranch?.id,
          description: invoiceData.description,
          notes: invoiceData.notes,
          created_by: user?.id
        };
        
        const { error } = await supabase
          .from('invoices')
          .insert(newInvoice);
          
        if (error) throw error;
        toast.success('Invoice created successfully');
      }
      
      setRefreshData(prev => !prev);
      setFormSheetOpen(false);
      
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    }
  };

  const handleSendPaymentLink = async (invoice: Invoice) => {
    try {
      // In a real application, this would call an API to send a payment link
      toast.success(`Payment link sent to ${invoice.memberName}`);
    } catch (error) {
      console.error('Error sending payment link:', error);
      toast.error('Failed to send payment link');
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      
      // Add logo and header
      doc.setFontSize(22);
      doc.text('INVOICE', 105, 20, { align: 'center' });
      
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoice.id}`, 20, 40);
      doc.text(`Date: ${format(new Date(invoice.issuedDate), 'MMM dd, yyyy')}`, 20, 45);
      doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'MMM dd, yyyy')}`, 20, 50);
      
      // Member details
      doc.text(`Bill To:`, 20, 60);
      doc.text(`${invoice.memberName}`, 20, 65);
      
      // Table header
      doc.setFontSize(9);
      doc.text('Item', 20, 80);
      doc.text('Qty', 120, 80);
      doc.text('Rate', 140, 80);
      doc.text('Amount', 170, 80);
      
      // Draw a line
      doc.line(20, 82, 190, 82);
      
      // Table content
      let yPos = 87;
      let total = 0;
      
      invoice.items.forEach((item, index) => {
        doc.text(item.name, 20, yPos);
        doc.text(item.quantity.toString(), 120, yPos);
        doc.text(formatCurrency(item.unitPrice), 140, yPos);
        const amount = item.quantity * item.unitPrice;
        doc.text(formatCurrency(amount), 170, yPos);
        yPos += 7;
        total += amount;
      });
      
      // Draw a line
      doc.line(20, yPos + 3, 190, yPos + 3);
      
      // Total
      doc.text('Total:', 140, yPos + 10);
      doc.text(formatCurrency(invoice.amount), 170, yPos + 10);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Thank you for your business!', 105, 270, { align: 'center' });
      
      // Save the PDF
      doc.save(`Invoice-${invoice.id}.pdf`);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge variant="outline" className={statusMap[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="space-y-5">
        <InvoiceStatsOverview />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            {!readonly && (
              <Button onClick={handleAddInvoice} className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" /> Create Invoice
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading invoices...</p>
              </div>
            ) : invoices.length > 0 ? (
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
                        <TableCell className="font-medium">{invoice.id.substring(0, 8)}...</TableCell>
                        <TableCell>{invoice.memberName}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{format(new Date(invoice.issuedDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!readonly && (
                              <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
                                <FileTextIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {allowPayment && (invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "partial") && (
                              <Button variant="ghost" size="sm" onClick={() => handleOpenPaymentDialog(invoice)}>
                                <CreditCardIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {allowPayment && (invoice.status === "pending" || invoice.status === "overdue") && (
                              <Button variant="ghost" size="sm" onClick={() => handleSendPaymentLink(invoice)}>
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {allowDownload && (
                              <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                                <Printer className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">No invoices found</p>
                {!readonly && (
                  <Button onClick={handleAddInvoice} variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" /> Create Your First Invoice
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedInvoice && (
        <PaymentRecordDialog
          isOpen={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          invoice={selectedInvoice}
          onPaymentRecorded={() => {
            setPaymentDialogOpen(false);
            setRefreshData(prev => !prev);
          }}
        />
      )}
      
      <Sheet open={formSheetOpen} onOpenChange={setFormSheetOpen}>
        <SheetContent className="w-full sm:w-[600px] md:w-[900px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}</SheetTitle>
            <SheetDescription>
              {selectedInvoice 
                ? 'Edit the details of the existing invoice.' 
                : 'Fill in the details to create a new invoice.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <InvoiceForm
              invoice={selectedInvoice}
              onSave={handleFormSave}
              onCancel={() => setFormSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EnhancedInvoiceList;
