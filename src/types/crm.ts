
// CRM related types

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: string;
  notes?: string;
  interests?: string[];
  tags?: string[];
  assigned_to?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  last_contact_date?: string;
  follow_up_date?: string;
  conversion_value?: number;
  conversion_date?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_at?: string;
  created_by?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  type: string;
  content: string;
  subject?: string;
  status: string;
  sent_by?: string;
  sent_at?: string;
  scheduled_at?: string;
  scheduled_for?: string;
  template_id?: string;
  response?: string;
  response_at?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: Record<string, any>[];
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
