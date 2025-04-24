
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { 
  FinancialTransaction, 
  TransactionType,
  PaymentMethod,
  RecurringPeriod
} from '@/types/finance';
import { useCategories } from '@/hooks/use-categories';
import { useTransactions } from '@/hooks/use-transactions';

const formSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: "Transaction type is required",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  transaction_date: z.date({
    required_error: "Date is required",
  }),
  payment_method: z.string().min(1, {
    message: "Payment method is required",
  }),
  category_id: z.string().min(1, {
    message: "Category is required",
  }),
  recurring: z.boolean().default(false),
  recurring_period: z.enum(['none', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']).nullable(),
  reference_id: z.string().optional(),
  transaction_id: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: Partial<FinancialTransaction>;
  isEdit?: boolean;
}

const TransactionForm = ({ onSuccess, initialData, isEdit = false }: TransactionFormProps) => {
  const { toast } = useToast();
  const { addTransaction, updateTransaction } = useTransactions();
  const { incomeCategories, expenseCategories } = useCategories();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (initialData?.type as TransactionType) || 'income',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      transaction_date: initialData?.transaction_date ? new Date(initialData.transaction_date) : new Date(),
      payment_method: (initialData?.payment_method as string) || 'cash',
      category_id: initialData?.category_id || '',
      recurring: initialData?.recurring || false,
      recurring_period: initialData?.recurring_period || null,
      reference_id: initialData?.reference_id || undefined,
      transaction_id: initialData?.transaction_id || undefined,
    }
  });

  const watchType = form.watch('type');
  const watchRecurring = form.watch('recurring');
  
  useEffect(() => {
    // Set the appropriate categories based on the transaction type
    if (watchType === 'income') {
      setCategories(incomeCategories);
    } else {
      setCategories(expenseCategories);
    }
    
    // Reset category when type changes
    form.setValue('category_id', '');
    
    // Set the amount sign based on the transaction type
    if (initialData?.amount) {
      const absAmount = Math.abs(initialData.amount);
      form.setValue('amount', watchType === 'expense' ? absAmount : absAmount);
    }
  }, [watchType, incomeCategories, expenseCategories, form, initialData?.amount]);
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Adjust amount sign based on transaction type
      const amount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);
      
      // Create transaction object
      const transaction: Partial<FinancialTransaction> = {
        id: initialData?.id,
        type: data.type,
        amount,
        description: data.description,
        transaction_date: data.transaction_date.toISOString(),
        payment_method: data.payment_method as PaymentMethod,
        category_id: data.category_id,
        recurring: data.recurring,
        recurring_period: data.recurring ? data.recurring_period : null,
        reference_id: data.reference_id || null,
        transaction_id: data.transaction_id || null
      };
      
      if (isEdit && initialData?.id) {
        await updateTransaction(initialData.id, transaction);
        toast({
          title: "Transaction updated",
          description: "Transaction has been updated successfully",
        });
      } else {
        await addTransaction(transaction);
        toast({
          title: "Transaction added",
          description: "Transaction has been added successfully",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (!isEdit) {
        form.reset();
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</CardTitle>
        <CardDescription>
          {isEdit 
            ? "Update the details of this financial transaction" 
            : "Record a new financial transaction for your business"
          }
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isEdit} // Don't allow changing the type in edit mode
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        type="number"
                        min={0} 
                        step="0.01" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount in your default currency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                          onSelect={(date) => field.onChange(date || new Date())}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="payment_method"
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
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="" disabled>No categories available</SelectItem>
                        ) : (
                          categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter transaction description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        id="recurring"
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel htmlFor="recurring" className="cursor-pointer">
                      Is this a recurring transaction?
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              {watchRecurring && (
                <FormField
                  control={form.control}
                  name="recurring_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Period</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value as RecurringPeriod)} 
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select how often" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="transaction_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="External transaction reference" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Reference number from payment processor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference ID (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Internal reference number" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Invoice or receipt number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (onSuccess) onSuccess();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : (
                isEdit ? "Update Transaction" : "Save Transaction"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TransactionForm;
