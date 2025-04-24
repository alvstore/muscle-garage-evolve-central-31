
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { 
  FinancialTransaction, 
  TransactionType,
  PaymentMethod,
  RecurringPeriod
} from "@/types/finance";

interface TransactionFormProps {
  transaction: FinancialTransaction | null;
  onSave: (transaction: FinancialTransaction) => void;
  onCancel: () => void;
}

// Define these as string arrays since they'll be displayed as string options in the UI
const expenseCategories: string[] = [
  "rent", "salary", "utilities", "equipment", "maintenance", "marketing", "other"
];

const incomeCategories: string[] = [
  "membership", "personal-training", "product-sales", "class-fees", "other"
];

const recurringPeriods: RecurringPeriod[] = [
  "daily", "weekly", "monthly", "quarterly", "yearly"
];

const paymentMethods: PaymentMethod[] = [
  "cash", "card", "bank_transfer", "razorpay", "other"
];

const TransactionForm = ({ transaction, onSave, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState<FinancialTransaction>({
    id: "",
    type: "expense",
    amount: 0,
    transaction_date: new Date().toISOString(),
    category: "rent",
    description: "",
    is_recurring: false,
    recurring_period: "monthly",
    recorded_by: "user-1", // This would come from auth in a real app
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Additional frontend properties
    date: new Date().toISOString(),
    recurring: false,
    recurringPeriod: "monthly",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.transaction_date || transaction.date,
        recurring: transaction.is_recurring || transaction.recurring || false,
        recurringPeriod: transaction.recurring_period || transaction.recurringPeriod || "monthly",
        paymentMethod: transaction.payment_method || transaction.paymentMethod
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "type") {
      setFormData(prev => ({
        ...prev,
        [name]: value as TransactionType,
        category: value === "income" ? "membership" : "rent"
      }));
    } else if (name === "recurring") {
      const isRecurring = value === "true";
      setFormData(prev => ({
        ...prev,
        is_recurring: isRecurring,
        recurring: isRecurring,
        recurring_period: !isRecurring ? undefined : prev.recurring_period || "monthly",
        recurringPeriod: !isRecurring ? undefined : prev.recurringPeriod || "monthly"
      }));
    } else if (name === "recurringPeriod") {
      setFormData(prev => ({ 
        ...prev,
        [name]: value,
        recurring_period: value as RecurringPeriod
      }));
    } else if (name === "paymentMethod") {
      setFormData(prev => ({ 
        ...prev,
        [name]: value as PaymentMethod,
        payment_method: value as PaymentMethod
      }));
    } else if (name === "category") {
      setFormData(prev => ({
        ...prev,
        category: value
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = date.toISOString();
      setFormData({
        ...formData,
        date: dateString,
        transaction_date: dateString
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {transaction?.id ? 'Edit' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
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
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                date={formData.date ? new Date(formData.date) : undefined}
                onSelect={handleDateChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {formData.type === 'income' ? 
                    incomeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    )) : 
                    expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.recurring || formData.is_recurring}
                onCheckedChange={(checked) => handleSelectChange("recurring", checked.toString())}
              />
              <Label htmlFor="recurring">Recurring Transaction</Label>
            </div>
            
            {(formData.recurring || formData.is_recurring) && (
              <div className="space-y-2">
                <Label htmlFor="recurringPeriod">Recurring Period</Label>
                <Select
                  value={formData.recurringPeriod || formData.recurring_period}
                  onValueChange={(value) => handleSelectChange("recurringPeriod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringPeriods.map(period => (
                      <SelectItem key={period} value={period}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod || formData.payment_method || "cash"}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
