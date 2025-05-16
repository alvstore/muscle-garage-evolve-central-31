
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: string;
  notes?: string;
  assigned_to?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  interests?: string[];
  last_contact_date?: string;
  follow_up_date?: string;
  conversion_date?: string;
  conversion_value?: number;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability?: number;
  contact?: string;
  contact_id?: string;
  closing_date?: string;
  owner_id?: string;
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  source?: string;
  tags?: string[];
  last_contact?: string;
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_at?: string;
  created_by?: string;
  branch_id?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content?: string;
  subject?: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type FollowUpType = 'call' | 'email' | 'message' | 'meeting' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type FunnelStage = 'cold' | 'warm' | 'hot' | 'won' | 'lost';
export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface FollowUpScheduled {
  id: string;
  lead: Lead;
  type: FollowUpType;
  scheduled_at: string;
  content?: string;
  subject?: string;
}
