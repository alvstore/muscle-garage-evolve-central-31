
import api from '../api';
import { EmailTemplate, EmailLog, EmailProvider, TriggerEvent } from '@/types/finance';
import { toast } from 'sonner';

/**
 * Service for managing Email templates and sending emails
 */
export const emailTemplateService = {
  /**
   * Get all Email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get('/integrations/email/templates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Email templates:', error);
      toast.error('Failed to fetch Email templates');
      return [];
    }
  },
  
  /**
   * Get a single Email template by ID
   */
  async getTemplate(id: string): Promise<EmailTemplate | null> {
    try {
      const response = await api.get(`/integrations/email/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Email template ${id}:`, error);
      toast.error('Failed to fetch Email template');
      return null;
    }
  },
  
  /**
   * Create a new Email template
   */
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate | null> {
    try {
      const response = await api.post('/integrations/email/templates', template);
      toast.success('Email template created successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to create Email template:', error);
      toast.error('Failed to create Email template');
      return null;
    }
  },
  
  /**
   * Update an existing Email template
   */
  async updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    try {
      const response = await api.put(`/integrations/email/templates/${id}`, template);
      toast.success('Email template updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Failed to update Email template ${id}:`, error);
      toast.error('Failed to update Email template');
      return null;
    }
  },
  
  /**
   * Delete an Email template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      await api.delete(`/integrations/email/templates/${id}`);
      toast.success('Email template deleted successfully');
      return true;
    } catch (error) {
      console.error(`Failed to delete Email template ${id}:`, error);
      toast.error('Failed to delete Email template');
      return false;
    }
  },
  
  /**
   * Send a test email using a template
   */
  async sendTestEmail(templateId: string, emailAddress: string, testData: Record<string, string>): Promise<boolean> {
    try {
      const response = await api.post(`/integrations/email/send-test`, {
        templateId,
        emailAddress,
        testData
      });
      
      if (response.data.success) {
        toast.success('Test email sent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send test email');
        return false;
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error('Failed to send test email');
      return false;
    }
  },
  
  /**
   * Get email logs
   */
  async getEmailLogs(filters?: {
    templateId?: string;
    status?: 'sent' | 'failed' | 'pending';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: EmailLog[]; total: number }> {
    try {
      const response = await api.get('/integrations/email/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Email logs:', error);
      toast.error('Failed to fetch Email logs');
      return { logs: [], total: 0 };
    }
  },
  
  /**
   * Retry sending a failed email
   */
  async retryEmail(logId: string): Promise<boolean> {
    try {
      const response = await api.post(`/integrations/email/logs/${logId}/retry`);
      
      if (response.data.success) {
        toast.success('Email resent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to resend email');
        return false;
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
      toast.error('Failed to resend email');
      return false;
    }
  },
  
  /**
   * Extract variables from an Email template content
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
   * Preview an email with test data
   * @param content Template content with {variable} placeholders
   * @param testData Object with variable values
   * @returns Processed email content with variables replaced
   */
  previewEmail(content: string, testData: Record<string, string>): string {
    return content.replace(/{([^{}]+)}/g, (match, variable) => {
      return testData[variable] || match;
    });
  },
  
  /**
   * Get email templates for a specific trigger event
   */
  async getTemplatesForEvent(event: TriggerEvent): Promise<EmailTemplate[]> {
    try {
      const response = await api.get(`/integrations/email/templates/event/${event}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Email templates for event ${event}:`, error);
      return [];
    }
  }
};
