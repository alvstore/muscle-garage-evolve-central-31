export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'upi'
  | 'bank_transfer'
  | 'cheque'
  | 'online'
  | 'other';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'partial'
  | 'failed'
  | 'refunded';

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  reference_number?: string;
  amount?: number;
  amount_paid?: number;
  payment_date?: string;
  notes?: string;
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' }
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'partial', label: 'Partial Payment' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
] as const;
