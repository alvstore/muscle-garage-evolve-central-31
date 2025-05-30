
import api from '../../api';
import { toast } from 'sonner';

export type MessageChannel = 'whatsapp' | 'sms' | 'email' | 'push';

export interface MessageOptions {
  templateId?: string;
  variables?: Record<string, string>;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

/**
 * Service for handling messaging through various channels (WhatsApp, SMS, Email)
 */
export const messagingService = {
  
  /**
   * Send a message through a specific channel
   * @param channel Channel to send through (whatsapp, sms, email, push)
   * @param recipient Recipient identifier (phone or email)
   * @param content Message content
   * @param options Additional options for the message
   */
  async sendMessage(
    channel: MessageChannel,
    recipient: string,
    content: string,
    options?: MessageOptions
  ): Promise<boolean> {
    try {
      const response = await api.post('/integrations/messaging/send', {
        channel,
        recipient,
        content,
        ...options
      });
      
      if (response.data.success) {
        return true;
      } else {
        console.error(`Failed to send ${channel} message:`, response.data.message);
        return false;
      }
    } catch (error) {
      console.error(`Failed to send ${channel} message:`, error);
      return false;
    }
  },
  
  /**
   * Send WhatsApp message
   * @param phone Phone number with country code
   * @param content Message content
   * @param options Additional options
   */
  async sendWhatsApp(
    phone: string,
    content: string,
    options?: MessageOptions
  ): Promise<boolean> {
    const result = await this.sendMessage('whatsapp', phone, content, options);
    if (result) {
      toast.success('WhatsApp message sent successfully');
    } else {
      toast.error('Failed to send WhatsApp message');
    }
    return result;
  },
  
  /**
   * Send SMS message
   * @param phone Phone number with country code
   * @param content Message content
   * @param options Additional options
   */
  async sendSMS(
    phone: string,
    content: string,
    options?: MessageOptions
  ): Promise<boolean> {
    const result = await this.sendMessage('sms', phone, content, options);
    if (result) {
      toast.success('SMS sent successfully');
    } else {
      toast.error('Failed to send SMS');
    }
    return result;
  },
  
  /**
   * Send email message
   * @param email Email address
   * @param subject Email subject
   * @param content Email content (HTML supported)
   * @param options Additional options including attachments
   */
  async sendEmail(
    email: string,
    subject: string,
    content: string,
    options?: MessageOptions
  ): Promise<boolean> {
    const result = await this.sendMessage('email', email, content, {
      ...options,
      variables: {
        ...options?.variables,
        subject
      }
    });
    if (result) {
      toast.success('Email sent successfully');
    } else {
      toast.error('Failed to send email');
    }
    return result;
  },
  
  /**
   * Send push notification
   * @param userId User ID or token to send notification to
   * @param title Notification title
   * @param content Notification content
   * @param options Additional options including action data
   */
  async sendPushNotification(
    userId: string,
    title: string,
    content: string,
    options?: MessageOptions & { data?: Record<string, string> }
  ): Promise<boolean> {
    const result = await this.sendMessage('push', userId, content, {
      ...options,
      variables: {
        ...options?.variables,
        title
      }
    });
    if (result) {
      toast.success('Push notification sent');
    } else {
      toast.error('Failed to send push notification');
    }
    return result;
  },
  
  /**
   * Get message templates
   * @param channel Channel to get templates for
   */
  async getTemplates(channel: MessageChannel): Promise<any[]> {
    try {
      const response = await api.get(`/integrations/messaging/templates/${channel}`);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch ${channel} templates:`, error);
      toast.error(`Failed to fetch ${channel} templates`);
      return [];
    }
  },
  
  /**
   * Send a broadcast message to multiple recipients
   * @param channel Channel to send through
   * @param recipients Array of recipient identifiers
   * @param content Message content
   * @param options Additional options
   */
  async sendBroadcast(
    channel: MessageChannel,
    recipients: string[],
    content: string,
    options?: MessageOptions
  ): Promise<{ success: number; failed: number }> {
    try {
      const response = await api.post('/integrations/messaging/broadcast', {
        channel,
        recipients,
        content,
        ...options
      });
      
      if (response.data.success) {
        const { successCount, failedCount } = response.data;
        
        if (successCount > 0) {
          toast.success(`Successfully sent to ${successCount} recipients`);
        }
        
        if (failedCount > 0) {
          toast.error(`Failed to send to ${failedCount} recipients`);
        }
        
        return {
          success: successCount,
          failed: failedCount
        };
      } else {
        toast.error(response.data.message || 'Failed to send broadcast');
        return { success: 0, failed: recipients.length };
      }
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      toast.error('Failed to send broadcast');
      return { success: 0, failed: recipients.length };
    }
  }
};
