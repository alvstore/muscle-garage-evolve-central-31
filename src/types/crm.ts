
// Define core CRM types

export type FollowUpType = 'email' | 'call' | 'meeting' | 'text' | 'other';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  funnel_stage: string;
  source: string;
  notes?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  tags?: string[];
  interests?: string[];
  branch_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
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
  isDefault?: boolean;
}

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  template_id?: string;
  subject?: string;
  content: string;
  sent_at?: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  status: string;
  type: string;
  scheduled_at?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id?: string;
  template_id?: string;
  scheduled_at: string;
  type: FollowUpType;
  subject?: string;
  content: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
}
