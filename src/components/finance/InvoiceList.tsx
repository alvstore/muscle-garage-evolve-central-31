import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Invoice } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branch";
import { InvoiceListTable } from "./invoice/InvoiceListTable";

interface InvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
}

const InvoiceList = ({ readonly = false, allowPayment = true, allowDownload = true }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { currentBranch } = useBranch();

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices(
      invoices.map(invoice => 
        invoice.id === id
          ? { 
              ...invoice, 
              status: "paid" as const, 
              paid_date: new Date().toISOString(),
              payment_method: "cash"
            }
          : invoice
      )
    );
    toast.success("Invoice marked as paid");
  };

  const handleSendPaymentLink = (id: string) => {
    toast.success("Payment link sent successfully");
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      toast.success("Invoice updated successfully");
    } else {
      const newInvoice: Invoice = {
        ...invoice,
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        branch_id: currentBranch?.id || 'branch-1',
        branchId: currentBranch?.id || 'branch-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setInvoices([...invoices, newInvoice]);
      toast.success("Invoice created successfully");
    }
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
  };

  const handleDownload = (id: string) => {
    toast.success("Invoice downloaded");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          {!readonly && (
            <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> Create Invoice
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <InvoiceListTable
            invoices={invoices}
            isLoading={false}
            readonly={readonly}
            allowPayment={allowPayment}
            allowDownload={allowDownload}
            onEdit={handleEditInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onSendPaymentLink={handleSendPaymentLink}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>

      {isFormOpen && !readonly && (
        <InvoiceForm
          invoice={editingInvoice}
          onComplete={handleSaveInvoice}
          onCancel={handleCancelForm}
        />
      )}
    </>
  );
};

export default InvoiceList;
