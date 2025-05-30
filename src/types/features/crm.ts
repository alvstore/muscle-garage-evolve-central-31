
// CRM and lead management types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type LeadSource = 'website' | 'referral' | 'social_media' | 'advertisement' | 'walk_in' | 'phone_call' | 'other';
export type FollowUpType = 'call' | 'email' | 'sms' | 'meeting' | 'whatsapp';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled' | 'rescheduled';

export interface Lead {
  id: string;
  branch_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  interested_in?: string;
  budget?: number;
  notes?: string;
  assigned_to?: string;
  tags?: string[];
  last_contact_date?: string;
  follow_up_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  created_at: string;
  updated_at: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  type: FollowUpType;
  content: string;
  status: FollowUpStatus;
  scheduled_at?: string;
  sent_at?: string;
  response_at?: string;
  response?: string;
  sent_by?: string;
  template_id?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at: string;
}

export interface CreateLeadInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status?: LeadStatus;
  interested_in?: string;
  budget?: number;
  notes?: string;
  assigned_to?: string;
  tags?: string[];
  branch_id?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  follow_up_date?: string;
}
