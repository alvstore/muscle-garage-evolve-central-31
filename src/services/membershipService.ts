
import { MembershipPlan } from '@/types';
import { addDays } from 'date-fns';

// Mock implementation of membership service
const membershipService = {
  getMembershipPlans: async (): Promise<MembershipPlan[]> => {
    return [
      {
        id: "plan-1",
        name: "Basic Plan",
        price: 999,
        duration_days: 30,
        features: ["Access to gym equipment", "Locker usage"],
        is_active: true,
        description: "Perfect for beginners",
        branch_id: "branch-1",
        status: "active",
      },
      {
        id: "plan-2",
        name: "Premium Plan",
        price: 1999,
        duration_days: 90,
        features: ["Access to gym equipment", "Locker usage", "Trainer consultation", "Group classes"],
        is_active: true,
        description: "For serious fitness enthusiasts",
        branch_id: "branch-1",
        status: "active",
      }
    ];
  },
  
  getMembershipPlanById: async (planId: string): Promise<MembershipPlan> => {
    const plans = await membershipService.getMembershipPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error(`Membership plan with ID ${planId} not found`);
    }
    return plan;
  },
  
  createMembershipPlan: async (plan: MembershipPlan): Promise<MembershipPlan> => {
    return { 
      ...plan,
      id: plan.id || 'mock-id-' + Math.random().toString(36).substring(7)
    };
  },
  
  updateMembershipPlan: async (id: string, plan: MembershipPlan): Promise<MembershipPlan> => {
    return { 
      ...plan,
      id
    };
  },
  
  deleteMembershipPlan: async (id: string): Promise<boolean> => {
    return true;
  },
  
  getMemberSubscription: async (memberId: string): Promise<any> => {
    return {
      id: "subscription-1",
      member_id: memberId,
      plan_id: "plan-1",
      start_date: new Date().toISOString(),
      end_date: addDays(new Date(), 30).toISOString(),
      status: "active",
      amount_paid: 999,
      payment_status: "paid",
    };
  },
  
  createSubscription: async (memberId: string, planId: string): Promise<any> => {
    const plan = await membershipService.getMembershipPlanById(planId);
    return {
      id: "subscription-" + Math.random().toString(36).substring(7),
      member_id: memberId,
      plan_id: planId,
      start_date: new Date().toISOString(),
      end_date: addDays(new Date(), plan.duration_days).toISOString(),
      status: "active",
      amount_paid: plan.price,
      payment_status: "paid",
    };
  },
  
  cancelSubscription: async (subscriptionId: string, reason?: string): Promise<boolean> => {
    return true;
  },
  
  assignMembership: async (data: any): Promise<any> => {
    return {
      success: true,
      data: {
        id: "membership-" + Math.random().toString(36).substring(7),
        ...data
      },
      invoiceId: "inv-" + Math.random().toString(36).substring(7)
    };
  },
  
  calculateEndDate: (startDate: Date, durationDays: number): Date => {
    return addDays(startDate, durationDays);
  },
  
  getPaymentLink: async (planId: string, memberId: string, promoCode?: string): Promise<string> => {
    return "https://payment-gateway.example.com/pay?plan=" + planId + "&member=" + memberId + (promoCode ? "&promo=" + promoCode : "");
  },
  
  verifyPayment: async (paymentId: string, orderId: string, signature: string, subscriptionData: any): Promise<any> => {
    return {
      success: true,
      data: {
        id: "payment-" + Math.random().toString(36).substring(7),
        order_id: orderId,
        subscription_id: "subscription-" + Math.random().toString(36).substring(7),
        payment_id: paymentId,
        status: "paid",
        amount: subscriptionData.amount || 999,
        created_at: new Date().toISOString()
      }
    };
  },
  
  // Add other methods as needed
  getAttendanceSettings: async (branchId: string): Promise<any> => {
    return {
      branch_id: branchId,
      attendance_tracking_method: "biometric",
      require_photo: true,
      allow_self_checkin: false,
      grace_period_minutes: 15,
      notification_settings: {
        send_sms: true,
        send_email: true
      }
    };
  }
};

export { membershipService };
export default membershipService;
