
export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'online' | 'card' | 'other';

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null;

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft' | 'partially_paid';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method?: PaymentMethod;
  recorded_by?: string;
  branch_id?: string;
  category_id?: string;
  reference_id: string | null;
  recurring: boolean;
  recurring_period: RecurringPeriod;
  transaction_id: string | null;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issued_date: string;
  paid_date?: string;
  payment_method?: string;
  items: InvoiceItem[];
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  notes?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  branch_id?: string;
}

// Adapter functions to help with mapping between API and UI formats
export function adaptInvoiceFromDB(dbInvoice: any): Invoice {
  return {
    id: dbInvoice.id,
    member_id: dbInvoice.member_id,
    memberName: dbInvoice.memberName || '',
    amount: dbInvoice.amount,
    status: dbInvoice.status as InvoiceStatus,
    due_date: dbInvoice.due_date,
    issued_date: dbInvoice.issued_date,
    paid_date: dbInvoice.paid_date,
    payment_method: dbInvoice.payment_method,
    items: dbInvoice.items || [],
    razorpay_order_id: dbInvoice.razorpay_order_id,
    razorpay_payment_id: dbInvoice.razorpay_payment_id,
    notes: dbInvoice.notes,
    description: dbInvoice.description,
    created_at: dbInvoice.created_at,
    updated_at: dbInvoice.updated_at,
    branch_id: dbInvoice.branch_id
  };
}

export function adaptInvoiceToDB(invoice: Partial<Invoice>): any {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    amount: invoice.amount,
    status: invoice.status,
    due_date: invoice.due_date,
    issued_date: invoice.issued_date,
    paid_date: invoice.paid_date,
    payment_method: invoice.payment_method,
    items: invoice.items,
    razorpay_order_id: invoice.razorpay_order_id,
    razorpay_payment_id: invoice.razorpay_payment_id,
    notes: invoice.notes,
    description: invoice.description,
    branch_id: invoice.branch_id
  };
}
