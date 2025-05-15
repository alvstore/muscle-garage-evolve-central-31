import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Invoice, PaymentMethod, InvoiceStatus } from "@/types/finance"; // Add InvoiceStatus import
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/services/supabaseClient';
import { formatCurrency } from '@/utils/stringUtils';

interface PaymentRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onPaymentRecorded: () => void;
}

const PaymentRecordDialog = ({
  isOpen,
  onClose,
  invoice,
  onPaymentRecorded
}: PaymentRecordDialogProps) => {
  const [amount, setAmount] = useState<number>(invoice.amount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPartial, setIsPartial] = useState<boolean>(false);
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amount > invoice.amount) {
      toast.error("Payment amount cannot exceed invoice amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Calculate remaining amount
      const remainingAmount = invoice.amount - amount;
      let newStatus: InvoiceStatus = 'pending';
      
      if (remainingAmount <= 0) {
        newStatus = 'paid';
      } else if (amount > 0) {
        newStatus = 'partially_paid';
      }
      
      // 1. Update invoice
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          status: newStatus,
          paid_date: newStatus === 'paid' ? new Date().toISOString() : null,
          payment_method: paymentMethod,
        })
        .eq('id', invoice.id);

      if (updateError) {
        throw updateError;
      }
      
      // 2. Record payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          member_id: invoice.member_id || invoice.memberId,
          membership_id: invoice.membership_plan_id || invoice.membershipPlanId,
          amount: amount,
          payment_date: new Date().toISOString(),
          branch_id: currentBranch?.id,
          staff_id: user?.id,
          status: 'completed',
          payment_method: paymentMethod,
          notes: `Payment for invoice ${invoice.id}`,
          transaction_id: `pay-${Date.now()}`,
          invoice_id: invoice.id
        });

      if (paymentError) {
        throw paymentError;
      }

      // 3. Record transaction for finance tracking
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          type: 'income',
          amount: amount,
          transaction_date: new Date().toISOString(),
          category_id: null,
          description: `Payment received for invoice ${invoice.id}`,
          reference_id: invoice.id,
          branch_id: currentBranch?.id,
          recorded_by: user?.id,
          payment_method: paymentMethod,
        });

      if (transactionError) {
        throw transactionError;
      }

      toast.success(`Payment of ${formatCurrency(amount)} recorded successfully`);
      onPaymentRecorded();
      onClose();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartialPaymentToggle = (value: boolean) => {
    setIsPartial(value);
    if (!value) {
      setAmount(invoice.amount);
    } else {
      setAmount(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">Invoice #{invoice.id?.substring(0, 8)}...</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.memberName} - {format(new Date(invoice.issuedDate || invoice.issued_date || new Date()), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Total: {formatCurrency(invoice.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    Due by: {format(new Date(invoice.dueDate || invoice.due_date || new Date()), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="partialPayment"
                  checked={isPartial}
                  onChange={(e) => handlePartialPaymentToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="partialPayment">Partial payment</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={!isPartial || isLoading}
                  min={0}
                  max={invoice.amount}
                  step={0.01}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {paymentMethod === 'razorpay' && (
                <div className="p-3 bg-blue-50 rounded-md text-sm">
                  <p>This will generate a payment link that can be sent to the customer.</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRecordDialog;
