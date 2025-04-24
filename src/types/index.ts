
export interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  status: string;
  membershipStatus: string;
  membershipId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  avatar?: string;
}
