
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource; 
  status: LeadStatus;
  funnel_stage: FunnelStage;
  assigned_to?: string;
  tags?: string[];
  interests?: string[];
  notes?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  conversion_date?: string;
  conversion_value?: number;
  created_at?: string;
  updated_at?: string;
  branch_id?: string;
  
  // Adding camelCase aliases for compatibility with existing components
  funnelStage?: FunnelStage;
  assignedTo?: string;
  followUpDate?: string;
  lastContactDate?: string;
  conversionDate?: string;
  conversionValue?: number;
  createdAt?: string;
  updatedAt?: string;
  branchId?: string;
}

export type FunnelStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'cold' | 'warm' | 'hot';

export type LeadSource = 'website' | 'referral' | 'walk-in' | 'social-media' | 'event' | 'phone' | 'other';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';

export type FollowUpType = 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting';

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  
  // Adding properties needed by components
  title?: string;
  type?: FollowUpType;
  variables?: string[] | any;
  isDefault?: boolean;
  
  // Add camelCase aliases
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpHistory {
  id: string;
  lead_id: string;
  template_id?: string;
  content: string;
  type: FollowUpType;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: string;
  sent_by?: string;
  response?: string;
  response_at?: string;
  
  // Adding camelCase aliases for compatibility
  leadId?: string;
  templateId?: string;
  sentAt?: string;
  sentBy?: string;
  responseAt?: string;
}

// Redefining the interface for scheduled follow-ups
export interface FollowUpScheduled {
  id: string;
  lead_id: string;
  lead_name?: string;
  type: FollowUpType;
  scheduled_for: string;
  subject: string;
  content: string;
  status: "scheduled" | "sent" | "cancelled";
  
  // Add camelCase aliases
  leadId?: string;
  leadName?: string;
  scheduledFor?: string;
}

// Define a type alias for the format used in ScheduledFollowUp components
export type ScheduledFollowUp = {
  id: string;
  leadId: string;
  leadName: string;
  type: FollowUpType;
  scheduledFor: string;
  subject: string;
  content: string;
  status: "scheduled" | "sent" | "cancelled";
};

// Define the AutomationRule interface
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: any;
  actions: any[];
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  
  // Add camelCase aliases
  triggerType?: string;
  triggerCondition?: any;
  isActive?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
