
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipService } from '@/services/members/membershipService';

export const useMembershipPlans = () => {
  return useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      console.log('[useMembershipPlans] Fetching membership plans...');
      try {
        const plans = await membershipService.getMembershipPlans();
        console.log('[useMembershipPlans] Fetched plans:', plans);
        return plans;
      } catch (error) {
        console.error('[useMembershipPlans] Error fetching plans:', error);
        throw error;
      }
    }
  });
};

export const useMembershipPlanDetails = (planId: string) => {
  return useQuery({
    queryKey: ['membership-plans', planId],
    queryFn: () => membershipService.getMembershipPlanById(planId),
    enabled: !!planId,
  });
};

export const useMemberSubscription = (memberId: string) => {
  return useQuery({
    queryKey: ['members', memberId, 'subscription'],
    queryFn: () => membershipService.getMemberSubscription(memberId),
    enabled: !!memberId,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, planId }: { memberId: string; planId: string }) => 
      membershipService.createSubscription(memberId, planId),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['members', variables.memberId, 'subscription'] });
      }
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) => 
      membershipService.cancelSubscription(subscriptionId, reason),
    onSuccess: (data, variables) => {
      if (data) {
        // Since we don't know exactly which member this subscription belongs to,
        // we invalidate all subscription queries
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        queryClient.invalidateQueries({ queryKey: ['members'] });
      }
    },
  });
};

export const usePaymentLink = () => {
  return useMutation({
    mutationFn: ({ planId, memberId, promoCode }: { planId: string; memberId: string; promoCode?: string }) => 
      membershipService.getPaymentLink(planId, memberId, promoCode),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, orderId, signature, subscriptionData }: { 
      paymentId: string; 
      orderId: string; 
      signature: string; 
      subscriptionData: any; 
    }) => 
      membershipService.verifyPayment(paymentId, orderId, signature, subscriptionData),
    onSuccess: (data, variables) => {
      if (data) {
        // Invalidate relevant queries based on the subscription data
        const memberId = variables.subscriptionData.memberId;
        queryClient.invalidateQueries({ queryKey: ['members', memberId, 'subscription'] });
      }
    },
  });
};
