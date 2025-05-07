
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
}

export interface Invoice {
  id: string;
  member_id?: string;
  memberName?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  issued_date: string;
  paid_date?: string;
  payment_method?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  branch_id?: string;
  items: InvoiceItem[];
  description?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}
