// Basic finance types
// Transaction types for the finance module
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType | string;
  description?: string;
  category_id?: string;
  category?: string; // For compatibility with different tables
  branch_id?: string;
  recorded_by?: string;
  reference_id?: string;
  reference?: string; // For compatibility with income/expense records
  payment_method?: string;
  transaction_id?: string;
  transaction_date?: string;
  // For backward compatibility
  created_at?: string;
  updated_at?: string;
  date?: string; // Alias for transaction_date
  vendor?: string; // For expense records
  source?: string; // For income records
  status?: string;
  webhook_processed?: boolean;
}

export enum InvoiceStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  DRAFT = 'draft',
  CANCELED = 'canceled',
  PARTIALLY_PAID = 'partially_paid'
}

export interface Invoice {
  id: string;
  member_id?: string;
  member_name?: string;
  memberName?: string; // For backward compatibility
  memberId?: string; // For backward compatibility
  amount: number;
  description?: string;
  status: InvoiceStatus | string;
  due_date: string;
  dueDate?: string; // For backward compatibility
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  issued_date?: string;
  issuedDate?: string; // For backward compatibility
  branch_id?: string;
  items?: any[];
  membership_plan_id?: string;
  membershipPlanId?: string; // For backward compatibility
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  tax?: number;
  total?: number;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'cheque' | 'online' | 'wallet' | 'other' | 'razorpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionType = 'income' | 'expense' | 'refund';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method: string;
  category: string; // Changed from category_id to match database
  branch_id: string;
  reference_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  recurring?: boolean;
  recurring_period?: string | null;
  webhook_processed?: boolean;
  vendor?: string; // For expense records
  source?: string; // For income records
  reference?: string; // For compatibility with income/expense records
  date?: string; // Alias for transaction_date
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

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type TransactionType = 'income' | 'expense' | 'refund';

export interface Invoice {
  id: string;
  member_id: string;
  member_name?: string;
  amount: number;
  description?: string;
  status: InvoiceStatus;
  due_date: string;
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  issued_date?: string;
  branch_id?: string;
  items?: InvoiceItem[];
  membership_plan_id?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  price: number;
  discount?: number;
  amount?: number; // For backward compatibility
  total?: number; // Can be calculated as quantity * price
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date?: string; // Adding this property to fix MemberTransactionHistory
  transaction_date?: string;
  payment_method?: string;
  reference_id?: string;
  category?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Add any other finance-related types here
export interface InvoiceFormHeaderProps {
  isEditing: boolean;
}

export interface InvoiceMemberFieldsProps {
  memberId: string;
  memberName?: string;
  onSelectMember?: (id: string, name: string) => void;
  onMemberChange?: (field: string, value: any) => void;
}

export interface InvoiceDetailsFieldsProps {
  description?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: InvoiceStatus) => void;
  onPaymentMethodChange: (value: string) => void;
}

export interface RevenueData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  revenueGrowth: number;
  pendingInvoices: number;
  pendingAmount: number;
}
