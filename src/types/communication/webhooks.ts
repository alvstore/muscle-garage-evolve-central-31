
export type WebhookStatus = 'success' | 'error' | 'pending' | 'processing' | 'retrying';
export type RazorpayEventType =
  // Payment Events
  | 'payment.authorized'
  | 'payment.captured'
  | 'payment.failed'
  | 'payment.pending'
  | 'payment.refunded'
  
  // Order Events
  | 'order.paid'
  | 'order.created'
  | 'order.attempted'
  
  // Subscription Events
  | 'subscription.activated'
  | 'subscription.charged'
  | 'subscription.cancelled'
  | 'subscription.halted'
  | 'subscription.paused'
  | 'subscription.resumed'
  
  // Refund Events
  | 'refund.created'
  | 'refund.processed'
  | 'refund.failed'
  
  // Invoice Events
  | 'invoice.paid'
  | 'invoice.partially_paid'
  | 'invoice.expired'
  | 'invoice.generated'
  
  // Payment Link Events
  | 'payment_link.paid'
  | 'payment_link.partially_paid'
  | 'payment_link.expired'
  | 'payment_link.cancelled';

export interface RazorpayWebhook {
  id: string;
  eventType: RazorpayEventType;
  payload: any;
  status: WebhookStatus;
  processedAt: string | null;
  error?: string;
  createdAt: string;
  signature?: string;
  retryCount?: number;
  maxRetries?: number;
  lastRetryAt?: string;
  idempotencyKey?: string;
  processingTime?: number;
  metadata?: Record<string, any>;
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
  acquirer_data?: {
    auth_code?: string;
    rrn?: string;
  };
  upi?: {
    vpa: string;
  };
  card?: {
    id: string;
    name?: string;
    last4: string;
    network: string;
    type: string;
    issuer?: string;
    international: boolean;
    emi: boolean;
    sub_type?: string;
    token_iin?: string;
  };
  bank_transfer?: {
    account_number: string;
    ifsc: string;
    bank_name: string;
  };
}

export interface RazorpayOrderData {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpaySubscriptionData {
  id: string;
  entity: string;
  plan_id: string;
  customer_id: string;
  status: 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired';
  current_start: number;
  current_end: number;
  ended_at?: number;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  start_at: number;
  end_at?: number;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  created_at: number;
  expire_by?: number;
  short_url?: string;
  has_scheduled_changes: boolean;
  change_scheduled_at?: number;
  source?: string;
  payment_method?: string;
  offer_id?: string;
  remaining_count: number;
}

export interface RazorpayRefundData {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  notes: Record<string, string>;
  receipt?: string;
  acquirer_data?: {
    arn?: string;
  };
  created_at: number;
  batch_id?: string;
  status: 'processed' | 'pending' | 'failed';
  speed_processed: 'normal' | 'optimum';
  speed_requested: 'normal' | 'optimum';
}

export interface RazorpayInvoiceData {
  id: string;
  entity: string;
  receipt?: string;
  invoice_number: string;
  customer_id: string;
  customer_details: {
    id: string;
    name: string;
    email: string;
    contact: string;
    gstin?: string;
    billing_address?: string;
    shipping_address?: string;
  };
  order_id?: string;
  line_items: Array<{
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    quantity: number;
  }>;
  payment_id?: string;
  status: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'cancelled' | 'expired';
  expire_by?: number;
  issued_at?: number;
  paid_at?: number;
  cancelled_at?: number;
  expired_at?: number;
  sms_status?: 'pending' | 'sent' | 'failed';
  email_status?: 'pending' | 'sent' | 'failed';
  date: number;
  terms?: string;
  partial_payment: boolean;
  gross_amount: number;
  tax_amount: number;
  taxable_amount: number;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  description?: string;
  notes: Record<string, string>;
  comment?: string;
  short_url: string;
  view_less: boolean;
  billing_start?: number;
  billing_end?: number;
  type: 'invoice' | 'receipt';
  group_taxes_discounts: boolean;
  created_at: number;
  supply_state_code?: string;
}

export interface RazorpayPaymentLinkData {
  id: string;
  entity: string;
  accept_partial: boolean;
  amount: number;
  amount_paid: number;
  cancelled_at?: number;
  created_at: number;
  currency: string;
  customer: {
    contact: string;
    email: string;
    name: string;
  };
  description: string;
  expire_by?: number;
  expired_at?: number;
  first_min_partial_amount: number;
  notes: Record<string, string>;
  notify: {
    email: boolean;
    sms: boolean;
  };
  payments?: any[];
  reference_id: string;
  reminder_enable: boolean;
  reminders: Array<{
    status: string;
    scheduled_at: number;
  }>;
  short_url: string;
  status: 'created' | 'paid' | 'cancelled' | 'expired';
  updated_at: number;
  upi_link: boolean;
  user_id: string;
}
