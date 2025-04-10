
import api from '../api';
import { toast } from 'sonner';
import { RazorpayWebhook, RazorpayEventType } from '@/types/webhooks';
import { Invoice } from '@/types/finance';

export const razorpayWebhookService = {
  /**
   * Get all webhook logs with optional filtering
   */
  async getWebhookLogs(
    limit = 50, 
    offset = 0, 
    status?: 'success' | 'error' | 'pending',
    eventType?: RazorpayEventType
  ): Promise<RazorpayWebhook[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      
      if (status) {
        params.append('status', status);
      }
      
      if (eventType) {
        params.append('eventType', eventType);
      }
      
      const response = await api.get<RazorpayWebhook[]>(`/webhooks/razorpay/logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch webhook logs:', error);
      return [];
    }
  },
  
  /**
   * Get a single webhook log by ID
   */
  async getWebhookLog(id: string): Promise<RazorpayWebhook | null> {
    try {
      const response = await api.get<RazorpayWebhook>(`/webhooks/razorpay/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch webhook log:', error);
      return null;
    }
  },
  
  /**
   * Manually retry processing a failed webhook
   */
  async retryWebhook(id: string): Promise<boolean> {
    try {
      const response = await api.post(`/webhooks/razorpay/retry/${id}`);
      
      if (response.data.success) {
        toast.success('Webhook processing retried successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to retry webhook processing');
        return false;
      }
    } catch (error) {
      console.error('Failed to retry webhook:', error);
      toast.error('Failed to retry webhook processing');
      return false;
    }
  },
  
  /**
   * Get invoices that have been updated by webhooks
   */
  async getInvoicesByWebhookStatus(
    status: 'paid' | 'failed' | 'refunded',
    limit = 10
  ): Promise<Invoice[]> {
    try {
      const response = await api.get<Invoice[]>(`/invoices/by-webhook-status/${status}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch invoices with webhook status ${status}:`, error);
      return [];
    }
  },
  
  /**
   * Process a webhook event manually (for testing or in case of previous failures)
   */
  async processWebhookManually(
    eventType: RazorpayEventType,
    payload: any
  ): Promise<boolean> {
    try {
      const response = await api.post('/webhooks/razorpay/process-manually', {
        eventType,
        payload
      });
      
      if (response.data.success) {
        toast.success('Webhook processed manually');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to process webhook manually');
        return false;
      }
    } catch (error) {
      console.error('Failed to process webhook manually:', error);
      toast.error('Failed to process webhook manually');
      return false;
    }
  }
};
