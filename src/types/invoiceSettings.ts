import { GSTTreatment, TaxType } from './finance';

/**
 * Invoice Settings Types
 * These types define the structure for invoice settings management
 */

export interface InvoiceSettings {
  id: string;
  branch_id?: string;
  
  // Invoice Number Series
  number_prefix: string;
  number_suffix?: string;
  next_number: number;
  number_digits: number;
  reset_frequency: ResetFrequency;
  last_reset_date?: string;
  
  // Default Tax Settings
  default_tax_enabled: boolean;
  default_tax_type: TaxType;
  default_tax_rate: number;
  default_gst_treatment: GSTTreatment;
  default_place_of_supply?: string;
  
  // Terms and Conditions
  default_terms?: string;
  default_notes?: string;
  
  // Display Settings
  show_logo: boolean;
  show_signature: boolean;
  signature_image_url?: string;
  
  // Contact Information
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  company_gst_number?: string;
  
  // Created and Updated timestamps
  created_at?: string;
  updated_at?: string;
  
  // Camel case aliases for UI components
  branchId?: string;
  numberPrefix: string;
  numberSuffix?: string;
  nextNumber: number;
  numberDigits: number;
  resetFrequency: ResetFrequency;
  lastResetDate?: string;
  defaultTaxEnabled: boolean;
  defaultTaxType: TaxType;
  defaultTaxRate: number;
  defaultGstTreatment: GSTTreatment;
  defaultPlaceOfSupply?: string;
  defaultTerms?: string;
  defaultNotes?: string;
  showLogo: boolean;
  showSignature: boolean;
  signatureImageUrl?: string;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyGstNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ResetFrequency = 'never' | 'yearly' | 'monthly' | 'quarterly';

export interface HSNCode {
  id: string;
  code: string;
  description: string;
  gst_rate: number;
  is_service: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Camel case aliases
  gstRate: number;
  isService: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxProfile {
  id: string;
  name: string;
  description?: string;
  tax_type: TaxType;
  tax_rate: number;
  hsn_code?: string;
  is_default: boolean;
  applies_to: 'products' | 'services' | 'both';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Camel case aliases
  taxType: TaxType;
  taxRate: number;
  hsnCode?: string;
  isDefault: boolean;
  appliesTo: 'products' | 'services' | 'both';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  is_default: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Camel case aliases
  htmlContent: string;
  cssContent?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
