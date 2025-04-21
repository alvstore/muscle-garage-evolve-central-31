import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { recordPayment } from '@/lib/supabase/membershipService';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';

interface PaymentFormProps {
  memberId: string;
  membershipId: string;
  totalAmount: number;
  amountPaid: number;
  onPaymentComplete: () => void;
}

export default function PaymentForm({
  memberId,
  membershipId,
  totalAmount,
  amountPaid,
  onPaymentComplete
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const remainingAmount = totalAmount - amountPaid;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount: remainingAmount,
      paymentMethod: 'cash',
      notes: ''
    }
  });

  const onSubmit = async (data: any) => {
    const branchId = user?.branchId || user?.primaryBranchId;
    
    if (!branchId) {
      toast.error('Branch information is missing');
      return;
    }

    try {
      setLoading(true);
      await recordPayment(
        memberId,
        membershipId,
        data.amount,
        data.paymentMethod,
        branchId,
        user?.id || '',
        data.notes
      );
      toast.success('Payment recorded successfully');
      onPaymentComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Amount</Label>
                <Input value={`₹${totalAmount}`} disabled />
              </div>
              <div>
                <Label>Amount Paid</Label>
                <Input value={`₹${amountPaid}`} disabled />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              max={remainingAmount}
              {...register('amount', {
                required: 'Amount is required',
                max: {
                  value: remainingAmount,
                  message: `Maximum amount is ₹${remainingAmount}`
                }
              })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select defaultValue="cash">
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
