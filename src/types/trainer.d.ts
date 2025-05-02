
export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specializations?: string[];
  specialization?: string; // Add for backwards compatibility
  bio?: string;
  isAvailable?: boolean;
  avatar?: string;
  branchId: string;
  ratingValue?: number;
  rating?: number; // Add for backwards compatibility
}
