
export interface RazorpayWebhook {
  id: string;
  entity: string;
  event: RazorpayEventType;
  created_at: number;
  payload: {
    payment?: {
      entity: RazorpayPayment;
    };
    subscription?: {
      entity: RazorpaySubscription;
    };
  };
  status?: 'success' | 'failed' | 'pending';
  error?: string;
  eventType?: RazorpayEventType;
  createdAt?: number;
}

export type RazorpayEventType = 
  | 'payment.captured'
  | 'payment.failed'
  | 'payment.authorized'
  | 'subscription.charged'
  | 'subscription.completed'
  | 'subscription.cancelled'
  | 'subscription.activated'
  | 'subscription.updated';

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  created_at: number;
  email?: string;
  contact?: string;
}

export interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  customer_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
  created_at: number;
}

export interface WebhookLog {
  id: string;
  event_type: RazorpayEventType;
  payload: any;
  status: 'success' | 'failed' | 'pending';
  processed_at?: string;
  error_message?: string;
  created_at: string;
}
