
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  trigger_condition: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branch_id?: string;
  created_by?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  funnel_stage: string;
  notes?: string;
  tags?: string[];
  interests?: string[];
  assigned_to?: string;
  conversion_value?: number;
  conversion_date?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  created_at: string;
  updated_at?: string;
  branch_id?: string;
}
