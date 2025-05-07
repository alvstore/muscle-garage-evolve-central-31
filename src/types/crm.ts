
// CRM types

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted' | string;
export type LeadSource = 'website' | 'referral' | 'walk-in' | 'phone' | 'social-media' | 'event' | 'other' | string;
export type FunnelStage = 'cold' | 'warm' | 'hot' | 'new' | string;
export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  funnel_stage: FunnelStage;
  funnelStage?: FunnelStage; // Alias for UI components
  assigned_to?: string;
  assignedTo?: string; // Alias for UI components
  notes?: string;
  created_at?: string;
  updated_at?: string;
  follow_up_date?: string;
  followUpDate?: string; // Alias for UI components
  last_contact_date?: string;
  lastContactDate?: string; // Alias for UI components
  conversion_date?: string;
  conversionDate?: string; // Alias for UI components
  conversion_value?: number;
  conversionValue?: number; // Alias for UI components
  tags?: string[];
  interests?: string[];
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  title?: string;
  type: FollowUpType;
  content: string;
  variables?: string[];
  created_by?: string;
  created_at?: string;
  createdBy?: string;
  createdAt?: string;
  isDefault?: boolean;
  updated_at?: string;
  updatedAt?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  leadId?: string; // Alias
  lead_name?: string;
  leadName?: string; // Alias
  type: FollowUpType;
  scheduled_for: string;
  scheduledFor?: string; // Alias
  subject: string;
  content: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
}

export interface ScheduledFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  type: FollowUpType;
  scheduledFor: string;
  subject: string;
  content: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  leadId?: string; // Alias
  template_id?: string;
  templateId?: string; // Alias
  type: FollowUpType;
  content: string;
  sent_by: string;
  sentBy?: string; // Alias
  sent_at: string;
  sentAt?: string; // Alias
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  response?: string;
  response_at?: string;
  responseAt?: string; // Alias
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assigned_to?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  status: 'new' | 'negotiation' | 'won' | 'lost';
  lead_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  close_date?: string;
}

export interface AutomationTrigger {
  type: string;
  conditions: any;
}

export interface AutomationAction {
  type: string;
  params: any;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: any;
  actions: any[];
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}
