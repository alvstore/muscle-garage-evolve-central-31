
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type TransactionType = 'income' | 'expense' | 'refund';

export interface Invoice {
  id: string;
  member_id: string;
  member_name?: string;
  amount: number;
  description?: string;
  status: InvoiceStatus;
  due_date: string;
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  issued_date?: string;
  branch_id?: string;
  items?: InvoiceItem[];
  membership_plan_id?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  price: number;
  discount?: number;
  amount?: number; // For backward compatibility
  total?: number; // Can be calculated as quantity * price
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date?: string; // Adding this property to fix MemberTransactionHistory
  transaction_date?: string;
  payment_method?: string;
  reference_id?: string;
  category?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Add any other finance-related types here
export interface InvoiceFormHeaderProps {
  isEditing: boolean;
}

export interface InvoiceMemberFieldsProps {
  memberId: string;
  memberName?: string;
  onSelectMember?: (id: string, name: string) => void;
  onMemberChange?: (field: string, value: any) => void;
}

export interface InvoiceDetailsFieldsProps {
  description?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: InvoiceStatus) => void;
  onPaymentMethodChange: (value: string) => void;
}

export interface RevenueData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  revenueGrowth: number;
  pendingInvoices: number;
  pendingAmount: number;
}
