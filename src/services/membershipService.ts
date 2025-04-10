
import api from './api';
import { MembershipPlan, MembershipSubscription } from '@/types/membership';
import { toast } from 'sonner';

export const membershipService = {
  // Fetch all membership plans
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    try {
      const response = await api.get<MembershipPlan[]>('/membership-plans');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch membership plans';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch a specific membership plan by ID
  async getMembershipPlanById(planId: string): Promise<MembershipPlan | null> {
    try {
      const response = await api.get<MembershipPlan>(`/membership-plans/${planId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch membership plan details';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Create a new membership subscription
  async createSubscription(memberId: string, planId: string): Promise<MembershipSubscription | null> {
    try {
      const response = await api.post<MembershipSubscription>('/subscriptions', { memberId, planId });
      toast.success('Membership subscription created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create subscription';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Get member's active subscription
  async getMemberSubscription(memberId: string): Promise<MembershipSubscription | null> {
    try {
      const response = await api.get<MembershipSubscription>(`/members/${memberId}/subscription`);
      return response.data;
    } catch (error: any) {
      // Don't show error for no subscription
      if (error.response?.status !== 404) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch subscription details';
        toast.error(errorMessage);
      }
      return null;
    }
  },
  
  // Cancel a subscription
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    try {
      await api.post(`/subscriptions/${subscriptionId}/cancel`, { reason });
      toast.success('Subscription cancelled successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel subscription';
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Generate payment link for membership purchase
  async getPaymentLink(planId: string, memberId: string, promoCode?: string): Promise<string | null> {
    try {
      const response = await api.post<{ paymentLink: string }>('/payments/generate-link', { 
        planId, 
        memberId,
        promoCode 
      });
      return response.data.paymentLink;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate payment link';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Verify Razorpay payment
  async verifyPayment(paymentId: string, orderId: string, signature: string, subscriptionData: any): Promise<boolean> {
    try {
      await api.post('/payments/verify', {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        subscription: subscriptionData
      });
      toast.success('Payment verified successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Payment verification failed';
      toast.error(errorMessage);
      return false;
    }
  }
};
