
import { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  FinancialTransaction, 
  TransactionType,
  PaymentMethod,
  RecurringPeriod
} from "@/types/finance";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { useBranch } from "@/hooks/use-branch";
import { useAuth } from "@/hooks/use-auth";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  initialData?: FinancialTransaction;
}

const TransactionForm = ({ 
  isOpen, 
  onClose, 
  defaultType = 'income', 
  initialData 
}: TransactionFormProps) => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const { createTransaction } = useTransactions();
  const incomeCategories = useCategories('income');
  const expenseCategories = useCategories('expense');
  
  const [formData, setFormData] = useState<Omit<FinancialTransaction, 'id'>>({
    type: initialData?.type || defaultType,
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    transaction_date: initialData?.transaction_date || new Date().toISOString(),
    payment_method: initialData?.payment_method || 'cash',
    recorded_by: user?.id,
    branch_id: currentBranch?.id,
    category_id: initialData?.category_id || undefined,
    reference_id: initialData?.reference_id || null,
    recurring: initialData?.recurring || false,
    recurring_period: initialData?.recurring_period || null,
    transaction_id: initialData?.transaction_id || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createTransaction(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = formData.type === 'income' 
    ? incomeCategories.categories 
    : expenseCategories.categories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Transaction details"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Date</Label>
              <DatePicker
                date={formData.transaction_date ? new Date(formData.transaction_date) : undefined}
                onSelect={(date) => date && handleChange('transaction_date', date.toISOString())}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method || 'cash'}
                onValueChange={(value) => handleChange('payment_method', value)}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              value={formData.category_id || ''}
              onValueChange={(value) => handleChange('category_id', value)}
            >
              <SelectTrigger id="category_id">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Category</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => handleChange('recurring', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="recurring">Recurring Transaction</Label>
            </div>
            
            {formData.recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurring_period">Frequency</Label>
                <Select
                  value={formData.recurring_period || ''}
                  onValueChange={(value) => handleChange('recurring_period', value === 'none' ? null : value)}
                >
                  <SelectTrigger id="recurring_period">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
