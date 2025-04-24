
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
  price: number;
  unitPrice?: number; // Adding this for compatibility with existing code
  tax?: number;
  total?: number;
}

export interface Invoice {
  id: string;
  member_id?: string;
  memberId?: string; // Camel case version for frontend compatibility
  amount: number;
  status: InvoiceStatus;
  issued_date: string;
  issuedDate?: string; // Camel case version for frontend compatibility
  due_date: string;
  dueDate?: string; // Camel case version for frontend compatibility
  paid_date?: string;
  paidDate?: string; // Camel case version for frontend compatibility
  payment_method?: PaymentMethod | string;
  paymentMethod?: PaymentMethod | string; // Camel case version
  notes?: string;
  items: InvoiceItem[];
  description?: string;
  branch_id?: string;
  branchId?: string; // Camel case version for frontend compatibility
  created_at: string;
  updated_at: string;
  created_by?: string;
  membership_plan_id?: string;
  razorpay_order_id?: string;
  razorpayOrderId?: string; // Camel case version for frontend compatibility
  razorpay_payment_id?: string;
  razorpayPaymentId?: string; // Camel case version for frontend compatibility
  memberName?: string; // Additional property used in the frontend
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
  // Frontend compatibility properties
  date?: string;
  category?: string;
  recurring?: boolean;
  recurringPeriod?: RecurringPeriod;
  paymentMethod?: PaymentMethod;
}

// Define the shapes for import/export functions in the backup service
export interface ValidationResult {
  valid: boolean;
  errors: { row: number; errors: string[] }[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  message?: string;
}
