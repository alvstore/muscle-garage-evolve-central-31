
export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IncomeRecord {
  id: string;
  date: string;
  amount: number;
  description?: string;
  source?: string;
  category?: string;
  reference?: string;
  payment_method?: string;
  branch_id: string;
  recorded_by?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  description?: string;
  vendor?: string;
  category?: string;
  reference?: string;
  payment_method?: string;
  branch_id: string;
  recorded_by?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  transaction_date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference?: string;
  notes?: string;
  payment_method?: PaymentMethod;
  branch_id: string;
  member_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type TransactionType = 'income' | 'expense' | 'refund' | 'adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online' | 'check' | 'other';
