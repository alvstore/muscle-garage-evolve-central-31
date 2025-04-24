
export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'online' | 'card' | 'other';

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null;

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft' | 'partially_paid';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method?: PaymentMethod;
  recorded_by?: string;
  branch_id?: string;
  category_id?: string;
  reference_id: string | null;
  recurring: boolean;
  recurring_period: RecurringPeriod;
  transaction_id: string | null;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issued_date: string;
  paid_date?: string;
  payment_method?: string;
  items: InvoiceItem[];
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  notes?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
