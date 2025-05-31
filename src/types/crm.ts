
export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'advertisement' | 'other';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type FunnelStage = 'lead' | 'prospect' | 'opportunity' | 'customer' | 'closed-won' | 'closed-lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  stage: FunnelStage;
  score?: number;
  interests?: string[];
  notes?: string;
  assigned_to?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'sms' | 'meeting' | 'note';
  content: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  response_at?: string;
  response?: string;
  sent_by?: string;
  template_id?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'sms' | 'meeting';
  scheduled_at: string;
  content: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_by?: string;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  lead_id: string;
  stage: string;
  probability: number;
  expected_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}
