
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
  
  // For backward compatibility
  triggerType?: string;
  triggerValue?: number;
  isActive?: boolean;
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
  
  // Add these for backward compatibility with components
  first_name?: string;
  last_name?: string;
}

// Add missing CRM related types
export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';

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

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  subject?: string;
  status: string;
  sent_by?: string;
  sent_at?: string;
  response?: string;
  response_at?: string;
  scheduled_date?: string;
  template_id?: string;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  scheduled_date: string;
  type: FollowUpType;
  content: string;
  subject?: string;
  status: string;
  created_by: string;
  created_at: string;
  template_id?: string;
  lead?: Lead;
}

export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'phone' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type FunnelStage = 'lead' | 'prospect' | 'opportunity' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost' | 'cold' | 'warm' | 'hot';
