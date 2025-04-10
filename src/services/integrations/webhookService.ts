
import api from '../api';
import { RazorpayWebhookEvent, WebhookLog } from '@/types/finance';
import { toast } from 'sonner';
import { messagingService } from './messagingService';

/**
 * Service for managing Razorpay webhooks
 */
export const webhookService = {
  /**
   * Get all webhook logs
   */
  async getWebhookLogs(): Promise<WebhookLog[]> {
    try {
      const response = await api.get('/integrations/razorpay/webhook-logs');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch webhook logs:', error);
      toast.error('Failed to fetch webhook logs');
      return [];
    }
  },
  
  /**
   * Process a webhook event manually (for retry or testing)
   * @param logId ID of the webhook log to process
   */
  async processWebhookManually(logId: string): Promise<boolean> {
    try {
      const response = await api.post(`/integrations/razorpay/webhook-logs/${logId}/process`);
      if (response.data.success) {
        toast.success('Webhook processed successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to process webhook');
        return false;
      }
    } catch (error) {
      console.error('Failed to process webhook:', error);
      toast.error('Failed to process webhook');
      return false;
    }
  },
  
  /**
   * Send a test webhook (for testing purposes)
   * @param eventType Type of event to simulate
   * @param payload Custom payload to send
   */
  async sendTestWebhook(eventType: string, payload: any): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/send-test-webhook', {
        eventType,
        payload
      });
      
      if (response.data.success) {
        toast.success('Test webhook sent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send test webhook');
        return false;
      }
    } catch (error) {
      console.error('Failed to send test webhook:', error);
      toast.error('Failed to send test webhook');
      return false;
    }
  },
  
  /**
   * Validate webhook signature
   * @param payload Raw webhook payload
   * @param signature Razorpay signature from headers
   */
  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/validate-webhook', {
        payload,
        signature
      });
      
      return response.data.valid || false;
    } catch (error) {
      console.error('Failed to validate webhook signature:', error);
      return false;
    }
  },
  
  /**
   * Get webhook statistics
   */
  async getWebhookStats(): Promise<{
    total: number;
    processed: number;
    failed: number;
    pending: number;
  }> {
    try {
      const response = await api.get('/integrations/razorpay/webhook-stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch webhook stats:', error);
      return { total: 0, processed: 0, failed: 0, pending: 0 };
    }
  },

  /**
   * Update webhook settings
   */
  async updateWebhookSettings(settings: {
    enableNotifications: boolean;
    autoRetry: boolean;
    retryAttempts: number;
    notifyAdminOnFailure: boolean;
  }): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/webhook-settings', settings);
      
      if (response.data.success) {
        toast.success('Webhook settings updated successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to update webhook settings');
        return false;
      }
    } catch (error) {
      console.error('Failed to update webhook settings:', error);
      toast.error('Failed to update webhook settings');
      return false;
    }
  },
  
  /**
   * Send notifications for webhook events
   * This is used to send SMS, email, or WhatsApp notifications based on webhook events
   * @param event Webhook event
   * @param memberPhone Member's phone number
   * @param memberEmail Member's email address
   * @param memberId Member's ID
   * @param data Additional data for the notification
   */
  async sendWebhookNotifications(
    event: RazorpayWebhookEvent,
    memberPhone: string,
    memberEmail: string,
    memberId: string,
    data: Record<string, string>
  ): Promise<boolean> {
    try {
      const eventType = event.event;
      
      // Map Razorpay event types to our trigger events
      const triggerEventMap: Record<string, any> = {
        'payment.captured': 'payment_success',
        'payment.failed': 'payment_failure',
        'order.paid': 'payment_success',
        'subscription.activated': 'payment_success',
        'subscription.charged': 'payment_success',
        'subscription.cancelled': 'payment_failure',
        'refund.processed': 'payment_failure',
      };
      
      const triggerEvent = triggerEventMap[eventType];
      
      if (!triggerEvent) {
        // No matching trigger event for this Razorpay event
        return false;
      }
      
      // Send notifications through multiple channels
      const results = await messagingService.sendMultiChannelNotification(
        memberId,
        memberEmail,
        memberPhone,
        triggerEvent,
        data,
        ['email', 'sms']
      );
      
      // Return true if any channel was successful
      return results.email || results.sms || results.whatsapp || results.push;
    } catch (error) {
      console.error('Failed to send webhook notifications:', error);
      return false;
    }
  }
};
