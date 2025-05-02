
export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specializations?: string[];
  specialization?: string; // For backwards compatibility
  bio?: string;
  isAvailable?: boolean;
  avatar?: string;
  branchId: string;
  ratingValue?: number;
  rating?: number; // For backwards compatibility
  fullName?: string; // Alternative field name sometimes used
}
