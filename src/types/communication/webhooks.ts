
export type WebhookStatus = 'success' | 'error' | 'pending';
export type RazorpayEventType = 
  | 'payment.captured' 
  | 'payment.failed' 
  | 'order.paid' 
  | 'subscription.activated' 
  | 'subscription.charged' 
  | 'subscription.cancelled' 
  | 'refund.processed';

export interface RazorpayWebhook {
  id: string;
  eventType: RazorpayEventType;
  payload: any;
  status: WebhookStatus;
  processedAt: string | null;
  error?: string;
  createdAt: string;
}

export interface WebhookPaymentData {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id?: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee: number;
  tax: number;
  error_code?: string;
  error_description?: string;
  created_at: number;
}
