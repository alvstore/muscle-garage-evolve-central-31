
import { supabase } from '@/integrations/supabase/client';

interface PaymentLinkParams {
  amount: number;
  description: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
  membershipId?: string;
  memberId?: string;
  amount?: number;
  branchId?: string;
}

export const paymentService = {
  /**
   * Generate a payment link using Razorpay
   */
  async getPaymentLink(params: PaymentLinkParams): Promise<{ 
    success: boolean; 
    data?: { 
      id: string; 
      short_url: string; 
    }; 
    error?: string; 
  }> {
    try {
      // Get global settings to retrieve Razorpay keys
      const { data: settings, error: settingsError } = await supabase
        .from('global_settings')
        .select('razorpay_key_id, razorpay_key_secret')
        .single();
      
      if (settingsError || !settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
        return {
          success: false,
          error: 'Razorpay is not configured properly. Please contact admin.'
        };
      }

      // Calculate amount in smallest currency unit (paise for INR)
      const amountInSmallestUnit = Math.round(params.amount * 100);
      
      // Create Razorpay order via edge function
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInSmallestUnit,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            ...params.notes,
            name: params.name,
            description: params.description
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment link');
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: {
          id: data.id,
          short_url: data.short_url
        }
      };
    } catch (error: any) {
      console.error('Error creating payment link:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment link'
      };
    }
  },
  
  /**
   * Verify payment after successful Razorpay transaction
   */
  async verifyPayment(params: VerifyPaymentParams): Promise<{ 
    success: boolean; 
    error?: string; 
  }> {
    try {
      // Verify payment signature via edge function
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: params.paymentId,
          razorpay_order_id: params.orderId,
          razorpay_signature: params.signature,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }
      
      // If payment is for a membership, update related records
      if (params.membershipId && params.memberId && params.amount && params.branchId) {
        // Update member_memberships record
        const { error: membershipUpdateError } = await supabase
          .from('member_memberships')
          .update({
            payment_status: 'paid',
            amount_paid: params.amount
          })
          .eq('membership_id', params.membershipId)
          .eq('member_id', params.memberId);
          
        if (membershipUpdateError) {
          console.error('Error updating membership payment status:', membershipUpdateError);
        }
        
        // Update invoice record
        const { data: invoices, error: invoiceQueryError } = await supabase
          .from('invoices')
          .select('id')
          .eq('membership_plan_id', params.membershipId)
          .eq('member_id', params.memberId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!invoiceQueryError && invoices && invoices.length > 0) {
          const { error: invoiceUpdateError } = await supabase
            .from('invoices')
            .update({
              status: 'paid',
              paid_date: new Date().toISOString(),
              razorpay_payment_id: params.paymentId,
              razorpay_order_id: params.orderId,
              payment_method: 'online'
            })
            .eq('id', invoices[0].id);
            
          if (invoiceUpdateError) {
            console.error('Error updating invoice payment status:', invoiceUpdateError);
          }
        }
      }
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }
};
