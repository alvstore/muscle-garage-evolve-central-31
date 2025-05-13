
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  funnel_stage: string;
  status: string;
  source: string;
  notes?: string;
  tags?: string[];
  interests?: string[];
  assigned_to?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  branch_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  type: string;
  content: string;
  subject?: string;
  status: string;
  sent_by?: string;
  sent_at: string;
  response?: string;
  response_at?: string;
  template_id?: string;
  scheduled_at?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at: string;
}
