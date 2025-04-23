
export interface MembershipAssignment {
  id?: string;
  memberId: string;
  membershipId: string;
  startDate: string; // Changed from Date to string
  endDate: string; // Changed from Date to string
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  autoRenew?: boolean;
  notes?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional properties needed for the form
  planId?: string;
  planName?: string;
  totalAmount?: number;
  amountPaid?: number;
  paymentMethod?: string;
}
