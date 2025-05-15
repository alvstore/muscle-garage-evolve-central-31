
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

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending' | 'partially_paid';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  discount?: number;
  price?: number; // Adding price alias for unitPrice
}

export interface Invoice {
  id: string;
  member_id: string;
  memberId?: string; // For backward compatibility 
  memberName?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  due_date?: string; // For backward compatibility
  issuedDate: string;
  issued_date?: string; // For backward compatibility
  paidDate?: string;
  paid_date?: string; // For backward compatibility
  items: InvoiceItem[];
  branchId?: string;
  branch_id?: string; // For backward compatibility
  notes?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
  description?: string;
  payment_method?: string;
  membershipPlanId?: string;
  membership_plan_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'razorpay' | 'other';

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
  contactInfo?: string; // Adding this to fix StaffActivityData errors
  date?: string; // For backward compatibility
  dueDate?: string; // For backward compatibility
  memberAvatar?: string; // Used in some components
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

export interface TransactionType {
  id: string;
  name: string;
  isExpense: boolean;
}

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
