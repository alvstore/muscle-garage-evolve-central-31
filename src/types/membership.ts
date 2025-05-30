export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';

export interface PaymentDetails {
  amount: number;
  method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  paid_at?: string;
  notes?: string;
}

export interface MembershipAssignmentResult {
  success: boolean;
  membership_id?: string;
  invoice_id?: string;
  transaction_id?: string;
  message?: string;
  error?: string;
}
