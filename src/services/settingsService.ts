
import { supabase } from "./supabaseClient";
import { 
  SmsSettings, 
  EmailSettings, 
  WhatsAppSettings 
} from "@/hooks";
import { MessageTemplate } from "@/hooks/use-message-templates";
import { AutomationRule } from "@/types/crm";

export interface Settings {
  id?: string;
  branch_id?: string;
}

// Generic settings access
const getSettings = async <T extends Settings>(tableName: string, branchId?: string): Promise<T> => {
  try {
    let query = supabase.from(tableName).select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return {} as T;
      }
      throw error;
    }
    
    return data as T;
  } catch (err) {
    console.error(`Error fetching settings from ${tableName}:`, err);
    return {} as T;
  }
};

const saveSettings = async <T extends Settings>(tableName: string, settings: T): Promise<T> => {
  try {
    if (settings.id) {
      // Update existing record
      const { data, error } = await supabase
        .from(tableName)
        .update(settings)
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as T;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from(tableName)
        .insert([settings])
        .select()
        .single();
      
      if (error) throw error;
      return data as T;
    }
  } catch (err) {
    console.error(`Error saving settings to ${tableName}:`, err);
    throw err;
  }
};

// SMS settings
const getSmsSettings = async (branchId?: string): Promise<SmsSettings | null> => {
  try {
    return await getSettings<SmsSettings>('sms_settings', branchId);
  } catch (err) {
    console.error('Error fetching SMS settings:', err);
    return null;
  }
};

const saveSmsSettings = async (settings: SmsSettings): Promise<SmsSettings | null> => {
  try {
    return await saveSettings<SmsSettings>('sms_settings', settings);
  } catch (err) {
    console.error('Error saving SMS settings:', err);
    return null;
  }
};

// Email settings
const getEmailSettings = async (branchId?: string): Promise<EmailSettings | null> => {
  try {
    return await getSettings<EmailSettings>('email_settings', branchId);
  } catch (err) {
    console.error('Error fetching email settings:', err);
    return null;
  }
};

const saveEmailSettings = async (settings: EmailSettings): Promise<EmailSettings | null> => {
  try {
    return await saveSettings<EmailSettings>('email_settings', settings);
  } catch (err) {
    console.error('Error saving email settings:', err);
    return null;
  }
};

// WhatsApp settings
const getWhatsAppSettings = async (branchId?: string): Promise<WhatsAppSettings | null> => {
  try {
    return await getSettings<WhatsAppSettings>('whatsapp_settings', branchId);
  } catch (err) {
    console.error('Error fetching WhatsApp settings:', err);
    return null;
  }
};

const saveWhatsAppSettings = async (settings: WhatsAppSettings): Promise<WhatsAppSettings | null> => {
  try {
    return await saveSettings<WhatsAppSettings>('whatsapp_settings', settings);
  } catch (err) {
    console.error('Error saving WhatsApp settings:', err);
    return null;
  }
};

// Template management
const getTemplates = async (type: 'sms' | 'email' | 'whatsapp', branchId?: string): Promise<MessageTemplate[]> => {
  try {
    const tableName = `${type}_templates`;
    let query = supabase.from(tableName).select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as MessageTemplate[];
  } catch (err) {
    console.error(`Error fetching ${type} templates:`, err);
    return [];
  }
};

const saveTemplate = async (type: 'sms' | 'email' | 'whatsapp', template: MessageTemplate): Promise<MessageTemplate | null> => {
  try {
    const tableName = `${type}_templates`;
    
    if (template.id) {
      // Update existing template
      const { data, error } = await supabase
        .from(tableName)
        .update(template)
        .eq('id', template.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as MessageTemplate;
    } else {
      // Insert new template
      const { data, error } = await supabase
        .from(tableName)
        .insert([template])
        .select()
        .single();
      
      if (error) throw error;
      return data as MessageTemplate;
    }
  } catch (err) {
    console.error(`Error saving ${type} template:`, err);
    return null;
  }
};

const deleteTemplate = async (type: 'sms' | 'email' | 'whatsapp', templateId: string): Promise<boolean> => {
  try {
    const tableName = `${type}_templates`;
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', templateId);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting ${type} template:`, err);
    return false;
  }
};

// Automation rules
const getAutomationRules = async (branchId?: string): Promise<AutomationRule[]> => {
  try {
    let query = supabase.from('automation_rules').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as AutomationRule[];
  } catch (err) {
    console.error('Error fetching automation rules:', err);
    return [];
  }
};

const saveAutomationRule = async (rule: AutomationRule): Promise<AutomationRule | null> => {
  try {
    if (rule.id) {
      // Update existing rule
      const { data, error } = await supabase
        .from('automation_rules')
        .update(rule)
        .eq('id', rule.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as AutomationRule;
    } else {
      // Insert new rule
      const { data, error } = await supabase
        .from('automation_rules')
        .insert([rule])
        .select()
        .single();
      
      if (error) throw error;
      return data as AutomationRule;
    }
  } catch (err) {
    console.error('Error saving automation rule:', err);
    return null;
  }
};

const deleteAutomationRule = async (ruleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', ruleId);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting automation rule:', err);
    return false;
  }
};

// Access control settings - Hikvision
interface HikvisionSettings extends Settings {
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: any[];
  is_active: boolean;
}

const getHikvisionSettings = async (branchId?: string): Promise<HikvisionSettings | null> => {
  try {
    return await getSettings<HikvisionSettings>('hikvision_api_settings', branchId);
  } catch (err) {
    console.error('Error fetching Hikvision settings:', err);
    return null;
  }
};

const saveHikvisionSettings = async (settings: HikvisionSettings): Promise<HikvisionSettings | null> => {
  try {
    return await saveSettings<HikvisionSettings>('hikvision_api_settings', settings);
  } catch (err) {
    console.error('Error saving Hikvision settings:', err);
    return null;
  }
};

// Access control settings - eSSL
interface ESslSettings extends Settings {
  device_name: string;
  device_serial: string;
  api_username?: string;
  api_password?: string;
  api_url?: string;
  push_url?: string;
  devices: any[];
  is_active: boolean;
}

const getESSLSettings = async (branchId?: string): Promise<ESslSettings | null> => {
  try {
    return await getSettings<ESslSettings>('essl_device_settings', branchId);
  } catch (err) {
    console.error('Error fetching eSSL settings:', err);
    return null;
  }
};

const saveESSLSettings = async (settings: ESslSettings): Promise<ESslSettings | null> => {
  try {
    return await saveSettings<ESslSettings>('essl_device_settings', settings);
  } catch (err) {
    console.error('Error saving eSSL settings:', err);
    return null;
  }
};

const settingsService = {
  getSettings,
  saveSettings,
  getSmsSettings,
  saveSmsSettings,
  getEmailSettings,
  saveEmailSettings,
  getWhatsAppSettings,
  saveWhatsAppSettings,
  getTemplates,
  saveTemplate,
  deleteTemplate,
  getAutomationRules,
  saveAutomationRule,
  deleteAutomationRule,
  getHikvisionSettings,
  saveHikvisionSettings,
  getESSLSettings,
  saveESSLSettings
};

export default settingsService;
