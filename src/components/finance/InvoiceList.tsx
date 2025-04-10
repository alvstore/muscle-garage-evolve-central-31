
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, FileTextIcon, CreditCardIcon, DownloadIcon } from "lucide-react";
import { format } from "date-fns";
import { Invoice } from "@/types/finance";
import InvoiceForm from "./InvoiceForm";
import { toast } from "sonner";

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
  },
];

interface InvoiceListProps {
  readonly?: boolean;
  allowPayment?: boolean;
  allowDownload?: boolean;
}

const InvoiceList = ({ readonly = false, allowPayment = true, allowDownload = true }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    // In a real application, you would make an API call
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
    // In a real application, you would make an API call to Razorpay
    toast.success("Payment link sent successfully");
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    // In a real application, you would make an API call
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      toast.success("Invoice updated successfully");
    } else {
      const newInvoice: Invoice = {
        ...invoice,
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      };
      setInvoices([...invoices, newInvoice]);
      toast.success("Invoice created successfully");
    }
    setIsFormOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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

  return (
    <>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!readonly && (
                        <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
                          <FileTextIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {!readonly && invoice.status === "pending" && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(invoice.id)}>
                          <CreditCardIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {allowPayment && (invoice.status === "pending" || invoice.status === "overdue") && (
                        <Button variant="ghost" size="sm" onClick={() => handleSendPaymentLink(invoice.id)}>
                          <CreditCardIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {allowDownload && (
                        <Button variant="ghost" size="sm" onClick={() => toast.success("Invoice downloaded")}>
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
