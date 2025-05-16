
export type FunnelStage = 'cold' | 'warm' | 'hot' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  WALK_IN = 'walk_in',
  PHONE = 'phone',
  EMAIL = 'email',
  OTHER = 'other'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  UNQUALIFIED = 'unqualified',
  CONVERTED = 'converted',
  LOST = 'lost'
}

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

export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';

export interface FollowUpHistory {
  id: string;
  lead_id?: string;
  subject?: string;
  content: string;
  type: FollowUpType;
  status: string;
  sent_at?: string;
  sent_by?: string;
  scheduled_at?: string;
  response?: string;
  response_at?: string;
  template_id?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  lead?: Lead;
  subject: string;
  content: string;
  type: FollowUpType;
  status: string;
  scheduled_date: string;
  created_by: string;
  created_at: string;
  template_id?: string;
}

export interface FollowUpTemplate {
  id: string;
  title: string;
  name: string;
  content: string;
  type: FollowUpType;
  variables: string[];
  isDefault?: boolean;
  created_at: string;
  updated_at: string;
}
