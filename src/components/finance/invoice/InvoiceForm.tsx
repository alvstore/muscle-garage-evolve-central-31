
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, InvoiceStatus, PaymentMethod } from '@/types/finance';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';

export interface InvoiceFormProps {
  invoice: Invoice | null;
  onComplete?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onComplete }) => {
  const { currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    member_id: invoice?.member_id || '',
    member_name: invoice?.memberName || '',  // This field may need to come from another source
    description: invoice?.description || '',
    amount: invoice?.amount || 0,
    status: invoice?.status || 'pending' as InvoiceStatus,
    due_date: invoice?.due_date || new Date().toISOString().split('T')[0],
    payment_method: invoice?.payment_method || 'online' as PaymentMethod,
    notes: invoice?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (invoice?.id) {
        // Update existing invoice
        await supabase
          .from('invoices')
          .update({
            ...formData,
            branch_id: currentBranch?.id || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoice.id);
          
        toast.success('Invoice updated successfully');
      } else {
        // Create new invoice
        await supabase
          .from('invoices')
          .insert([{
            ...formData,
            branch_id: currentBranch?.id || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
          
        toast.success('Invoice created successfully');
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as InvoiceStatus
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      payment_method: value as PaymentMethod
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member_id">Member ID</Label>
              <Input
                id="member_id"
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                placeholder="Member ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member_name">Member Name</Label>
              <Input
                id="member_name"
                name="member_name"
                value={formData.member_name}
                onChange={handleChange}
                placeholder="Member Name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Invoice description"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                name="status" 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select 
                name="payment_method" 
                value={formData.payment_method}
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            {onComplete && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onComplete} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default InvoiceForm;
