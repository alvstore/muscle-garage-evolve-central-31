
// CRM related types

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: string;
  notes?: string;
  interests?: string[];
  tags?: string[];
  assigned_to?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  last_contact_date?: string;
  follow_up_date?: string;
  conversion_value?: number;
  conversion_date?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_at?: string;
  created_by?: string;
  title?: string; // Added for backward compatibility
  type?: FollowUpType; // Added for backward compatibility
  variables?: string[]; // Added for backward compatibility
  isDefault?: boolean; // Added for backward compatibility
}

export interface FollowUp {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  subject?: string;
  status: string;
  sent_by?: string;
  sent_at?: string;
  scheduled_at?: string;
  scheduled_for?: string;
  template_id?: string;
  response?: string;
  response_at?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  subject?: string;
  status: string;
  sent_by?: string;
  sent_at?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
  leads?: Lead;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  subject?: string;
  status: string;
  scheduled_at: string;
  leads?: Lead;
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

// Enum types for CRM
export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'walk-in' | 'call' | 'other';
export type FunnelStage = 'lead' | 'prospect' | 'opportunity' | 'customer' | 'lost';
