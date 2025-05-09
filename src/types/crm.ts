
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'inactive';
export type LeadSource = 'website' | 'referral' | 'cold_call' | 'walk_in' | 'social_media' | 'event' | 'advertisement' | 'other';
export type FunnelStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

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

export interface FollowUp {
  id: string;
  lead_id: string;
  template_id?: string;
  sent_by?: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'whatsapp';
  content: string;
  sent_at?: string;
  response?: string;
  response_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'responded';
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_at?: string;
  created_by?: string;
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
