Here's the full code for `src/services/membershipService.ts`:

```typescript
import { MembershipPlan } from '@/types';

// Mock implementation of membership service
const membershipService = {
  getMembershipPlans: async (): Promise<MembershipPlan[]> => {
    return [];
  },
  
  getMembershipPlanById: async (planId: string): Promise<MembershipPlan> => {
    return {} as MembershipPlan;
  },
  
  createMembershipPlan: async (plan: MembershipPlan): Promise<MembershipPlan> => {
    return { 
      ...plan,
      id: 'mock-id-' + Math.random().toString(36).substring(7)
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
    return {};
  },
  
  // Add other methods as needed
  getAttendanceSettings: async (branchId: string): Promise<any> => {
    return {};
  }
};

export { membershipService };
export default membershipService;
```
