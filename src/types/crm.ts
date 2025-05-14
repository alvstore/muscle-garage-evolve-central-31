
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  branch_id: string;
  assigned_to?: string;
  score?: number;
  last_contacted_at?: string;
  funnel_stage?: FunnelStage;
  tags?: string[];
  conversion_date?: string;
  follow_up_date?: string;
  interests?: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived' | 'converted';

export type FunnelStage = 'cold' | 'warm' | 'hot' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'phone' | 'email' | 'other';

export type FollowUpType = 'email' | 'call' | 'sms' | 'meeting' | 'whatsapp' | 'other';

export interface FollowUp {
  id: string;
  lead_id: string;
  user_id: string;
  type: FollowUpType;
  notes: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled';
  follow_up_date?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  user_id: string;
  type: FollowUpType;
  notes: string;
  created_at: string;
  sent_at: string;
  sent_by?: string; 
  status: string;
  response?: string;
  response_at?: string;
  scheduled_at?: string;
  subject?: string;
  content: string;
}

export interface ScheduledFollowUp {
  id: string;
  lead_id: string;
  scheduledFor: string;
  scheduled_at?: string;
  scheduledBy: string;
  scheduledDate: string;
  type: FollowUpType;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue' | 'sent';
  createdAt: string;
  subject?: string;
  content?: string;
  leadName?: string;
}

export interface FollowUpScheduled {
  id: string;
  leadId?: string;
  lead_id?: string;
  scheduledBy: string;
  scheduledDate: string;
  scheduled_at?: string;
  scheduled_for?: string;
  type: FollowUpType;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  createdAt: string;
  lead_name?: string;
  lead?: {
    id: string;
    name: string;
  };
  subject?: string;
  content?: string;
  sent_by?: string;
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  content: string;
  type: FollowUpType;
  variables: string[];
  name?: string;
  isDefault?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface LeadConversion {
  id: string;
  lead_id: string;
  converted_by: string;
  converted_at: string;
  membership_id?: string;
  notes?: string;
}
