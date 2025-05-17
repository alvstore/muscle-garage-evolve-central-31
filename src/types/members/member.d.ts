
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  membership?: Membership;
  membershipStatus?: 'active' | 'expired' | 'pending' | 'cancelled';
  joinDate?: string;
  avatar?: string;
  trainer?: string;
  goal?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  membership_id?: string;
}

export interface Membership {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  price?: number;
  features?: string[];
}

export type MembershipPlanStatus = 'active' | 'inactive' | 'archived';

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: string[];
  benefits?: string[];
  is_active?: boolean;
  status?: MembershipPlanStatus;
  memberCount?: number;
  // For backward compatibility
  durationDays?: number;
  isActive?: boolean;
}
