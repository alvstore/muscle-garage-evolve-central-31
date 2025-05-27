
export interface WebhookLog {
  id: string;
  event_type: string;
  payload: any;
  status: 'success' | 'failed' | 'pending';
  response_code?: number;
  response_body?: string;
  error_message?: string;
  processed_at?: string;
  created_at: string;
  source: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret_key?: string;
  branch_id: string;
}
