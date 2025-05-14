
export type LeadSource = 'website' | 'referral' | 'walk-in' | 'phone' | 'email' | 'social' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type FunnelStage = 'cold' | 'warm' | 'hot' | 'won' | 'lost';
export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  funnel_stage: FunnelStage;
  notes: string;
  branch_id: string;
  note: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  type: FollowUpType;
  variables: string[];
  subject?: string; // Added subject field
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger_type: string;
  trigger_conditions: any;
  actions: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
