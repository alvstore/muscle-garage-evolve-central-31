
// Defining necessary types for finance-related components
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft' | 'partially_paid' | 'void';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  tax_rate?: number;
  tax_amount?: number;
  discount?: number;
  total: number;
}

export interface Invoice {
  id: string;
  member_id?: string;
  memberName?: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  due_date: string;
  issued_date?: string;
  paid_date?: string;
  payment_method?: PaymentMethod;
  notes?: string;
  items: InvoiceItem[];
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online' | 'check' | 'other';

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  payment_method?: PaymentMethod;
  transaction_date: string;
  category_id?: string;
  branch_id?: string;
  recorded_by?: string;
  reference_id?: string;
  transaction_id?: string;
}

export type TransactionType = 'income' | 'expense' | 'refund';

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface FinancialTransaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  payment_method: string;
  status: string;
  reference_id?: string;
  created_by?: string;
  notes?: string;
}
