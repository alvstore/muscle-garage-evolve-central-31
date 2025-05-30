import { NotificationChannel } from './notification';

export interface ReminderRule {
  id: string;
  title: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  conditions: Record<string, any>;
  message?: string;
  target_roles: string[];
  send_via: NotificationChannel[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const adaptReminderRuleFromDB = (data: any): ReminderRule => ({
  id: data.id || '',
  title: data.title || '',
  description: data.description || '',
  trigger_type: data.trigger_type || '',
  trigger_value: data.trigger_value,
  conditions: data.conditions || {},
  message: data.message || '',
  target_roles: data.target_roles || [],
  send_via: data.send_via || [],
  is_active: data.is_active ?? true,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});
