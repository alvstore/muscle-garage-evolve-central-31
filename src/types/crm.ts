
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  funnel_stage: 'cold' | 'warm' | 'hot' | 'converted';
  tags?: string[];
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  branch_id?: string;
  conversion_value?: number;
  conversion_date?: string;
  last_contact_date?: string;
  follow_up_date?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  scheduled_at: string;
  sent_at?: string;
  response?: string;
  response_at?: string;
  status: 'pending' | 'sent' | 'responded' | 'failed';
  sent_by?: string;
  template_id?: string;
}

export type FollowUpType = 'email' | 'call' | 'sms' | 'whatsapp' | 'meeting';

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at: string;
}

export interface LeadsListProps {
  onLeadUpdate: () => void;
  searchTerm: string;
}

export interface LeadFormProps {
  onSave: () => void;
  onClose: () => void;
}
