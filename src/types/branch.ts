
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  manager_id?: string;
  manager_name?: string; // Added to represent the manager's name
  openingHours?: string; // Added for business hours
  closingHours?: string; // Added for business hours
}
