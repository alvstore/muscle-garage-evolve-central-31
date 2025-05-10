
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemberships } from '@/hooks/use-memberships';
import { useMembers } from '@/hooks/use-members';
import { useTrainers } from '@/hooks/use-trainers';
import { useBranch } from '@/hooks/use-branch';
import { membershipService } from '@/services/membershipService';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  memberId: z.string({ required_error: 'Member is required' }),
  membershipId: z.string({ required_error: 'Membership plan is required' }),
  trainerId: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  branchId: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'partial']),
  paymentMethod: z.string().optional(),
  amountPaid: z.number().min(0, 'Amount paid must be positive').optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MembershipAssignmentFormProps {
  memberId?: string;
  onSuccess?: (data: any) => void;
}

const MembershipAssignmentForm: React.FC<MembershipAssignmentFormProps> = ({ memberId, onSuccess }) => {
  const { toast } = useToast();
  const { members, isLoading: isLoadingMembers } = useMembers();
  const { memberships, isLoading: isLoadingMemberships } = useMemberships();
  const { trainers, isLoading: isLoadingTrainers } = useTrainers();
  const { currentBranch } = useBranch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: memberId || '',
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      paymentStatus: 'pending',
      amountPaid: 0,
    },
  });

  // When membership changes, update the end date
  useEffect(() => {
    const membershipId = form.watch('membershipId');
    if (membershipId && memberships) {
      const membership = memberships.find(m => m.id === membershipId);
      if (membership) {
        setSelectedMembership(membership);
        setTotalAmount(membership.price);
        const startDate = form.watch('startDate') || new Date();
        const endDate = membershipService.calculateEndDate(startDate, membership.duration_days);
        form.setValue('endDate', endDate);
      }
    }
  }, [form.watch('membershipId'), memberships, form]);

  // When start date changes, recalculate end date based on selected membership
  useEffect(() => {
    const startDate = form.watch('startDate');
    if (startDate && selectedMembership) {
      const endDate = membershipService.calculateEndDate(startDate, selectedMembership.duration_days);
      form.setValue('endDate', endDate);
    }
  }, [form.watch('startDate'), selectedMembership, form]);

  // When payment status changes, update form requirements
  useEffect(() => {
    const paymentStatus = form.watch('paymentStatus');
    if (paymentStatus === 'paid' || paymentStatus === 'partial') {
      form.register('paymentMethod', { required: 'Payment method is required' });
    }
    
    if (paymentStatus === 'paid') {
      form.setValue('amountPaid', totalAmount);
    } else if (paymentStatus === 'pending') {
      form.setValue('amountPaid', 0);
    }
  }, [form.watch('paymentStatus'), totalAmount, form]);
  
  // Validation and helper functions
  const validatePartialPayment = (value: number) => {
    const paymentStatus = form.watch('paymentStatus');
    if (paymentStatus === 'partial') {
      if (!value || value <= 0) return 'Amount must be greater than 0';
      if (value >= totalAmount) return 'For full payment, select "Paid" status';
    }
    return true;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate payment data
      if ((data.paymentStatus === 'paid' || data.paymentStatus === 'partial') && !data.paymentMethod) {
        toast({
          title: "Payment method required",
          description: "Please select a payment method",
          variant: "destructive",
        });
        return;
      }
      
      if (data.paymentStatus === 'partial' && (!data.amountPaid || data.amountPaid <= 0)) {
        toast({
          title: "Amount paid required",
          description: "Please enter amount paid",
          variant: "destructive",
        });
        return;
      }

      // Use our service to assign membership
      const result = await membershipService.assignMembership({
        memberId: data.memberId,
        membershipId: data.membershipId,
        startDate: data.startDate,
        endDate: data.endDate,
        amount: totalAmount,
        amountPaid: data.amountPaid || 0,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        branchId: data.branchId || currentBranch?.id || '',
        trainerId: data.trainerId,
        notes: data.notes
      });

      if (result.success) {
        toast({
          title: "Membership assigned successfully",
          description: `Membership has been assigned to the member`,
        });
        
        if (onSuccess) {
          onSuccess(result.data);
        } else if (result.invoiceId) {
          // Navigate to invoice page
          navigate(`/finance/invoices/${result.invoiceId}`);
        } else {
          // Reset form
          form.reset();
        }
      } else {
        toast({
          title: "Error assigning membership",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error assigning membership",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isLoadingMembers || isLoadingMemberships || isLoadingTrainers || !currentBranch;

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!memberId && (
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="membershipId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Plan</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a membership plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships?.map((membership) => (
                      <SelectItem key={membership.id} value={membership.id}>
                        {membership.name} - {membership.price} for {membership.duration_days} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="trainerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Trainer (Optional)</FormLabel>
                <Select 
                  disabled={isLoading} 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No trainer</SelectItem>
                    {trainers?.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name || trainer.fullName || "Unnamed Trainer"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < form.watch('startDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paid" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Paid (Full payment: {selectedMembership ? selectedMembership.price : 0})
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="partial" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Partial Payment
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Pending (No payment now)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(form.watch('paymentStatus') === 'paid' || form.watch('paymentStatus') === 'partial') && (
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {form.watch('paymentStatus') === 'partial' && (
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount paid"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add any additional notes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Membership'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MembershipAssignmentForm;
