
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hikvision settings types
export interface HikvisionSettings {
  id?: string;
  branch_id?: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: any[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ESSL settings types
export interface EsslSettings {
  id?: string;
  branch_id?: string;
  device_name: string;
  device_serial: string;
  api_url: string;
  api_username?: string;
  api_password?: string;
  push_url?: string;
  devices: any[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Automation rule types
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: any;
  actions: any[];
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

// SMS settings types
export interface SmsSettings {
  id?: string;
  branch_id?: string;
  provider: string;
  sender_id: string;
  msg91_auth_key?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  custom_api_url?: string;
  custom_api_headers?: string;
  custom_api_params?: string;
  is_active: boolean;
  templates?: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
}

// Email settings types
export interface EmailSettings {
  id?: string;
  branch_id?: string;
  provider: string;
  from_email: string;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  is_active: boolean;
  notifications?: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
}

// WhatsApp settings types
export interface WhatsAppSettings {
  id?: string;
  branch_id?: string;
  api_token: string;
  phone_number_id: string;
  business_account_id: string;
  is_active: boolean;
  notifications?: {
    sendWelcomeMessages: boolean;
    sendClassReminders: boolean;
    sendRenewalReminders: boolean;
    sendBirthdayGreetings: boolean;
  };
}

// Message template types
export interface MessageTemplate {
  id?: string;
  name: string;
  content: string;
  variables?: string[] | any;
  category: string;
  branch_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Type-specific fields
  subject?: string; // Email-specific
  dlt_template_id?: string; // SMS-specific
  header_text?: string; // WhatsApp-specific
  footer_text?: string; // WhatsApp-specific
  whatsapp_template_name?: string; // WhatsApp-specific
}

const settingsService = {
  // Hikvision Settings
  async getHikvisionSettings(branchId?: string): Promise<HikvisionSettings> {
    try {
      let query = supabase.from('hikvision_api_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      return data || {
        api_url: '',
        app_key: '',
        app_secret: '',
        devices: [],
        is_active: false
      };
    } catch (error: any) {
      console.error('Error fetching Hikvision settings:', error);
      toast.error('Failed to load Hikvision settings');
      throw error;
    }
  },
  
  async saveHikvisionSettings(settings: HikvisionSettings): Promise<HikvisionSettings | null> {
    try {
      let response;
      
      if (settings.id) {
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .update({
            api_url: settings.api_url,
            app_key: settings.app_key,
            app_secret: settings.app_secret,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert({
            api_url: settings.api_url,
            app_key: settings.app_key,
            app_secret: settings.app_secret,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('Hikvision settings saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving Hikvision settings:', error);
      toast.error(`Failed to save Hikvision settings: ${error.message}`);
      return null;
    }
  },
  
  // ESSL Settings
  async getEsslSettings(branchId?: string): Promise<EsslSettings> {
    try {
      let query = supabase.from('essl_device_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      return data || {
        device_name: '',
        device_serial: '',
        api_url: '',
        api_username: '',
        api_password: '',
        push_url: '',
        devices: [],
        is_active: false
      };
    } catch (error: any) {
      console.error('Error fetching ESSL settings:', error);
      toast.error('Failed to load ESSL settings');
      throw error;
    }
  },
  
  async saveEsslSettings(settings: EsslSettings): Promise<EsslSettings | null> {
    try {
      let response;
      
      if (settings.id) {
        const { data, error } = await supabase
          .from('essl_device_settings')
          .update({
            device_name: settings.device_name,
            device_serial: settings.device_serial,
            api_url: settings.api_url,
            api_username: settings.api_username,
            api_password: settings.api_password,
            push_url: settings.push_url,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('essl_device_settings')
          .insert({
            device_name: settings.device_name,
            device_serial: settings.device_serial,
            api_url: settings.api_url,
            api_username: settings.api_username,
            api_password: settings.api_password,
            push_url: settings.push_url,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('ESSL settings saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving ESSL settings:', error);
      toast.error(`Failed to save ESSL settings: ${error.message}`);
      return null;
    }
  },
  
  // Register member with device
  async registerMemberWithDevice(
    memberId: string,
    deviceType: 'hikvision' | 'essl',
    deviceData: any
  ): Promise<boolean> {
    try {
      // Implementation will depend on specific device integration requirements
      toast.success(`Member registration with ${deviceType} initiated`);
      return true;
    } catch (error: any) {
      console.error(`Error registering member with ${deviceType}:`, error);
      toast.error(`Failed to register member: ${error.message}`);
      return false;
    }
  },
  
  // Automation rules
  async getAutomationRules(branchId?: string): Promise<AutomationRule[]> {
    try {
      let query = supabase.from('automation_rules').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      toast.error('Failed to load automation rules');
      return [];
    }
  },
  
  async saveAutomationRule(rule: AutomationRule): Promise<AutomationRule | null> {
    try {
      let response;
      
      if (rule.id) {
        const { data, error } = await supabase
          .from('automation_rules')
          .update({
            name: rule.name,
            description: rule.description,
            trigger_type: rule.trigger_type,
            trigger_condition: rule.trigger_condition,
            actions: rule.actions,
            is_active: rule.is_active,
            branch_id: rule.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', rule.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('automation_rules')
          .insert({
            name: rule.name,
            description: rule.description,
            trigger_type: rule.trigger_type,
            trigger_condition: rule.trigger_condition,
            actions: rule.actions,
            is_active: rule.is_active,
            branch_id: rule.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('Automation rule saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving automation rule:', error);
      toast.error(`Failed to save automation rule: ${error.message}`);
      return null;
    }
  },
  
  async deleteAutomationRule(ruleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', ruleId);
      
      if (error) throw error;
      
      toast.success('Automation rule deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting automation rule:', error);
      toast.error(`Failed to delete automation rule: ${error.message}`);
      return false;
    }
  },
  
  // SMS Settings
  async getSmsSettings(branchId?: string): Promise<SmsSettings | null> {
    try {
      let query = supabase.from('sms_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching SMS settings:', error);
      toast.error('Failed to load SMS settings');
      return null;
    }
  },
  
  async saveSmsSettings(settings: SmsSettings): Promise<SmsSettings | null> {
    try {
      let response;
      
      if (settings.id) {
        const { data, error } = await supabase
          .from('sms_settings')
          .update({
            provider: settings.provider,
            sender_id: settings.sender_id,
            msg91_auth_key: settings.msg91_auth_key,
            twilio_account_sid: settings.twilio_account_sid,
            twilio_auth_token: settings.twilio_auth_token,
            custom_api_url: settings.custom_api_url,
            custom_api_headers: settings.custom_api_headers,
            custom_api_params: settings.custom_api_params,
            is_active: settings.is_active,
            templates: settings.templates,
            branch_id: settings.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('sms_settings')
          .insert({
            provider: settings.provider,
            sender_id: settings.sender_id,
            msg91_auth_key: settings.msg91_auth_key,
            twilio_account_sid: settings.twilio_account_sid,
            twilio_auth_token: settings.twilio_auth_token,
            custom_api_url: settings.custom_api_url,
            custom_api_headers: settings.custom_api_headers,
            custom_api_params: settings.custom_api_params,
            is_active: settings.is_active,
            templates: settings.templates,
            branch_id: settings.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('SMS settings saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving SMS settings:', error);
      toast.error(`Failed to save SMS settings: ${error.message}`);
      return null;
    }
  },
  
  // Email Settings
  async getEmailSettings(branchId?: string): Promise<EmailSettings | null> {
    try {
      let query = supabase.from('email_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to load email settings');
      return null;
    }
  },
  
  async saveEmailSettings(settings: EmailSettings): Promise<EmailSettings | null> {
    try {
      let response;
      
      if (settings.id) {
        const { data, error } = await supabase
          .from('email_settings')
          .update({
            provider: settings.provider,
            from_email: settings.from_email,
            sendgrid_api_key: settings.sendgrid_api_key,
            mailgun_api_key: settings.mailgun_api_key,
            mailgun_domain: settings.mailgun_domain,
            smtp_host: settings.smtp_host,
            smtp_port: settings.smtp_port,
            smtp_username: settings.smtp_username,
            smtp_password: settings.smtp_password,
            smtp_secure: settings.smtp_secure,
            is_active: settings.is_active,
            notifications: settings.notifications,
            branch_id: settings.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('email_settings')
          .insert({
            provider: settings.provider,
            from_email: settings.from_email,
            sendgrid_api_key: settings.sendgrid_api_key,
            mailgun_api_key: settings.mailgun_api_key,
            mailgun_domain: settings.mailgun_domain,
            smtp_host: settings.smtp_host,
            smtp_port: settings.smtp_port,
            smtp_username: settings.smtp_username,
            smtp_password: settings.smtp_password,
            smtp_secure: settings.smtp_secure,
            is_active: settings.is_active,
            notifications: settings.notifications,
            branch_id: settings.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('Email settings saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving email settings:', error);
      toast.error(`Failed to save email settings: ${error.message}`);
      return null;
    }
  },
  
  // WhatsApp Settings
  async getWhatsAppSettings(branchId?: string): Promise<WhatsAppSettings | null> {
    try {
      let query = supabase.from('whatsapp_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching WhatsApp settings:', error);
      toast.error('Failed to load WhatsApp settings');
      return null;
    }
  },
  
  async saveWhatsAppSettings(settings: WhatsAppSettings): Promise<WhatsAppSettings | null> {
    try {
      let response;
      
      if (settings.id) {
        const { data, error } = await supabase
          .from('whatsapp_settings')
          .update({
            api_token: settings.api_token,
            phone_number_id: settings.phone_number_id,
            business_account_id: settings.business_account_id,
            is_active: settings.is_active,
            notifications: settings.notifications,
            branch_id: settings.branch_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from('whatsapp_settings')
          .insert({
            api_token: settings.api_token,
            phone_number_id: settings.phone_number_id,
            business_account_id: settings.business_account_id,
            is_active: settings.is_active,
            notifications: settings.notifications,
            branch_id: settings.branch_id
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success('WhatsApp settings saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving WhatsApp settings:', error);
      toast.error(`Failed to save WhatsApp settings: ${error.message}`);
      return null;
    }
  },
  
  // Message Templates
  async getTemplates(type: 'sms' | 'email' | 'whatsapp', branchId?: string): Promise<MessageTemplate[]> {
    try {
      let table;
      switch (type) {
        case 'sms':
          table = 'sms_templates';
          break;
        case 'email':
          table = 'email_templates';
          break;
        case 'whatsapp':
          table = 'whatsapp_templates';
          break;
        default:
          throw new Error('Invalid template type');
      }
      
      let query = supabase.from(table).select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error(`Error fetching ${type} templates:`, error);
      toast.error(`Failed to load ${type} templates`);
      return [];
    }
  },
  
  async saveTemplate(type: 'sms' | 'email' | 'whatsapp', template: MessageTemplate): Promise<MessageTemplate | null> {
    try {
      let table;
      switch (type) {
        case 'sms':
          table = 'sms_templates';
          break;
        case 'email':
          table = 'email_templates';
          break;
        case 'whatsapp':
          table = 'whatsapp_templates';
          break;
        default:
          throw new Error('Invalid template type');
      }
      
      let response;
      
      if (template.id) {
        const { data, error } = await supabase
          .from(table)
          .update({
            name: template.name,
            content: template.content,
            category: template.category,
            variables: template.variables,
            is_active: template.is_active,
            branch_id: template.branch_id,
            updated_at: new Date().toISOString(),
            ...(type === 'email' ? { subject: template.subject } : {}),
            ...(type === 'sms' ? { dlt_template_id: template.dlt_template_id } : {}),
            ...(type === 'whatsapp' ? {
              header_text: template.header_text,
              footer_text: template.footer_text,
              whatsapp_template_name: template.whatsapp_template_name
            } : {})
          })
          .eq('id', template.id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      } else {
        const { data, error } = await supabase
          .from(table)
          .insert({
            name: template.name,
            content: template.content,
            category: template.category,
            variables: template.variables,
            is_active: template.is_active,
            branch_id: template.branch_id,
            ...(type === 'email' ? { subject: template.subject } : {}),
            ...(type === 'sms' ? { dlt_template_id: template.dlt_template_id } : {}),
            ...(type === 'whatsapp' ? {
              header_text: template.header_text,
              footer_text: template.footer_text,
              whatsapp_template_name: template.whatsapp_template_name
            } : {})
          })
          .select()
          .single();
        
        if (error) throw error;
        response = data;
      }
      
      toast.success(`${type.toUpperCase()} template saved successfully`);
      return response;
    } catch (error: any) {
      console.error(`Error saving ${type} template:`, error);
      toast.error(`Failed to save ${type} template: ${error.message}`);
      return null;
    }
  },
  
  async deleteTemplate(type: 'sms' | 'email' | 'whatsapp', templateId: string): Promise<boolean> {
    try {
      let table;
      switch (type) {
        case 'sms':
          table = 'sms_templates';
          break;
        case 'email':
          table = 'email_templates';
          break;
        case 'whatsapp':
          table = 'whatsapp_templates';
          break;
        default:
          throw new Error('Invalid template type');
      }
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
      
      toast.success(`${type.toUpperCase()} template deleted`);
      return true;
    } catch (error: any) {
      console.error(`Error deleting ${type} template:`, error);
      toast.error(`Failed to delete ${type} template: ${error.message}`);
      return false;
    }
  }
};

export default settingsService;
