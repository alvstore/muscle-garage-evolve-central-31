
// Basic finance types
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  category_id?: string;
  branch_id?: string;
  recorded_by?: string;
  reference_id?: string;
  payment_method?: string;
  transaction_id?: string;
  transaction_date?: string;
  // For backward compatibility
  created_at?: string;
  updated_at?: string;
  date?: string; // Alias for transaction_date
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
  date?: string;
  transaction_date?: string;
  amount: number;
  type: TransactionType;
  description: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  reference_id?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  branch_id?: string;
  category?: string;
  attachment?: string;
}
