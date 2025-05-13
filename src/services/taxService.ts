
import { Invoice, InvoiceItem, TaxDetail, GSTTreatment } from '@/types/finance';
import { HSNCode, TaxProfile } from '@/types/invoiceSettings';
import invoiceSettingsService from './invoiceSettingsService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Tax Service for handling GST and other tax calculations
 */
export const taxService = {
  /**
   * Calculate GST for a given invoice
   * @param invoice The invoice to calculate GST for
   * @param gstTreatment The GST treatment type
   * @param placeOfSupply The place of supply (state code)
   * @param isIntraState Whether the transaction is within the same state
   */
  calculateGST(
    invoice: Invoice, 
    gstTreatment: GSTTreatment = 'registered_business',
    placeOfSupply: string = '',
    isIntraState: boolean = true
  ): Invoice {
    // Create a copy of the invoice to avoid mutating the original
    const updatedInvoice: Invoice = { ...invoice };
    
    // Calculate subtotal if not provided
    if (!updatedInvoice.subtotal) {
      updatedInvoice.subtotal = this.calculateSubtotal(updatedInvoice.items || []);
    }
    
    // Set default tax type to GST
    updatedInvoice.tax_type = 'gst';
    updatedInvoice.gst_treatment = gstTreatment;
    updatedInvoice.place_of_supply = placeOfSupply;
    
    // Initialize tax details array if not present
    if (!updatedInvoice.tax_details) {
      updatedInvoice.tax_details = [];
    }
    
    // Calculate GST based on treatment type
    switch (gstTreatment) {
      case 'registered_business':
        return this.calculateRegisteredBusinessGST(updatedInvoice, isIntraState);
      case 'unregistered_business':
      case 'consumer':
        return this.calculateConsumerGST(updatedInvoice, isIntraState);
      case 'overseas':
        return this.calculateOverseasGST(updatedInvoice);
      case 'sez':
        return this.calculateSEZGST(updatedInvoice);
      case 'deemed_export':
        return this.calculateDeemedExportGST(updatedInvoice);
      default:
        return updatedInvoice;
    }
  },
  
  /**
   * Calculate GST for registered business
   * For B2B transactions, GST is fully applicable
   */
  calculateRegisteredBusinessGST(invoice: Invoice, isIntraState: boolean): Invoice {
    const updatedInvoice = { ...invoice };
    const items = [...(updatedInvoice.items || [])];
    
    // Reset tax details
    updatedInvoice.tax_details = [];
    let totalTaxAmount = 0;
    
    // Process each item
    updatedInvoice.items = items.map(item => {
      const updatedItem = { ...item };
      
      // Default GST rate if not specified
      const gstRate = updatedItem.gst_rate || 18; // Default 18% GST
      
      if (isIntraState) {
        // For intra-state: Split into CGST and SGST
        const halfRate = gstRate / 2;
        const halfAmount = (updatedItem.price * updatedItem.quantity * halfRate) / 100;
        
        updatedItem.cgst = halfAmount;
        updatedItem.sgst = halfAmount;
        updatedItem.igst = 0;
        
        // Add to tax details
        updatedInvoice.tax_details?.push(
          {
            tax_name: 'CGST',
            tax_rate: halfRate,
            tax_amount: halfAmount,
            taxName: 'CGST',
            taxRate: halfRate,
            taxAmount: halfAmount
          },
          {
            tax_name: 'SGST',
            tax_rate: halfRate,
            tax_amount: halfAmount,
            taxName: 'SGST',
            taxRate: halfRate,
            taxAmount: halfAmount
          }
        );
        
        totalTaxAmount += halfAmount * 2;
      } else {
        // For inter-state: Use IGST
        const igstAmount = (updatedItem.price * updatedItem.quantity * gstRate) / 100;
        
        updatedItem.cgst = 0;
        updatedItem.sgst = 0;
        updatedItem.igst = igstAmount;
        
        // Add to tax details
        updatedInvoice.tax_details?.push({
          tax_name: 'IGST',
          tax_rate: gstRate,
          tax_amount: igstAmount,
          taxName: 'IGST',
          taxRate: gstRate,
          taxAmount: igstAmount
        });
        
        totalTaxAmount += igstAmount;
      }
      
      // Update item tax amount
      updatedItem.tax_amount = (updatedItem.cgst || 0) + (updatedItem.sgst || 0) + (updatedItem.igst || 0);
      updatedItem.taxAmount = updatedItem.tax_amount;
      
      return updatedItem;
    });
    
    // Update invoice tax amount
    updatedInvoice.tax_amount = totalTaxAmount;
    updatedInvoice.taxAmount = totalTaxAmount;
    
    // Update total amount
    updatedInvoice.amount = (updatedInvoice.subtotal || 0) + totalTaxAmount;
    
    return updatedInvoice;
  },
  
  /**
   * Calculate GST for consumers and unregistered businesses
   */
  calculateConsumerGST(invoice: Invoice, isIntraState: boolean): Invoice {
    // For consumers, GST calculation is the same as for registered businesses
    return this.calculateRegisteredBusinessGST(invoice, isIntraState);
  },
  
  /**
   * Calculate GST for overseas customers
   * For export of services, generally zero-rated
   */
  calculateOverseasGST(invoice: Invoice): Invoice {
    const updatedInvoice = { ...invoice };
    
    // For exports, GST is typically zero-rated
    updatedInvoice.tax_rate = 0;
    updatedInvoice.taxRate = 0;
    updatedInvoice.tax_amount = 0;
    updatedInvoice.taxAmount = 0;
    updatedInvoice.tax_details = [];
    
    // Update items
    if (updatedInvoice.items) {
      updatedInvoice.items = updatedInvoice.items.map(item => ({
        ...item,
        tax_rate: 0,
        taxRate: 0,
        tax_amount: 0,
        taxAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      }));
    }
    
    return updatedInvoice;
  },
  
  /**
   * Calculate GST for Special Economic Zones
   * SEZ supplies are treated as zero-rated
   */
  calculateSEZGST(invoice: Invoice): Invoice {
    // SEZ supplies are zero-rated like exports
    return this.calculateOverseasGST(invoice);
  },
  
  /**
   * Calculate GST for deemed exports
   */
  calculateDeemedExportGST(invoice: Invoice): Invoice {
    // Deemed exports are also zero-rated
    return this.calculateOverseasGST(invoice);
  },
  
  /**
   * Calculate the subtotal of an invoice from its items
   */
  calculateSubtotal(items: InvoiceItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },
  
  /**
   * Get GST breakdown for display
   */
  getGSTBreakdown(invoice: Invoice): { label: string; value: number }[] {
    const breakdown: { label: string; value: number }[] = [];
    
    if (!invoice.tax_details || invoice.tax_details.length === 0) {
      return breakdown;
    }
    
    // Group by tax name
    const taxMap = new Map<string, number>();
    
    invoice.tax_details.forEach(tax => {
      const currentAmount = taxMap.get(tax.tax_name) || 0;
      taxMap.set(tax.tax_name, currentAmount + tax.tax_amount);
    });
    
    // Convert map to array
    taxMap.forEach((value, key) => {
      breakdown.push({
        label: key,
        value: value
      });
    });
    
    return breakdown;
  },
  
  /**
   * Format HSN/SAC code
   */
  formatHSNSACCode(code: string): string {
    // Remove non-numeric characters
    const numericCode = code.replace(/\D/g, '');
    
    // Ensure it's at least 4-8 digits as per GST rules
    if (numericCode.length < 4) {
      return numericCode.padStart(4, '0');
    }
    
    return numericCode;
  },
  
  /**
   * Validate GST Number (GSTIN)
   */
  validateGSTIN(gstin: string): boolean {
    // Basic GSTIN validation - 15 characters with specific format
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  },
  
  /**
   * Get state code from GSTIN
   */
  getStateCodeFromGSTIN(gstin: string): string {
    if (gstin && gstin.length >= 2) {
      return gstin.substring(0, 2);
    }
    return '';
  },

  /**
   * Get tax profile for an item based on HSN/SAC code
   * @param hsnSacCode The HSN/SAC code
   */
  async getTaxProfileByHSNCode(hsnSacCode: string): Promise<TaxProfile | null> {
    try {
      // First check if we have a tax profile linked to this HSN code
      const { data: profileData, error: profileError } = await supabase
        .from('tax_profiles')
        .select('*')
        .eq('hsn_code', hsnSacCode)
        .eq('is_active', true)
        .single();
        
      if (!profileError && profileData) {
        return invoiceSettingsService.mapTaxProfile(profileData);
      }
      
      // If no profile, check if we have the HSN code itself
      const { data: hsnData, error: hsnError } = await supabase
        .from('hsn_codes')
        .select('*')
        .eq('code', hsnSacCode)
        .eq('is_active', true)
        .single();
        
      if (!hsnError && hsnData) {
        // Create a temporary tax profile based on the HSN code
        return {
          id: 'temp_' + hsnData.id,
          name: `HSN ${hsnData.code}`,
          description: hsnData.description,
          tax_type: 'gst',
          tax_rate: hsnData.gst_rate,
          hsn_code: hsnData.code,
          is_default: false,
          applies_to: hsnData.is_service ? 'services' : 'products',
          is_active: true,
          taxType: 'gst',
          taxRate: hsnData.gst_rate,
          hsnCode: hsnData.code,
          isDefault: false,
          appliesTo: hsnData.is_service ? 'services' : 'products',
          isActive: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting tax profile by HSN code:', error);
      return null;
    }
  },
  
  /**
   * Apply tax profile to an invoice item
   * @param item The invoice item
   * @param profile The tax profile to apply
   * @param isIntraState Whether the transaction is intra-state
   */
  applyTaxProfileToItem(item: InvoiceItem, profile: TaxProfile, isIntraState: boolean): InvoiceItem {
    const updatedItem = { ...item };
    
    // Set tax type and rate
    updatedItem.tax_type = profile.tax_type;
    updatedItem.taxType = profile.tax_type;
    updatedItem.gst_rate = profile.tax_rate;
    updatedItem.gstRate = profile.tax_rate;
    updatedItem.hsn_sac_code = profile.hsn_code;
    updatedItem.hsnSacCode = profile.hsn_code;
    
    // Calculate tax amount based on tax type
    if (profile.tax_type === 'gst') {
      const gstRate = profile.tax_rate;
      const baseAmount = updatedItem.price * updatedItem.quantity;
      
      if (isIntraState) {
        // For intra-state: Split into CGST and SGST
        const halfRate = gstRate / 2;
        const halfAmount = (baseAmount * halfRate) / 100;
        
        updatedItem.cgst = halfAmount;
        updatedItem.sgst = halfAmount;
        updatedItem.igst = 0;
        updatedItem.tax_amount = halfAmount * 2;
        updatedItem.taxAmount = halfAmount * 2;
      } else {
        // For inter-state: Use IGST
        const igstAmount = (baseAmount * gstRate) / 100;
        
        updatedItem.cgst = 0;
        updatedItem.sgst = 0;
        updatedItem.igst = igstAmount;
        updatedItem.tax_amount = igstAmount;
        updatedItem.taxAmount = igstAmount;
      }
    } else {
      // For other tax types or no tax
      updatedItem.tax_amount = 0;
      updatedItem.taxAmount = 0;
      updatedItem.cgst = 0;
      updatedItem.sgst = 0;
      updatedItem.igst = 0;
    }
    
    return updatedItem;
  },
  
  /**
   * Apply invoice settings to an invoice
   * @param invoice The invoice to apply settings to
   * @param settings The invoice settings
   */
  async applyInvoiceSettings(invoice: Invoice): Promise<Invoice> {
    try {
      // Get invoice settings
      const settings = await invoiceSettingsService.getInvoiceSettings(invoice.branch_id);
      if (!settings) return invoice;
      
      const updatedInvoice = { ...invoice };
      
      // Apply default tax settings if not specified
      if (updatedInvoice.tax_type === undefined) {
        updatedInvoice.tax_type = settings.default_tax_type;
        updatedInvoice.taxType = settings.default_tax_type;
      }
      
      if (updatedInvoice.gst_treatment === undefined) {
        updatedInvoice.gst_treatment = settings.default_gst_treatment;
        updatedInvoice.gstTreatment = settings.default_gst_treatment;
      }
      
      if (updatedInvoice.place_of_supply === undefined) {
        updatedInvoice.place_of_supply = settings.default_place_of_supply;
        updatedInvoice.placeOfSupply = settings.default_place_of_supply;
      }
      
      // Apply default terms and notes
      if (!updatedInvoice.terms && settings.default_terms) {
        updatedInvoice.terms = settings.default_terms;
      }
      
      if (!updatedInvoice.notes && settings.default_notes) {
        updatedInvoice.notes = settings.default_notes;
      }
      
      // Generate invoice number if not provided
      if (!updatedInvoice.invoice_number) {
        updatedInvoice.invoice_number = invoiceSettingsService.generateInvoiceNumber(settings);
        updatedInvoice.invoiceNumber = updatedInvoice.invoice_number;
      }
      
      // Apply company information
      updatedInvoice.company_name = settings.company_name;
      updatedInvoice.companyName = settings.company_name;
      
      if (settings.company_address) {
        updatedInvoice.company_address = settings.company_address;
        updatedInvoice.companyAddress = settings.company_address;
      }
      
      if (settings.company_gst_number) {
        updatedInvoice.company_gst_number = settings.company_gst_number;
        updatedInvoice.companyGstNumber = settings.company_gst_number;
      }
      
      return updatedInvoice;
    } catch (error) {
      console.error('Error applying invoice settings:', error);
      return invoice;
    }
  },
  
  /**
   * Get default tax profile for new items
   */
  async getDefaultTaxProfile(): Promise<TaxProfile | null> {
    try {
      const { data, error } = await supabase
        .from('tax_profiles')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();
        
      if (error) throw error;
      
      return invoiceSettingsService.mapTaxProfile(data);
    } catch (error) {
      console.error('Error getting default tax profile:', error);
      
      // If no default profile, create a temporary one with standard GST
      return {
        id: 'temp_default',
        name: 'Standard GST',
        description: 'Default GST rate of 18%',
        tax_type: 'gst',
        tax_rate: 18,
        is_default: true,
        applies_to: 'both',
        is_active: true,
        taxType: 'gst',
        taxRate: 18,
        isDefault: true,
        appliesTo: 'both',
        isActive: true
      };
    }
  }
};

export default taxService;
