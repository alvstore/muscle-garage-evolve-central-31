
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: FunnelStage;
  assigned_to?: string;
  tags?: string[];
  interests?: string[];
  notes?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  created_at?: string;
  updated_at?: string;
  branch_id?: string;
}

export type FunnelStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  template_id?: string;
  content: string;
  type: 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
}
