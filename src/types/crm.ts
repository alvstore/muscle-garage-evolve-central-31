
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

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_at?: string;
  created_by?: string;
}

export type FollowUpType = 'email' | 'call' | 'meeting' | 'message' | 'other';

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  type: FollowUpType;
  scheduled_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'snoozed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
  created_at?: string;
  updated_at?: string;
}
