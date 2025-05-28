export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string; // Make source required to match usage
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  stage?: string;
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  notes?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  created_at: string;
  updated_at: string;
  branch_id?: string;
  lead_score?: number;
  interests?: string[];
  budget_range?: string;
  timeline?: string;
  decision_maker?: boolean;
  company?: string;
  job_title?: string;
  tags?: string[];
}

export type LeadSource = 'website' | 'social_media' | 'referral' | 'walk_in' | 'advertisement' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
export type FunnelStage = 'lead' | 'prospect' | 'opportunity' | 'customer';

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_at?: string;
  created_by?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  type: string;
  content: string;
  subject?: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export type FollowUpType = 'email' | 'call' | 'meeting' | 'message' | 'sms' | 'whatsapp' | 'other';

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  type: FollowUpType;
  scheduled_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'snoozed' | 'scheduled';
  notes?: string;
  subject?: string;
  content?: string;
  leads?: any;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  template_id?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'scheduled' | 'completed';
  sent_at: string;
  scheduled_at?: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
  created_at?: string;
  updated_at?: string;
}
