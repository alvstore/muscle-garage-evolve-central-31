
import api from '../api';
import { Invoice, RazorpayWebhookEvent } from '@/types/finance';
import { toast } from 'sonner';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Service for interacting with Razorpay payment gateway
 */
export const razorpayService = {
  
  /**
   * Create a new payment order
   * @param amount Amount in smallest currency unit (paisa for INR)
   * @param currency Currency code (default: INR)
   * @param receipt Optional receipt ID
   * @param notes Optional notes for the order
   */
  async createOrder(
    amount: number, 
    currency: string = 'INR', 
    receipt?: string, 
    notes?: Record<string, string>
  ): Promise<{ id: string; amount: number; currency: string } | null> {
    try {
      const response = await api.post('/integrations/razorpay/create-order', {
        amount,
        currency,
        receipt,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      toast.error('Failed to create payment order');
      return null;
    }
  },
  
  /**
   * Create a payment link for sharing with members
   * @param amount Amount in smallest currency unit (paisa for INR)
   * @param purpose Purpose of the payment
   * @param expiresIn Expiry time in seconds (default: 24 hours)
   */
  async createPaymentLink(
    amount: number, 
    purpose: string, 
    expiresIn: number = 86400
  ): Promise<string | null> {
    try {
      const response = await api.post('/integrations/razorpay/create-payment-link', {
        amount,
        purpose,
        expiresIn
      });
      
      if (response.data.success) {
        return response.data.paymentLink;
      } else {
        toast.error(response.data.message || 'Failed to create payment link');
        return null;
      }
    } catch (error) {
      console.error('Failed to create payment link:', error);
      toast.error('Failed to create payment link');
      return null;
    }
  },
  
  /**
   * Verify Razorpay payment
   * @param paymentId Razorpay payment ID
   * @param orderId Razorpay order ID
   * @param signature Razorpay signature
   */
  async verifyPayment(
    paymentId: string, 
    orderId: string, 
    signature: string
  ): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/verify-payment', {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Payment verification failed');
      return false;
    }
  },
  
  /**
   * Generate invoice PDF for a payment
   * @param invoiceId ID of the invoice to generate PDF for
   */
  async generateInvoicePdf(invoiceId: string): Promise<string | null> {
    try {
      const response = await api.get(`/integrations/razorpay/invoice-pdf/${invoiceId}`);
      
      if (response.data.success) {
        return response.data.pdfUrl;
      } else {
        toast.error(response.data.message || 'Failed to generate invoice PDF');
        return null;
      }
    } catch (error) {
      console.error('Failed to generate invoice PDF:', error);
      toast.error('Failed to generate invoice PDF');
      return null;
    }
  },
  
  /**
   * Send invoice to member via email
   * @param invoice Invoice to send
   * @param email Email address to send to
   */
  async sendInvoiceEmail(invoice: Invoice, email: string): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/send-invoice', {
        invoiceId: invoice.id,
        email
      });
      
      if (response.data.success) {
        toast.success('Invoice sent successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send invoice');
        return false;
      }
    } catch (error) {
      console.error('Failed to send invoice:', error);
      toast.error('Failed to send invoice');
      return false;
    }
  },
  
  /**
   * Verify webhook signature
   * @param payload Raw webhook payload
   * @param signature Razorpay signature from headers
   * @param webhookSecret Webhook secret key
   */
  async verifyWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
  ): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/verify-webhook-signature', {
        payload,
        signature,
        webhookSecret
      });
      
      return response.data.valid || false;
    } catch (error) {
      console.error('Failed to verify webhook signature:', error);
      return false;
    }
  },
  
  /**
   * Process webhook event
   * @param event Webhook event data
   */
  async processWebhookEvent(event: RazorpayWebhookEvent): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/process-webhook', event);
      
      return response.data.success || false;
    } catch (error) {
      console.error('Failed to process webhook event:', error);
      return false;
    }
  },
  
  /**
   * Get webhook configuration
   */
  async getWebhookConfiguration(): Promise<{
    url: string;
    secret: string;
    active: boolean;
    events: string[];
  } | null> {
    try {
      const response = await api.get('/integrations/razorpay/webhook-config');
      
      return response.data || null;
    } catch (error) {
      console.error('Failed to get webhook configuration:', error);
      return null;
    }
  },
  
  /**
   * Update webhook configuration
   * @param config Webhook configuration
   */
  async updateWebhookConfiguration(config: {
    url: string;
    secret: string;
    active: boolean;
    events: string[];
  }): Promise<boolean> {
    try {
      const response = await api.post('/integrations/razorpay/webhook-config', config);
      
      if (response.data.success) {
        toast.success('Webhook configuration updated');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to update webhook configuration');
        return false;
      }
    } catch (error) {
      console.error('Failed to update webhook configuration:', error);
      toast.error('Failed to update webhook configuration');
      return false;
    }
  }
};
