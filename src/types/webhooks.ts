
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

export interface WebhookOrderData {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface WebhookSubscriptionData {
  id: string;
  entity: string;
  plan_id: string;
  customer_id: string;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  start_at: number;
  end_at: number | null;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  created_at: number;
}

export interface WebhookRefundData {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  notes: Record<string, string>;
  receipt: string;
  acquirer_data: {
    arn: string;
  };
  created_at: number;
  batch_id: string | null;
  status: string;
  speed_processed: string;
  speed_requested: string;
}
