
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  note: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  branch_id: string;
  assigned_to?: string;
  score?: number;
  last_contacted_at?: string;
  funnel_stage?: string;
  tags?: string[];
  conversion_date?: string;
  stage?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived' | 'converted';

export type FollowUpType = 'email' | 'call' | 'sms' | 'meeting' | 'whatsapp' | 'other';

export interface FollowUp {
  id: string;
  lead_id: string;
  user_id: string;
  type: FollowUpType;
  notes: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled';
  follow_up_date?: string;
}

export interface ScheduledFollowUp {
  id: string;
  lead_id: string;
  scheduled_by: string;
  scheduled_date: string;
  type: FollowUpType;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  created_at: string;
}

export interface FollowUpScheduled {
  id: string;
  leadId: string;
  scheduledBy: string;
  scheduledDate: string;
  type: FollowUpType;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  createdAt: string;
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  content: string;
  type: FollowUpType;
  variables: string[];
  isDefault?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LeadConversion {
  id: string;
  lead_id: string;
  converted_by: string;
  converted_at: string;
  membership_id?: string;
  notes?: string;
}
