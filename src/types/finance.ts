
import { Json } from '@/integrations/supabase/types';

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partial';
export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'cheque' | 'razorpay' | 'other';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number; // Original property from the interface
  unitPrice?: number; // Adding this for compatibility with existing code
  tax?: number;
  total?: number;
}

export interface Invoice {
  id: string;
  member_id?: string;
  amount: number;
  status: InvoiceStatus;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  items: InvoiceItem[];
  description?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  membership_plan_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  // Additional properties for compatibility with existing code
  memberId?: string; 
  dueDate?: string;
  issuedDate?: string;
  memberName?: string;
  branchId?: string;
}

export interface IFinanceService {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice | null>;
  updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | null>;
  deleteInvoice(id: string): Promise<boolean>;
  getInvoicesByMember(memberId: string): Promise<Invoice[]>;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  payment_method?: PaymentMethod;
  category_id?: string;
  description?: string;
  reference_id?: string;
  branch_id?: string;
  transaction_id?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
  is_recurring?: boolean;
  recurring_period?: RecurringPeriod;
  recurring_end_date?: string;
}
