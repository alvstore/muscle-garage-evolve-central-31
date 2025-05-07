
export type TransactionType = 'income' | 'expense';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  transaction_date: string;
  payment_method?: string;
  recorded_by?: string;
  branch_id?: string;
  category_id?: string;
  reference_id?: string;
  recurring?: boolean;
  recurring_period?: string | null;
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
  attachment?: string;
  
  // Adding camelCase aliases
  transactionDate?: string;
  paymentMethod?: string;
  recordedBy?: string;
  branchId?: string;
  categoryId?: string;
  referenceId?: string;
  recurringPeriod?: string | null;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  member_id?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | Date;
  issued_date: string | Date;
  paid_date?: string | Date;
  payment_method?: string;
  razorpay_payment_id?: string;
  branch_id?: string;
  items: InvoiceItem[];
  description?: string;
  notes?: string;
  
  // Adding camelCase aliases for UI component compatibility
  memberId?: string;
  memberName?: string; // Added for compatibility with components
  dueDate?: string | Date;
  issuedDate?: string | Date;
  paidDate?: string | Date;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  branchId?: string;
  membershipPlanId?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  
  // Add unitPrice as an alias for price for backward compatibility
  unitPrice?: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'online' | 'razorpay' | 'other';

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
