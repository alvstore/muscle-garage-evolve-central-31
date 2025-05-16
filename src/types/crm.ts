
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
