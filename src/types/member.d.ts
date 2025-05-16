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
  avatar?: string; // Added this missing property
  trainer?: string;
  goal?: string;
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
  features?: any[];
  benefits?: any[];
  is_active?: boolean;
  status?: MembershipPlanStatus;
  memberCount?: number; // Add this property
  // For backward compatibility
  durationDays?: number;
  isActive?: boolean;
}
