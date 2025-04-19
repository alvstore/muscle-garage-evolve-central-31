import { useState } from "react";
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

interface InvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    memberId: "member-1",
    memberName: "John Doe",
    amount: 1999,
    status: "paid",
    dueDate: new Date(2023, 3, 15).toISOString(),
    issuedDate: new Date(2023, 3, 1).toISOString(),
    paidDate: new Date(2023, 3, 10).toISOString(),
    paymentMethod: "cash",
    items: [
      {
        id: "item-1",
        name: "Basic Monthly Membership",
        quantity: 1,
        unitPrice: 1999,
      }
    ],
    branchId: "branch-1",
  },
  {
    id: "INV-002",
    memberId: "member-2",
    memberName: "Jane Smith",
    amount: 5499,
    status: "pending",
    dueDate: new Date(2023, 4, 15).toISOString(),
    issuedDate: new Date(2023, 4, 1).toISOString(),
    items: [
      {
        id: "item-2",
        name: "Premium Quarterly Membership",
        quantity: 1,
        unitPrice: 5499,
      }
    ],
    razorpayOrderId: "order_123456",
    branchId: "branch-1",
  },
  {
    id: "INV-003",
    memberId: "member-3",
    memberName: "Alex Johnson",
    amount: 18999,
    status: "overdue",
    dueDate: new Date(2023, 3, 30).toISOString(),
    issuedDate: new Date(2023, 3, 15).toISOString(),
    items: [
      {
        id: "item-3",
        name: "Platinum Annual Membership",
        quantity: 1,
        unitPrice: 18999,
      }
    ],
    branchId: "branch-1",
  },
];

const InvoiceList = ({ readonly = false, allowPayment = true, allowDownload = true }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
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
              paidDate: new Date().toISOString(),
              paymentMethod: "cash"
            }
          : invoice
      )
    );
    toast.success("Invoice marked as paid");
  };

  const handleSendPaymentLink = (id: string) => {
    toast.success("Payment link sent successfully");
  };

  const handleDownload = (id: string) => {
    toast.success("Invoice downloaded");
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      toast.success("Invoice updated successfully");
    } else {
      const newInvoice: Invoice = {
        ...invoice,
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        branchId: currentBranch?.id || 'branch-1',
      };
      setInvoices([...invoices, newInvoice]);
      toast.success("Invoice created successfully");
    }
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
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
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && !readonly && (
        <InvoiceForm
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default InvoiceList;
