import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Invoice, InvoiceService } from '@/services/finance/invoiceService';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function InvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      
      try {
        setIsLoading(true);
        const data = await InvoiceService.getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/finance/invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500">Partially Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF generation and download
    toast.info('PDF download will be implemented soon');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Invoice not found</h2>
          <p className="text-muted-foreground mt-2">The requested invoice could not be found.</p>
          <Button onClick={() => navigate('/finance/invoices')} className="mt-4">
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 print:p-0">
      <div className="flex flex-col space-y-6 print:space-y-2">
        {/* Header with back button and actions */}
        <div className="flex justify-between items-center print:hidden">
          <Button
            variant="ghost"
            onClick={() => navigate('/finance/invoices')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Invoice */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader className="pb-2 print:pb-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">INVOICE</CardTitle>
                <p className="text-sm text-muted-foreground">
                  #{invoice.invoice_number || invoice.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(invoice.status)}
                <p className="text-sm text-muted-foreground mt-1">
                  Issued: {format(new Date(invoice.issued_date), 'MMM dd, yyyy')}
                </p>
                {invoice.due_date && (
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 print:pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">BILL TO</h3>
                <p className="font-medium">{invoice.member_name || 'N/A'}</p>
                {invoice.member_phone && <p>{invoice.member_phone}</p>}
                {invoice.member_email && <p className="text-sm">{invoice.member_email}</p>}
              </div>
              <div className="text-right md:text-left">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">PAYMENT DETAILS</h3>
                <p>Payment Method: {invoice.payment_method || 'N/A'}</p>
                {invoice.payment_date && (
                  <p>Paid on: {format(new Date(invoice.payment_date), 'MMM dd, yyyy')}</p>
                )}
              </div>
            </div>

            {/* Invoice Items */}
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
                <div className="col-span-6 font-medium">Description</div>
                <div className="col-span-2 font-medium text-right">Unit Price</div>
                <div className="col-span-2 font-medium text-right">Qty</div>
                <div className="col-span-2 font-medium text-right">Amount</div>
              </div>
              {Array.isArray(invoice.items) && invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b">
                  <div className="col-span-6">
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.unit_price || 0)}
                  </div>
                  <div className="col-span-2 text-right">{item.quantity || 1}</div>
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency((item.unit_price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(invoice.amount || 0)}</span>
                </div>
                {invoice.discount_amount && invoice.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>-{formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}
                {invoice.tax_amount && invoice.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({invoice.tax_rate || 0}%):</span>
                    <span>{formatCurrency(invoice.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.amount || 0)}</span>
                </div>
                {invoice.amount_paid !== undefined && invoice.amount_paid > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="text-green-600">{formatCurrency(invoice.amount_paid)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Balance Due:</span>
                      <span>{formatCurrency((invoice.amount || 0) - (invoice.amount_paid || 0))}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 p-4 bg-muted/30 rounded-md">
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
