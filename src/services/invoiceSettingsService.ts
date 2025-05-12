import { supabase } from '@/integrations/supabase/client';
import { 
  InvoiceSettings, 
  HSNCode, 
  TaxProfile,
  InvoiceTemplate,
  ResetFrequency
} from '@/types/invoiceSettings';
import { format } from 'date-fns';

/**
 * Service for managing invoice settings, tax profiles, HSN codes, and templates
 */
export const invoiceSettingsService = {
  /**
   * Get invoice settings for a branch
   * @param branchId The branch ID to get settings for
   */
  async getInvoiceSettings(branchId?: string): Promise<InvoiceSettings | null> {
    try {
      let query = supabase
        .from('invoice_settings')
        .select('*');
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        // If no settings found, create default settings
        if (error.code === 'PGRST116') {
          return this.createDefaultInvoiceSettings(branchId);
        }
        throw error;
      }
      
      return this.mapInvoiceSettings(data);
    } catch (error) {
      console.error('Error fetching invoice settings:', error);
      return null;
    }
  },
  
  /**
   * Create default invoice settings for a branch
   * @param branchId The branch ID to create settings for
   */
  async createDefaultInvoiceSettings(branchId?: string): Promise<InvoiceSettings | null> {
    try {
      const defaultSettings = {
        branch_id: branchId,
        number_prefix: 'INV',
        number_suffix: '',
        next_number: 1,
        number_digits: 5,
        reset_frequency: 'yearly' as ResetFrequency,
        last_reset_date: new Date().toISOString(),
        default_tax_enabled: true,
        default_tax_type: 'gst',
        default_tax_rate: 18,
        default_gst_treatment: 'registered_business',
        default_place_of_supply: '',
        default_terms: 'Payment due within 30 days of invoice date.',
        default_notes: '',
        show_logo: true,
        show_signature: false,
        signature_image_url: '',
        company_name: 'Muscle Garage',
        company_address: '',
        company_phone: '',
        company_email: '',
        company_website: '',
        company_gst_number: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('invoice_settings')
        .insert(defaultSettings)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapInvoiceSettings(data);
    } catch (error) {
      console.error('Error creating default invoice settings:', error);
      return null;
    }
  },
  
  /**
   * Update invoice settings
   * @param id The settings ID
   * @param updates The settings updates
   */
  async updateInvoiceSettings(id: string, updates: Partial<InvoiceSettings>): Promise<InvoiceSettings | null> {
    try {
      // Remove camelCase aliases before saving to database
      const { 
        branchId, numberPrefix, numberSuffix, nextNumber, numberDigits,
        resetFrequency, lastResetDate, defaultTaxEnabled, defaultTaxType,
        defaultTaxRate, defaultGstTreatment, defaultPlaceOfSupply, defaultTerms,
        defaultNotes, showLogo, showSignature, signatureImageUrl, companyName,
        companyAddress, companyPhone, companyEmail, companyWebsite, companyGstNumber,
        createdAt, updatedAt, ...dbUpdates 
      } = updates;
      
      // Add snake_case versions of camelCase properties
      if (branchId !== undefined) dbUpdates.branch_id = branchId;
      if (numberPrefix !== undefined) dbUpdates.number_prefix = numberPrefix;
      if (numberSuffix !== undefined) dbUpdates.number_suffix = numberSuffix;
      if (nextNumber !== undefined) dbUpdates.next_number = nextNumber;
      if (numberDigits !== undefined) dbUpdates.number_digits = numberDigits;
      if (resetFrequency !== undefined) dbUpdates.reset_frequency = resetFrequency;
      if (lastResetDate !== undefined) dbUpdates.last_reset_date = lastResetDate;
      if (defaultTaxEnabled !== undefined) dbUpdates.default_tax_enabled = defaultTaxEnabled;
      if (defaultTaxType !== undefined) dbUpdates.default_tax_type = defaultTaxType;
      if (defaultTaxRate !== undefined) dbUpdates.default_tax_rate = defaultTaxRate;
      if (defaultGstTreatment !== undefined) dbUpdates.default_gst_treatment = defaultGstTreatment;
      if (defaultPlaceOfSupply !== undefined) dbUpdates.default_place_of_supply = defaultPlaceOfSupply;
      if (defaultTerms !== undefined) dbUpdates.default_terms = defaultTerms;
      if (defaultNotes !== undefined) dbUpdates.default_notes = defaultNotes;
      if (showLogo !== undefined) dbUpdates.show_logo = showLogo;
      if (showSignature !== undefined) dbUpdates.show_signature = showSignature;
      if (signatureImageUrl !== undefined) dbUpdates.signature_image_url = signatureImageUrl;
      if (companyName !== undefined) dbUpdates.company_name = companyName;
      if (companyAddress !== undefined) dbUpdates.company_address = companyAddress;
      if (companyPhone !== undefined) dbUpdates.company_phone = companyPhone;
      if (companyEmail !== undefined) dbUpdates.company_email = companyEmail;
      if (companyWebsite !== undefined) dbUpdates.company_website = companyWebsite;
      if (companyGstNumber !== undefined) dbUpdates.company_gst_number = companyGstNumber;
      
      // Add updated timestamp
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('invoice_settings')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapInvoiceSettings(data);
    } catch (error) {
      console.error('Error updating invoice settings:', error);
      return null;
    }
  },
  
  /**
   * Generate the next invoice number based on settings
   * @param settings The invoice settings
   */
  generateInvoiceNumber(settings: InvoiceSettings): string {
    // Check if we need to reset the counter
    const now = new Date();
    const lastReset = settings.last_reset_date ? new Date(settings.last_reset_date) : new Date(0);
    let nextNumber = settings.next_number;
    
    if (settings.reset_frequency !== 'never') {
      let shouldReset = false;
      
      switch (settings.reset_frequency) {
        case 'yearly':
          shouldReset = now.getFullYear() > lastReset.getFullYear();
          break;
        case 'quarterly':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const lastQuarter = Math.floor(lastReset.getMonth() / 3);
          shouldReset = now.getFullYear() > lastReset.getFullYear() || 
                        (now.getFullYear() === lastReset.getFullYear() && currentQuarter > lastQuarter);
          break;
        case 'monthly':
          shouldReset = now.getFullYear() > lastReset.getFullYear() || 
                        (now.getFullYear() === lastReset.getFullYear() && now.getMonth() > lastReset.getMonth());
          break;
      }
      
      if (shouldReset) {
        nextNumber = 1;
        // Update the settings in the database (async)
        this.updateInvoiceSettings(settings.id, { 
          next_number: 1, 
          last_reset_date: now.toISOString() 
        });
      }
    }
    
    // Format the number with leading zeros
    const formattedNumber = nextNumber.toString().padStart(settings.number_digits, '0');
    
    // Increment the next number for future invoices (async)
    this.updateInvoiceSettings(settings.id, { next_number: nextNumber + 1 });
    
    // Add date variables if needed in prefix/suffix
    const prefix = settings.number_prefix
      .replace('{YYYY}', format(now, 'yyyy'))
      .replace('{YY}', format(now, 'yy'))
      .replace('{MM}', format(now, 'MM'))
      .replace('{DD}', format(now, 'dd'));
      
    const suffix = (settings.number_suffix || '')
      .replace('{YYYY}', format(now, 'yyyy'))
      .replace('{YY}', format(now, 'yy'))
      .replace('{MM}', format(now, 'MM'))
      .replace('{DD}', format(now, 'dd'));
    
    return `${prefix}${formattedNumber}${suffix}`;
  },
  
  /**
   * Map database invoice settings to the InvoiceSettings interface with camelCase aliases
   * @param data The database invoice settings
   */
  mapInvoiceSettings(data: any): InvoiceSettings {
    return {
      ...data,
      // Add camelCase aliases
      branchId: data.branch_id,
      numberPrefix: data.number_prefix,
      numberSuffix: data.number_suffix,
      nextNumber: data.next_number,
      numberDigits: data.number_digits,
      resetFrequency: data.reset_frequency,
      lastResetDate: data.last_reset_date,
      defaultTaxEnabled: data.default_tax_enabled,
      defaultTaxType: data.default_tax_type,
      defaultTaxRate: data.default_tax_rate,
      defaultGstTreatment: data.default_gst_treatment,
      defaultPlaceOfSupply: data.default_place_of_supply,
      defaultTerms: data.default_terms,
      defaultNotes: data.default_notes,
      showLogo: data.show_logo,
      showSignature: data.show_signature,
      signatureImageUrl: data.signature_image_url,
      companyName: data.company_name,
      companyAddress: data.company_address,
      companyPhone: data.company_phone,
      companyEmail: data.company_email,
      companyWebsite: data.company_website,
      companyGstNumber: data.company_gst_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  /**
   * HSN Code Management
   */
  
  /**
   * Get all HSN codes
   */
  async getHSNCodes(): Promise<HSNCode[]> {
    try {
      const { data, error } = await supabase
        .from('hsn_codes')
        .select('*')
        .order('code');
        
      if (error) throw error;
      
      return (data || []).map(this.mapHSNCode);
    } catch (error) {
      console.error('Error fetching HSN codes:', error);
      return [];
    }
  },
  
  /**
   * Get HSN code by ID
   * @param id The HSN code ID
   */
  async getHSNCodeById(id: string): Promise<HSNCode | null> {
    try {
      const { data, error } = await supabase
        .from('hsn_codes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return this.mapHSNCode(data);
    } catch (error) {
      console.error('Error fetching HSN code:', error);
      return null;
    }
  },
  
  /**
   * Create a new HSN code
   * @param hsnCode The HSN code to create
   */
  async createHSNCode(hsnCode: Omit<HSNCode, 'id' | 'created_at' | 'updated_at'>): Promise<HSNCode | null> {
    try {
      const { data, error } = await supabase
        .from('hsn_codes')
        .insert({
          code: hsnCode.code,
          description: hsnCode.description,
          gst_rate: hsnCode.gst_rate || hsnCode.gstRate,
          is_service: hsnCode.is_service || hsnCode.isService,
          is_active: hsnCode.is_active !== undefined ? hsnCode.is_active : 
                    (hsnCode.isActive !== undefined ? hsnCode.isActive : true)
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapHSNCode(data);
    } catch (error) {
      console.error('Error creating HSN code:', error);
      return null;
    }
  },
  
  /**
   * Update an HSN code
   * @param id The HSN code ID
   * @param updates The HSN code updates
   */
  async updateHSNCode(id: string, updates: Partial<HSNCode>): Promise<HSNCode | null> {
    try {
      // Remove camelCase aliases
      const { gstRate, isService, isActive, createdAt, updatedAt, ...dbUpdates } = updates;
      
      // Add snake_case versions of camelCase properties
      if (gstRate !== undefined) dbUpdates.gst_rate = gstRate;
      if (isService !== undefined) dbUpdates.is_service = isService;
      if (isActive !== undefined) dbUpdates.is_active = isActive;
      
      // Add updated timestamp
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('hsn_codes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapHSNCode(data);
    } catch (error) {
      console.error('Error updating HSN code:', error);
      return null;
    }
  },
  
  /**
   * Delete an HSN code
   * @param id The HSN code ID
   */
  async deleteHSNCode(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('hsn_codes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting HSN code:', error);
      return false;
    }
  },
  
  /**
   * Map database HSN code to the HSNCode interface with camelCase aliases
   * @param data The database HSN code
   */
  mapHSNCode(data: any): HSNCode {
    return {
      ...data,
      // Add camelCase aliases
      gstRate: data.gst_rate,
      isService: data.is_service,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  /**
   * Tax Profile Management
   */
  
  /**
   * Get all tax profiles
   */
  async getTaxProfiles(): Promise<TaxProfile[]> {
    try {
      const { data, error } = await supabase
        .from('tax_profiles')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return (data || []).map(this.mapTaxProfile);
    } catch (error) {
      console.error('Error fetching tax profiles:', error);
      return [];
    }
  },
  
  /**
   * Get tax profile by ID
   * @param id The tax profile ID
   */
  async getTaxProfileById(id: string): Promise<TaxProfile | null> {
    try {
      const { data, error } = await supabase
        .from('tax_profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return this.mapTaxProfile(data);
    } catch (error) {
      console.error('Error fetching tax profile:', error);
      return null;
    }
  },
  
  /**
   * Create a new tax profile
   * @param taxProfile The tax profile to create
   */
  async createTaxProfile(taxProfile: Omit<TaxProfile, 'id' | 'created_at' | 'updated_at'>): Promise<TaxProfile | null> {
    try {
      const { data, error } = await supabase
        .from('tax_profiles')
        .insert({
          name: taxProfile.name,
          description: taxProfile.description,
          tax_type: taxProfile.tax_type || taxProfile.taxType,
          tax_rate: taxProfile.tax_rate || taxProfile.taxRate,
          hsn_code: taxProfile.hsn_code || taxProfile.hsnCode,
          is_default: taxProfile.is_default !== undefined ? taxProfile.is_default : 
                     (taxProfile.isDefault !== undefined ? taxProfile.isDefault : false),
          applies_to: taxProfile.applies_to || taxProfile.appliesTo,
          is_active: taxProfile.is_active !== undefined ? taxProfile.is_active : 
                    (taxProfile.isActive !== undefined ? taxProfile.isActive : true)
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is set as default, update other profiles
      if (data.is_default) {
        await this.updateDefaultTaxProfile(data.id);
      }
      
      return this.mapTaxProfile(data);
    } catch (error) {
      console.error('Error creating tax profile:', error);
      return null;
    }
  },
  
  /**
   * Update a tax profile
   * @param id The tax profile ID
   * @param updates The tax profile updates
   */
  async updateTaxProfile(id: string, updates: Partial<TaxProfile>): Promise<TaxProfile | null> {
    try {
      // Remove camelCase aliases
      const { 
        taxType, taxRate, hsnCode, isDefault, appliesTo, isActive, 
        createdAt, updatedAt, ...dbUpdates 
      } = updates;
      
      // Add snake_case versions of camelCase properties
      if (taxType !== undefined) dbUpdates.tax_type = taxType;
      if (taxRate !== undefined) dbUpdates.tax_rate = taxRate;
      if (hsnCode !== undefined) dbUpdates.hsn_code = hsnCode;
      if (isDefault !== undefined) dbUpdates.is_default = isDefault;
      if (appliesTo !== undefined) dbUpdates.applies_to = appliesTo;
      if (isActive !== undefined) dbUpdates.is_active = isActive;
      
      // Add updated timestamp
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('tax_profiles')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is set as default, update other profiles
      if (data.is_default) {
        await this.updateDefaultTaxProfile(data.id);
      }
      
      return this.mapTaxProfile(data);
    } catch (error) {
      console.error('Error updating tax profile:', error);
      return null;
    }
  },
  
  /**
   * Update default tax profile
   * @param defaultId The ID of the default tax profile
   */
  async updateDefaultTaxProfile(defaultId: string): Promise<void> {
    try {
      // Set all other profiles as non-default
      await supabase
        .from('tax_profiles')
        .update({ is_default: false })
        .neq('id', defaultId);
    } catch (error) {
      console.error('Error updating default tax profile:', error);
    }
  },
  
  /**
   * Delete a tax profile
   * @param id The tax profile ID
   */
  async deleteTaxProfile(id: string): Promise<boolean> {
    try {
      // Check if this is the default profile
      const { data } = await supabase
        .from('tax_profiles')
        .select('is_default')
        .eq('id', id)
        .single();
        
      if (data?.is_default) {
        throw new Error('Cannot delete the default tax profile');
      }
      
      const { error } = await supabase
        .from('tax_profiles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting tax profile:', error);
      return false;
    }
  },
  
  /**
   * Map database tax profile to the TaxProfile interface with camelCase aliases
   * @param data The database tax profile
   */
  mapTaxProfile(data: any): TaxProfile {
    return {
      ...data,
      // Add camelCase aliases
      taxType: data.tax_type,
      taxRate: data.tax_rate,
      hsnCode: data.hsn_code,
      isDefault: data.is_default,
      appliesTo: data.applies_to,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  /**
   * Invoice Template Management
   */
  
  /**
   * Get all invoice templates
   */
  async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return (data || []).map(this.mapInvoiceTemplate);
    } catch (error) {
      console.error('Error fetching invoice templates:', error);
      return [];
    }
  },
  
  /**
   * Get invoice template by ID
   * @param id The invoice template ID
   */
  async getInvoiceTemplateById(id: string): Promise<InvoiceTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return this.mapInvoiceTemplate(data);
    } catch (error) {
      console.error('Error fetching invoice template:', error);
      return null;
    }
  },
  
  /**
   * Create a new invoice template
   * @param template The invoice template to create
   */
  async createInvoiceTemplate(template: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<InvoiceTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .insert({
          name: template.name,
          description: template.description,
          html_content: template.html_content || template.htmlContent,
          css_content: template.css_content || template.cssContent,
          is_default: template.is_default !== undefined ? template.is_default : 
                     (template.isDefault !== undefined ? template.isDefault : false),
          is_active: template.is_active !== undefined ? template.is_active : 
                    (template.isActive !== undefined ? template.isActive : true)
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is set as default, update other templates
      if (data.is_default) {
        await this.updateDefaultTemplate(data.id);
      }
      
      return this.mapInvoiceTemplate(data);
    } catch (error) {
      console.error('Error creating invoice template:', error);
      return null;
    }
  },
  
  /**
   * Update an invoice template
   * @param id The invoice template ID
   * @param updates The invoice template updates
   */
  async updateInvoiceTemplate(id: string, updates: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null> {
    try {
      // Remove camelCase aliases
      const { 
        htmlContent, cssContent, isDefault, isActive, 
        createdAt, updatedAt, ...dbUpdates 
      } = updates;
      
      // Add snake_case versions of camelCase properties
      if (htmlContent !== undefined) dbUpdates.html_content = htmlContent;
      if (cssContent !== undefined) dbUpdates.css_content = cssContent;
      if (isDefault !== undefined) dbUpdates.is_default = isDefault;
      if (isActive !== undefined) dbUpdates.is_active = isActive;
      
      // Add updated timestamp
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('invoice_templates')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is set as default, update other templates
      if (data.is_default) {
        await this.updateDefaultTemplate(data.id);
      }
      
      return this.mapInvoiceTemplate(data);
    } catch (error) {
      console.error('Error updating invoice template:', error);
      return null;
    }
  },
  
  /**
   * Update default template
   * @param defaultId The ID of the default template
   */
  async updateDefaultTemplate(defaultId: string): Promise<void> {
    try {
      // Set all other templates as non-default
      await supabase
        .from('invoice_templates')
        .update({ is_default: false })
        .neq('id', defaultId);
    } catch (error) {
      console.error('Error updating default template:', error);
    }
  },
  
  /**
   * Delete an invoice template
   * @param id The invoice template ID
   */
  async deleteInvoiceTemplate(id: string): Promise<boolean> {
    try {
      // Check if this is the default template
      const { data } = await supabase
        .from('invoice_templates')
        .select('is_default')
        .eq('id', id)
        .single();
        
      if (data?.is_default) {
        throw new Error('Cannot delete the default invoice template');
      }
      
      const { error } = await supabase
        .from('invoice_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting invoice template:', error);
      return false;
    }
  },
  
  /**
   * Map database invoice template to the InvoiceTemplate interface with camelCase aliases
   * @param data The database invoice template
   */
  mapInvoiceTemplate(data: any): InvoiceTemplate {
    return {
      ...data,
      // Add camelCase aliases
      htmlContent: data.html_content,
      cssContent: data.css_content,
      isDefault: data.is_default,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
};

export default invoiceSettingsService;
