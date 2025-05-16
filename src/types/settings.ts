
export interface SmsSettings {
  id: string;
  provider: string;
  api_key?: string;
  api_secret?: string;
  sender_id?: string;
  is_active: boolean;
  branch_id?: string;
  templates?: {
    membershipAlert?: boolean;
    renewalReminder?: boolean;
    otpVerification?: boolean;
    attendanceConfirmation?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface EmailSettings {
  id: string;
  provider: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  from_email: string;
  from_name?: string;
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WhatsAppSettings {
  id: string;
  provider: string;
  api_key?: string;
  phone_number_id?: string;
  business_account_id?: string;
  is_active: boolean;
  branch_id?: string;
  templates?: {
    welcomeMessage?: boolean;
    paymentReminder?: boolean;
    classNotification?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceSettings {
  id: string;
  number_prefix?: string;
  number_suffix?: string;
  next_number?: number;
  terms_and_conditions?: string;
  note_to_customer?: string;
  logo_url?: string;
  default_due_days?: number;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaxProfile {
  id: string;
  name: string;
  tax_rate: number;
  tax_type: 'percentage' | 'fixed';
  description?: string;
  hsn_code?: string;
  is_default?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app';
  subject?: string;
  content: string;
  variables?: string[];
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions: any;
  actions: any[];
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description?: string;
  reward_type: 'percentage' | 'fixed' | 'membership_days';
  reward_value: number;
  expires_in_days?: number;
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  uses_count?: number;
  expires_at?: string;
  is_active: boolean;
  referral_program_id?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}
