
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  payment_method?: string;
  reference_id?: string;
  recorded_by?: string;
  created_at?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  branchId?: string;
  notes?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
}

export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface Payment {
  id: string;
  member_id: string;
  member_name: string;
  membership_plan?: string;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  payment_date: string;
  notes?: string;
  transaction_id?: string;
  created_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
}
