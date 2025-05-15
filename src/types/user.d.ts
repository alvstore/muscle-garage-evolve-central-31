
export interface User {
  id: string;
  email: string;
  name: string; // Added this missing property
  role?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
