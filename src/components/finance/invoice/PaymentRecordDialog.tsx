
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/services/api/supabaseClient";
import { Invoice, InvoiceStatus, PaymentMethod } from '@/types/finance';

interface PaymentRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onPaymentRecorded: () => void;
}

const PaymentRecordDialog: React.FC<PaymentRecordDialogProps> = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onPaymentRecorded 
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionId, setTransactionId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [partialPayment, setPartialPayment] = useState<boolean>(false);

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.amount);
    }
  }, [invoice]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);
    
    // Determine if this is a partial payment
    if (invoice) {
      setPartialPayment(newAmount < invoice.amount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoice) return;
    
    setIsSubmitting(true);
    
    try {
      // Determine new invoice status based on payment amount
      let newStatus: InvoiceStatus;
      
      if (amount >= invoice.amount) {
        newStatus = InvoiceStatus.PAID;
      } else if (amount > 0) {
        newStatus = InvoiceStatus.PARTIALLY_PAID as InvoiceStatus;
      } else {
        newStatus = InvoiceStatus.PENDING;
      }
      
      // Update invoice in database
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          status: newStatus,
          paid_date: paymentDate.toISOString(),
          payment_method: paymentMethod,
          notes: notes || invoice.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);
      
      if (invoiceError) {
        throw invoiceError;
      }
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          amount: amount,
          member_id: invoice.member_id,
          payment_date: paymentDate.toISOString(),
          payment_method: paymentMethod,
          transaction_id: transactionId || null,
          notes: notes || null,
          membership_id: invoice.membership_plan_id || null,
          status: 'completed'
        }]);
      
      if (paymentError) {
        throw paymentError;
      }
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          amount: amount,
          type: 'income',
          description: `Payment for invoice #${invoice.id.substring(0, 8)}`,
          transaction_date: paymentDate.toISOString(),
          payment_method: paymentMethod,
          reference_id: invoice.id,
          transaction_id: transactionId || null
        }]);
      
      if (transactionError) {
        throw transactionError;
      }
      
      toast.success('Payment recorded successfully');
      onPaymentRecorded();
      onClose();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={handleAmountChange}
                className="col-span-3"
              />
              {partialPayment && (
                <p className="text-xs text-amber-500">
                  This is a partial payment. The invoice will be marked as partially paid.
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="payment-date"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !paymentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(date) => date && setPaymentDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Methods</SelectLabel>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-id">Transaction ID (Optional)</Label>
              <Input
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || amount <= 0}>
              {isSubmitting ? "Processing..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRecordDialog;
