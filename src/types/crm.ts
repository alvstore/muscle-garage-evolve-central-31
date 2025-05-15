
// CRM types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived' | 'converted';

export type FunnelStage = 'cold' | 'warm' | 'hot' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'phone' | 'email' | 'other';

export type FollowUpType = 'email' | 'phone' | 'meeting' | 'other' | 'sms' | 'whatsapp' | 'call';

export type FollowUpStatus = 'scheduled' | 'completed' | 'overdue' | 'cancelled' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  funnel_stage: FunnelStage;
  assigned_to?: string;
  branch_id?: string;
  conversion_value?: number;
  conversion_date?: string;
  last_contact_date?: string;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  tags?: string[];
  interests?: string[];
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  title: string;
  type: FollowUpType;
  content: string;
  variables: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  isDefault?: boolean;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  template_id?: string;
  subject?: string;
  content: string;
  type: FollowUpType;
  status: FollowUpStatus;
  scheduled_at: string;
  response?: string;
  response_at?: string;
  sent_by?: string;
  sent_at?: string;
  createdAt: string;
  lead?: {
    name: string;
  };
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  status: FollowUpStatus;
  sent_at: string;
  sent_by: string;
  response?: string;
  response_at?: string;
  subject?: string;
  scheduled_at?: string;
  template_id?: string;
}

export interface LeadData {
  id: string; 
  name: string;
  email: string;
  phone: string;
}

export interface AssignedStaff {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
  email?: string;
}
