
import api from './api';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  provider: "sendgrid" | "mailgun" | "smtp";
  body: string;
  variables: string[];
  active: boolean;
  triggers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  provider: "sendgrid" | "mailgun" | "smtp";
  body: string;
  active: boolean;
  triggers?: string[];
}

export interface UpdateEmailTemplateDto extends Partial<CreateEmailTemplateDto> {
  id: string;
}

export interface SendTestEmailDto {
  templateId: string;
  email: string;
  testData?: Record<string, string>;
}

export const emailTemplateService = {
  // Get all email templates
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get<EmailTemplate[]>('/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Failed to fetch email templates');
      return [];
    }
  },

  // Get template by id
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    try {
      const response = await api.get<EmailTemplate>(`/email-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching email template with id ${id}:`, error);
      toast.error('Failed to fetch email template');
      return null;
    }
  },

  // Create new template
  async createTemplate(template: CreateEmailTemplateDto): Promise<EmailTemplate | null> {
    try {
      const response = await api.post<EmailTemplate>('/email-templates', template);
      toast.success('Email template created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating email template:', error);
      toast.error('Failed to create email template');
      return null;
    }
  },

  // Update template
  async updateTemplate(template: UpdateEmailTemplateDto): Promise<EmailTemplate | null> {
    try {
      const response = await api.put<EmailTemplate>(`/email-templates/${template.id}`, template);
      toast.success('Email template updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating email template with id ${template.id}:`, error);
      toast.error('Failed to update email template');
      return null;
    }
  },

  // Delete template
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      await api.delete(`/email-templates/${id}`);
      toast.success('Email template deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting email template with id ${id}:`, error);
      toast.error('Failed to delete email template');
      return false;
    }
  },

  // Send test email
  async sendTestEmail(data: SendTestEmailDto): Promise<boolean> {
    try {
      await api.post('/email-templates/send-test', data);
      toast.success(`Test email sent to ${data.email}`);
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
      return false;
    }
  },

  // Get templates by trigger
  async getTemplatesByTrigger(trigger: string): Promise<EmailTemplate[]> {
    try {
      const response = await api.get<EmailTemplate[]>(`/email-templates/trigger/${trigger}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching email templates for trigger ${trigger}:`, error);
      return [];
    }
  }
};

export default emailTemplateService;
