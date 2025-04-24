
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
  branchId?: string;
  notes?: string;  // Add this line to include notes
  planId?: string;
  planName?: string;
  totalAmount?: number;
}
