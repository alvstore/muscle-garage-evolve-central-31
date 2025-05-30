
// Finance and billing types
export interface Invoice {
  id: string;
  invoice_number?: string;
  member_id?: string;
  member_name?: string;
  memberName?: string;
  memberId?: string;
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  status: InvoiceStatus;
  due_date: string;
  dueDate?: string;
  issued_date?: string;
  issuedDate?: string;
  payment_date?: string;
  paid_date?: string;
  items: InvoiceItem[];
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  payment_method?: string;
  membership_plan_id?: string;
  membershipPlanId?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_by?: string;
}

export interface InvoiceItem {
  id: string;
  description?: string;
  name?: string;
  quantity: number;
  unit_price?: number;
  price?: number;
  total: number;
  discount?: number;
  amount?: number;
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
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'cheque' | 'online' | 'upi' | 'netbanking' | 'wallet' | 'razorpay' | 'other';
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

export interface PaymentSettings {
  id: string;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  stripe_public_key?: string;
  stripe_secret_key?: string;
  paypal_client_id?: string;
  paypal_client_secret?: string;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  payment_method: string;
  reference: string;
  branch_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface IncomeRecord {
  id: string;
  source: string;
  description: string;
  category: string;
  amount: number;
  payment_method: string;
  reference: string;
  branch_id: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export type FinancialTransaction = Transaction;
