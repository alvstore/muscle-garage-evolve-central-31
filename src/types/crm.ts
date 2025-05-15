
// Lead Status and Funnel Stage enums
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
  DORMANT = 'dormant'
}

export enum FunnelStage {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  OPPORTUNITY = 'opportunity',
  CUSTOMER = 'customer',
  LOST = 'lost'
}

// Follow-up related types
export type FollowUpType = 'email' | 'call' | 'meeting' | 'sms' | 'whatsapp';

export type FollowUpStatus = 'scheduled' | 'sent' | 'failed' | 'cancelled';

export interface FollowUpTemplate {
  id: string;
  title: string;
  name: string;
  type: FollowUpType;
  content: string;
  variables: string[];
  created_at: string;
  updated_at: string;
  isDefault?: boolean;
}

export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  scheduled_at: string;
  content: string;
  type: FollowUpType;
  status: FollowUpStatus;
  template_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  lead?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  follow_up_type: FollowUpType;
  notes: string;
  created_by: string;
  created_at: string;
  contact_medium?: string;
  response?: string;
  next_follow_up?: string;
  scheduled_id?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  funnel_stage: FunnelStage;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  interested_in?: string[];
  branch_id: string;
  last_contact?: string;
  next_follow_up?: string;
  budget?: number;
  probability?: number;
  tags?: string[];
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
