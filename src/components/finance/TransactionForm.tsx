
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
  ExpenseCategory, 
  IncomeCategory,
  RecurringPeriod,
  PaymentMethod
} from "@/types/finance";

interface TransactionFormProps {
  transaction: FinancialTransaction | null;
  onSave: (transaction: FinancialTransaction) => void;
  onCancel: () => void;
}

const expenseCategories: ExpenseCategory[] = [
  "rent", "salary", "utilities", "equipment", "maintenance", "marketing", "other"
];

const incomeCategories: IncomeCategory[] = [
  "membership", "personal-training", "product-sales", "class-fees", "other"
];

const recurringPeriods: RecurringPeriod[] = [
  "daily", "weekly", "monthly", "quarterly", "yearly", "none"
];

const paymentMethods: PaymentMethod[] = [
  "cash", "card", "bank-transfer", "razorpay", "other"
];

const TransactionForm = ({ transaction, onSave, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState<FinancialTransaction>({
    id: "",
    type: "expense",
    amount: 0,
    date: new Date().toISOString(),
    category: "rent",
    description: "",
    recurring: false,
    recurringPeriod: "none",
    createdBy: "user-1", // This would come from auth in a real app
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
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
    setFormData({ ...formData, [name]: value });
    
    // If type changes, reset the category
    if (name === "type") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: value === "income" ? "membership" : "rent"
      }));
    }
    
    // Set recurringPeriod to none when recurring is turned off
    if (name === "recurring" && value === "false") {
      setFormData(prev => ({
        ...prev,
        [name]: false,
        recurringPeriod: "none"
      }));
    } else if (name === "recurring" && value === "true") {
      setFormData(prev => ({
        ...prev,
        [name]: true,
        recurringPeriod: prev.recurringPeriod === "none" ? "monthly" : prev.recurringPeriod
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date: date.toISOString() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
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
                  onValueChange={(value) => handleSelectChange("type", value as TransactionType)}
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
                checked={formData.recurring}
                onCheckedChange={(checked) => handleSelectChange("recurring", checked.toString())}
              />
              <Label htmlFor="recurring">Recurring Transaction</Label>
            </div>
            
            {formData.recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringPeriod">Recurring Period</Label>
                <Select
                  value={formData.recurringPeriod}
                  onValueChange={(value) => handleSelectChange("recurringPeriod", value as RecurringPeriod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringPeriods.filter(period => period !== "none").map(period => (
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
                value={formData.paymentMethod || "cash"}
                onValueChange={(value) => handleSelectChange("paymentMethod", value as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
