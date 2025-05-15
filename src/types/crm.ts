
export type FunnelStage = 'cold' | 'warm' | 'hot' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: FunnelStage;
  notes?: string;
  tags?: string[];
  interests?: string[];
  assigned_to?: string;
  branch_id?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  subject?: string;
  content: string;
  type: string;
  status: string;
  sent_at?: string;
  sent_by?: string;
  scheduled_at?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
}
