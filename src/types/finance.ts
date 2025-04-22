
export type InvoiceStatus = 'pending' | 'paid' | 'partial' | 'cancelled' | 'overdue';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate: string | null;
  items: InvoiceItem[];
  branchId?: string;
  membershipPlanId?: string;
  description?: string;
  paymentMethod?: string;
  notes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'razorpay' | 'other';

export type TransactionType = 'income' | 'expense';
export type ExpenseCategory = 'rent' | 'salary' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'other';
export type IncomeCategory = 'membership' | 'personal-training' | 'product-sales' | 'class-fees' | 'other';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'none';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  description: string;
  recurring?: boolean;
  recurringPeriod?: RecurringPeriod;
  paymentMethod?: PaymentMethod;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}
