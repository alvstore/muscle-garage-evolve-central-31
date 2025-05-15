
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft' | 'partially_paid' | 'sent' | 'void';
export type PaymentMethod = 'cash' | 'card' | 'online' | 'bank_transfer' | 'wallet' | 'other' | 'razorpay' | 'credit_card';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type TransactionType = 'income' | 'expense';
export type RecurringPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string; // Derived field for UI
  amount: number;
  description?: string;
  status: InvoiceStatus;
  due_date: string;
  dueDate?: string; // For backward compatibility
  issued_date?: string;
  issuedDate?: string; // For backward compatibility
  paid_date?: string;
  payment_method?: PaymentMethod;
  items: InvoiceItem[];
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  branch_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  // Add for backward compatibility
  memberId?: string;
  membership_plan_id?: string;
  membershipPlanId?: string;
}

export interface InvoiceItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  category_id?: string;
  transaction_date: string;
  payment_method?: PaymentMethod;
  reference_id?: string;
  branch_id?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
  // Adding for backward compatibility
  transaction_id?: string;
  recurring?: boolean; // Added for compatibility
}

export interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  date?: string; // For backward compatibility
  payment_method: PaymentMethod;
  status: PaymentStatus;
  member_id?: string;
  membership_id?: string;
  staff_id?: string;
  transaction_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  contactInfo?: string; // Adding this to fix the errors
  // Adding for backward compatibility
  member_name?: string;
  membership_plan?: string;
}

// Alias for Transaction to fix MemberTransactionHistory import issue
export type FinancialTransaction = Transaction;
