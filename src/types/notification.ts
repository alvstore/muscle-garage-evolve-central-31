
export interface ReminderRule {
  id: string;
  name: string;
  title: string;
  description?: string;
  triggerType: string;
  triggerValue: number;
  message?: string;
  notificationChannel?: string;
  conditions?: Record<string, any>;
  isActive?: boolean;
  active?: boolean;
  targetRoles: string[];
  sendVia: string[];
  channels: string[];
  targetType: string;
}

export interface IntegrationStatus {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  status: 'configured' | 'partially-configured' | 'not-configured';
  icon: string;
  config?: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceSettings {
  id?: string;
  hikvision_enabled: boolean;
  qr_enabled: boolean;
  device_config: Record<string, any>;
  branch_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id?: string;
  gym_name: string;
  contact_email: string;
  contact_phone: string;
  business_hours_start: string;
  business_hours_end: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  created_at?: string;
  updated_at?: string;
}
