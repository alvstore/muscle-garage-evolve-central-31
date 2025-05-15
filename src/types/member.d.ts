
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
