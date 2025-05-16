
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  notes?: string;
  funnel_stage: string;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
  last_contact_date?: string;
  assigned_to?: string;
  interests?: string[];
  tags?: string[];
  conversion_value?: number;
  conversion_date?: string;
  branch_id?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  type: string;
  content: string;
  subject?: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_at?: string;
  created_by?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: {
    field?: string;
    operator?: string;
    value?: any;
    [key: string]: any;
  };
  actions: Array<{
    type: string;
    config: {
      [key: string]: any;
    };
  }>;
  is_active: boolean;
  branch_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  data?: any;
  error?: any;
}
