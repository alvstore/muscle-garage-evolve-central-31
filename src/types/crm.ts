
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
  follow_up_date?: string;
  interests?: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived' | 'converted';

export type FunnelStage = 'cold' | 'warm' | 'hot' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'phone' | 'other';

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

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  template_id?: string;
  sent_by: string;
  sent_at: string;
  response_at?: string;
  scheduled_at?: string;
  type: FollowUpType;
  content: string;
  status: string;
  response?: string;
  subject?: string;
}

export interface ScheduledFollowUp {
  id: string;
  lead_id: string;
  leadName: string;
  type: FollowUpType;
  scheduledFor: string;
  subject: string;
  content: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue' | 'sent';
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
  subject?: string;
  content?: string;
  lead?: {
    name: string;
  };
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  name: string; // Added to fix errors in FollowUpTemplatesList.tsx
  content: string;
  type: FollowUpType;
  variables: string[];
  isDefault?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string; // Added to fix error in FollowUpTemplatesList.tsx
}

export interface LeadConversion {
  id: string;
  lead_id: string;
  converted_by: string;
  converted_at: string;
  membership_id?: string;
  notes?: string;
}
