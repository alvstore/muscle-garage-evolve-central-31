import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Invoice } from '@/types/finance';
import InvoiceFormDialog from './InvoiceFormDialog';

const EnhancedInvoiceList: React.FC = () => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Placeholder data for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoice_number: 'INV-2024-001',
      member_id: 'M001',
      member_name: 'John Doe',
      amount: 150.00,
      status: 'pending',
      due_date: '2024-03-15',
      items: [{ id: '1', description: 'Membership Fee', quantity: 1, total: 150.00 }],
    },
    {
      id: '2',
      invoice_number: 'INV-2024-002',
      member_id: 'M002',
      member_name: 'Jane Smith',
      amount: 200.00,
      status: 'paid',
      due_date: '2024-03-20',
      items: [{ id: '2', description: 'Personal Training', quantity: 5, total: 200.00 }],
    },
  ]);

  const handleOpenInvoiceDialog = (invoice?: Invoice) => {
    setSelectedInvoice(invoice || null);
    setInvoiceDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage your invoices here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.member_name}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleOpenInvoiceDialog()}>Add Invoice</Button>
        </CardFooter>
      </Card>
      
      <InvoiceFormDialog
        isOpen={invoiceDialogOpen}
        onClose={() => setInvoiceDialogOpen(false)}
        invoice={selectedInvoice}
        onComplete={() => {
          setInvoiceDialogOpen(false);
          // Refresh invoices logic here
        }}
      />
    </div>
  );
};

export default EnhancedInvoiceList;
