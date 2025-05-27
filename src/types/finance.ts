
export interface Invoice {
  id: string;
  invoice_number: string;
  member_id: string;
  member_name?: string;
  amount: number;
  tax_amount?: number;
  total_amount: number;
  status: InvoiceStatus;
  due_date: string;
  issued_date: string;
  items: InvoiceItem[];
  notes?: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  member_id?: string;
  invoice_id?: string;
  branch_id: string;
  created_at: string;
  is_recurring?: boolean;
  recurring_period?: RecurringPeriod;
}

export type TransactionType = 'income' | 'expense' | 'refund' | 'fee';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'cheque';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PaymentIntegration {
  id: string;
  provider: 'stripe' | 'razorpay' | 'paypal';
  is_active: boolean;
  api_key: string;
  webhook_url?: string;
  branch_id: string;
}
