
import api from '../api';
import { SmsTemplate, SmsLog, SmsProvider, TriggerEvent } from '@/types/finance';
import { toast } from 'sonner';

/**
 * Service for managing SMS templates and sending SMS
 */
export const smsTemplateService = {
  /**
   * Get all SMS templates
   */
  async getTemplates(): Promise<SmsTemplate[]> {
    try {
      const response = await api.get('/integrations/sms/templates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch SMS templates:', error);
      toast.error('Failed to fetch SMS templates');
      return [];
    }
  },
  
  /**
   * Get a single SMS template by ID
   */
  async getTemplate(id: string): Promise<SmsTemplate | null> {
    try {
      const response = await api.get(`/integrations/sms/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch SMS template ${id}:`, error);
      toast.error('Failed to fetch SMS template');
      return null;
    }
  },
  
  /**
   * Create a new SMS template
   */
  async createTemplate(template: Omit<SmsTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<SmsTemplate | null> {
    try {
      const response = await api.post('/integrations/sms/templates', template);
      toast.success('SMS template created successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to create SMS template:', error);
      toast.error('Failed to create SMS template');
      return null;
    }
  },
  
  /**
   * Update an existing SMS template
   */
  async updateTemplate(id: string, template: Partial<SmsTemplate>): Promise<SmsTemplate | null> {
    try {
      const response = await api.put(`/integrations/sms/templates/${id}`, template);
      toast.success('SMS template updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Failed to update SMS template ${id}:`, error);
      toast.error('Failed to update SMS template');
      return null;
    }
  },
  
  /**
   * Delete an SMS template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      await api.delete(`/integrations/sms/templates/${id}`);
      toast.success('SMS template deleted successfully');
      return true;
    } catch (error) {
      console.error(`Failed to delete SMS template ${id}:`, error);
      toast.error('Failed to delete SMS template');
      return false;
    }
  },
  
  /**
   * Send a test SMS using a template
   */
  async sendTestSms(templateId: string, phoneNumber: string, testData: Record<string, string>): Promise<boolean> {
    try {
      const response = await api.post(`/integrations/sms/send-test`, {
        templateId,
        phoneNumber,
        testData
      });
      
      if (response.data.success) {
        toast.success('Test SMS sent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send test SMS');
        return false;
      }
    } catch (error) {
      console.error('Failed to send test SMS:', error);
      toast.error('Failed to send test SMS');
      return false;
    }
  },
  
  /**
   * Get SMS logs
   */
  async getSmsLogs(filters?: {
    templateId?: string;
    status?: 'sent' | 'failed' | 'pending';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: SmsLog[]; total: number }> {
    try {
      const response = await api.get('/integrations/sms/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch SMS logs:', error);
      toast.error('Failed to fetch SMS logs');
      return { logs: [], total: 0 };
    }
  },
  
  /**
   * Retry sending a failed SMS
   */
  async retrySms(logId: string): Promise<boolean> {
    try {
      const response = await api.post(`/integrations/sms/logs/${logId}/retry`);
      
      if (response.data.success) {
        toast.success('SMS resent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to resend SMS');
        return false;
      }
    } catch (error) {
      console.error('Failed to resend SMS:', error);
      toast.error('Failed to resend SMS');
      return false;
    }
  },
  
  /**
   * Extract variables from an SMS template content
   * @param content Template content with {variable} placeholders
   * @returns Array of variable names without braces
   */
  extractVariables(content: string): string[] {
    const variables: Set<string> = new Set();
    const regex = /{([^{}]+)}/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
    }
    
    return Array.from(variables);
  },
  
  /**
   * Preview an SMS with test data
   * @param content Template content with {variable} placeholders
   * @param testData Object with variable values
   * @returns Processed SMS content with variables replaced
   */
  previewSms(content: string, testData: Record<string, string>): string {
    return content.replace(/{([^{}]+)}/g, (match, variable) => {
      return testData[variable] || match;
    });
  },
  
  /**
   * Get SMS templates for a specific trigger event
   */
  async getTemplatesForEvent(event: TriggerEvent): Promise<SmsTemplate[]> {
    try {
      const response = await api.get(`/integrations/sms/templates/event/${event}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch SMS templates for event ${event}:`, error);
      return [];
    }
  }
};
