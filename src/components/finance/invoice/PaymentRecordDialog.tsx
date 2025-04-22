
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
import { Invoice, PaymentMethod } from "@/types/finance";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { invoiceService } from '@/services/invoiceService';

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
      const success = await invoiceService.recordPayment(
        invoice.id,
        amount,
        paymentMethod,
        user?.id || "",
        currentBranch?.id || ""
      );
      
      if (success) {
        toast.success(`Payment of ${formatCurrency(amount)} recorded successfully`);
        onPaymentRecorded();
        onClose();
      } else {
        throw new Error("Failed to record payment");
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
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
                  <p className="text-sm font-medium">Invoice #{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.memberName} - {format(new Date(invoice.issuedDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Total: {formatCurrency(invoice.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    Due by: {format(new Date(invoice.dueDate), "MMM d, yyyy")}
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
              
              {paymentMethod === "razorpay" && (
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
