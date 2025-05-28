import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Invoice, InvoiceStatus } from '@/types/finance';
import { InvoiceFormDialogProps } from '@/types/invoice';

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onComplete 
}) => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    member_id: '',
    amount: 0,
    due_date: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue', // Restrict to valid statuses
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number || '',
        member_id: invoice.member_id,
        amount: invoice.amount,
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        status: invoice.status === 'cancelled' ? 'pending' : invoice.status as 'pending' | 'paid' | 'overdue',
        description: invoice.description || '',
        notes: invoice.notes || '',
      });
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as 'pending' | 'paid' | 'overdue' }));
  };

  const handleSubmit = () => {
    // Implement submit logic here
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input
              id="invoice_number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
              placeholder="INV-001"
            />
          </div>

          <div>
            <Label htmlFor="member_id">Member ID</Label>
            <Input
              id="member_id"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              placeholder="Member ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Invoice description"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
