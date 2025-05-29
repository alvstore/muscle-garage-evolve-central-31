export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';

export interface PaymentDetails {
  amount: number;
  method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  paid_at?: string;
  notes?: string;
}
