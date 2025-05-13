
import { UserRole } from '.';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  stage: LeadStage;
  branch_id?: string;
  assigned_to?: string;
  contact_preference?: 'email' | 'phone' | 'whatsapp' | 'in_person';
  notes?: string;
  score?: number;
  last_contact?: string;
  next_follow_up?: string;
  created_at: string;
  updated_at: string;
}

export type LeadSource = 
  | 'website'
  | 'referral'
  | 'social_media'
  | 'walk_in'
  | 'phone'
  | 'partner'
  | 'other';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'
  | 'inactive';

export type LeadStage = 
  | 'new'
  | 'initial_contact'
  | 'needs_assessment'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type FollowUpType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'whatsapp'
  | 'sms'
  | 'other';

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  status: 'pending' | 'completed' | 'failed' | 'scheduled';
  notes: string;
  subject?: string;
  content?: string;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledFollowUp {
  id: string;
  lead_id: string;
  type: FollowUpType;
  subject: string;
  content: string;
  scheduled_at: string;
  created_by: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

export interface FollowUpTemplateType {
  id?: string;
  name: string;
  template_type: FollowUpType;
  subject?: string;
  content: string;
  title?: string;
  type?: FollowUpType;
  isDefault?: boolean;
  variables?: string[];
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type FollowUpTemplate = FollowUpTemplateType;

export interface LeadConversion {
  id: string;
  lead_id: string;
  membership_id: string;
  payment_status: 'pending' | 'paid' | 'failed';
  amount: number;
  discount?: number;
  converted_by: string;
  notes?: string;
  created_at: string;
}

export interface ReferralData {
  id: string;
  referrer_id: string;
  referrer_type: 'member' | 'staff' | 'external';
  referrer_name: string;
  referrer_email?: string;
  referrer_phone?: string;
  code: string;
  discount_amount?: number;
  discount_percentage?: number;
  status: 'active' | 'used' | 'expired';
  usage_limit?: number;
  usage_count: number;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  assigned_to: string;
  assigned_by: string;
  status: 'active' | 'completed' | 'reassigned';
  created_at: string;
  updated_at: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  scheduled_at: string;
  type: FollowUpType;
  subject: string;
  content: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}
