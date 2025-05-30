
// Payment and invoice types
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'online' | 'upi' | 'bank_transfer';
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export interface Invoice {
  id: string;
  member_id?: string;
  membership_plan_id?: string;
  branch_id?: string;
  amount: number;
  status: InvoiceStatus;
  payment_method?: PaymentMethod;
  payment_date?: string;
  due_date: string;
  issued_date: string;
  description?: string;
  notes?: string;
  reference_number?: string;
  items: InvoiceItem[];
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: string;
  name?: string;
  description: string;
  quantity: number;
  price?: number;
  amount: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  category?: string;
  category_id?: string;
  description: string;
  reference_id?: string;
  payment_method: PaymentMethod;
  branch_id: string;
  recorded_by?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettings {
  id: string;
  branch_id?: string;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  stripe_public_key?: string;
  stripe_secret_key?: string;
  payment_methods: PaymentMethod[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
