
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  funnel_stage: string;
  assigned_to?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  tags?: string[];
  interests?: string[];
  branch_id?: string;
  conversion_date?: string;
  conversion_value?: number;
}

export type FollowUpType = 'email' | 'sms' | 'call' | 'whatsapp' | 'meeting';

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  type: FollowUpType;
  content: string;
  status: string;
  sent_at: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  subject?: string;
  scheduled_at?: string;
  template_id?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  lead?: Lead;
  type: FollowUpType;
  content: string;
  scheduled_at: string;
  status: string;
  template_id?: string;
  subject?: string;
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
