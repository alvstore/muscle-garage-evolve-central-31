
// Settings and configuration types
export interface CompanySettings {
  id: string;
  gym_name: string;
  contact_email?: string;
  contact_phone?: string;
  business_hours_start?: string;
  business_hours_end?: string;
  currency: string;
  currency_symbol: string;
  tax_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface GlobalSettings {
  id: string;
  currency: string;
  currency_symbol: string;
  date_format?: string;
  time_format?: string;
  email_provider?: string;
  email_api_key?: string;
  sms_provider?: string;
  sms_api_key?: string;
  whatsapp_provider?: string;
  whatsapp_api_key?: string;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationStatus {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  status: 'not-configured' | 'configured' | 'active' | 'error';
  icon?: string;
  config?: Record<string, any>;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface HikvisionApiSettings {
  id: string;
  branch_id: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  site_id?: string;
  site_name?: string;
  devices: any[];
  is_active: boolean;
  last_sync?: string;
  sync_interval?: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
