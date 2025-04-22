
export interface MembershipAssignment {
  id?: string;
  memberId: string;
  membershipId: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  autoRenew?: boolean;
  notes?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}
