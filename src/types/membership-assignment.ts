
export interface MembershipAssignment {
  id?: string;
  memberId: string;
  membershipId: string; 
  startDate: Date;
  endDate: Date;
  amount?: number;
  amountPaid?: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod?: string;
  trainerId?: string;
}
