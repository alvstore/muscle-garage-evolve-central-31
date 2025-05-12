
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'inactive' | 'converted';
export type LeadSource = 'website' | 'referral' | 'cold_call' | 'walk_in' | 'social_media' | 'event' | 'advertisement' | 'other';
export type FunnelStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'cold' | 'warm' | 'hot';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  funnel_stage: FunnelStage;
  tags?: string[];
  assigned_to?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  last_contact_date?: string;
  follow_up_date?: string;
  interests?: string[];
  conversion_value?: number;
  conversion_date?: string;
}

export type FollowUpType = 'email' | 'sms' | 'call' | 'meeting' | 'whatsapp';
export type FollowUpStatus = 'pending' | 'sent' | 'failed' | 'responded';

export interface FollowUp {
  id: string;
  lead_id: string;
  template_id?: string;
  sent_by?: string;
  type: FollowUpType;
  content: string;
  sent_at?: string;
  response?: string;
  response_at?: string;
  status: FollowUpStatus;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  template_id?: string;
  type: FollowUpType;
  content: string;
  sent_by: string;
  sent_at: string;
  status: string;
  response?: string;
  response_at?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  lead_name?: string;
  lead?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  type: FollowUpType;
  scheduled_for: string;
  scheduled_at?: string;
  subject: string;
  content: string;
  status: string;
  sent_by?: string;
}

export interface ScheduledFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  type: FollowUpType;
  scheduledFor: string;
  subject: string;
  content: string;
  status: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  title?: string;
  content: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  type?: FollowUpType;
  variables?: string[];
  isDefault?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  tags?: string[];
  last_contact?: string;
  source?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contact: string;
  contact_id?: string;
  closing_date?: string;
  created_at: string;
  updated_at?: string;
  branch_id?: string;
  owner_id?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: Record<string, any>[];
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
