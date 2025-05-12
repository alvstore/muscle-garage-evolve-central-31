
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
  attachment?: string;
  
  // Financial transaction aliases used in components
  category?: string;
  category_name?: string;
  reference?: string;
  source?: string;
  
  // Adding camelCase aliases
  transactionDate?: string;
  paymentMethod?: string;
  recordedBy?: string;
  branchId?: string;
  categoryId?: string;
  referenceId?: string;
  recurringPeriod?: string | null;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  member_id?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | Date;
  issued_date: string | Date;
  paid_date?: string | Date;
  payment_method?: string;
  razorpay_payment_id?: string;
  branch_id?: string;
  items: InvoiceItem[];
  description?: string;
  notes?: string;
  razorpay_order_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Tax-related fields
  subtotal?: number;
  tax_amount?: number;
  tax_rate?: number;
  tax_type?: TaxType;
  tax_details?: TaxDetail[];
  is_tax_inclusive?: boolean;
  hsn_sac_code?: string;
  gst_treatment?: GSTTreatment;
  gst_number?: string;
  place_of_supply?: string;
  
  // Adding camelCase aliases for UI component compatibility
  memberId?: string;
  memberName?: string;
  dueDate?: string | Date;
  issuedDate?: string | Date;
  paidDate?: string | Date;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  branchId?: string;
  membershipPlanId?: string;
  createdAt?: string;
  updatedAt?: string;
  taxAmount?: number;
  taxRate?: number;
  taxType?: TaxType;
  taxDetails?: TaxDetail[];
  isTaxInclusive?: boolean;
  hsnSacCode?: string;
  gstTreatment?: GSTTreatment;
  gstNumber?: string;
  placeOfSupply?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  
  // Add unitPrice as an alias for price for backward compatibility
  unitPrice?: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'online' | 'razorpay' | 'other';

export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
