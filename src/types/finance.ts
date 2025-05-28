
export interface Invoice {
  id: string;
  invoice_number?: string;
  member_id: string;
  member_name?: string;
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  status: InvoiceStatus;
  due_date: string;
  issued_date?: string;
  payment_date?: string;
  items: InvoiceItem[];
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  payment_method?: string;
  membership_plan_id?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price?: number;
  price?: number;
  total: number;
  name?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  reference_id?: string;
  member_id?: string;
  invoice_id?: string;
  branch_id: string;
  created_at: string;
  transaction_date?: string;
  date?: string;
  category?: string;
  category_id?: string;
  is_recurring?: boolean;
  recurring_period?: RecurringPeriod;
  recorded_by?: string;
  status?: string;
}

export type TransactionType = 'income' | 'expense' | 'refund' | 'fee';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'cheque';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PaymentIntegration {
  id: string;
  provider: 'stripe' | 'razorpay' | 'paypal';
  is_active: boolean;
  api_key: string;
  webhook_url?: string;
  branch_id: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  netIncome: number;
  revenueGrowth: number;
  pendingInvoices: Array<{
    id: string;
    memberName: string;
    amount: number;
    dueDate: string;
  }>;
  pendingAmount: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    amount: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    category: string;
  }>;
}

// For backward compatibility
export type FinancialTransaction = Transaction;
