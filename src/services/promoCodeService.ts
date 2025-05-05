
import { supabase } from '@/integrations/supabase/client';
import { PromoCode } from '@/types/marketing';
import { toast } from 'sonner';

export const promoCodeService = {
  // Fetch all promo codes
  async getPromoCodes(): Promise<PromoCode[]> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our PromoCode type
      const promoCodes = data.map(code => ({
        ...code,
        startDate: new Date(code.start_date),
        endDate: new Date(code.end_date),
        usageLimit: code.usage_limit || 0,
        currentUsage: code.current_usage || 0,
      }));
      
      return promoCodes;
    } catch (error: any) {
      console.error('Error fetching promo codes:', error);
      toast.error(error.message || 'Failed to fetch promo codes');
      return [];
    }
  },
  
  // Create a new promo code
  async createPromoCode(promoCode: Omit<PromoCode, 'id'>): Promise<PromoCode | null> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert([{
          code: promoCode.code.toUpperCase(),
          description: promoCode.description,
          type: promoCode.type,
          value: promoCode.value,
          status: promoCode.status,
          start_date: promoCode.start_date,
          end_date: promoCode.end_date,
          min_purchase_amount: promoCode.minPurchaseAmount,
          max_discount_amount: promoCode.maxDiscountAmount,
          usage_limit: promoCode.usageLimit,
          current_usage: 0,
          applicable_products: promoCode.applicableProducts || ['all'],
          applicable_memberships: promoCode.applicableMemberships || ['all'],
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Promo code created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      toast.error(error.message || 'Failed to create promo code');
      return null;
    }
  },
  
  // Update an existing promo code
  async updatePromoCode(id: string, promoCode: Partial<PromoCode>): Promise<PromoCode | null> {
    try {
      // Transform the data to match DB schema
      const updateData: any = {
        code: promoCode.code?.toUpperCase(),
        description: promoCode.description,
        type: promoCode.type,
        value: promoCode.value,
        status: promoCode.status,
        min_purchase_amount: promoCode.minPurchaseAmount,
        max_discount_amount: promoCode.maxDiscountAmount,
        usage_limit: promoCode.usageLimit,
      };
      
      // Only include date fields if they exist and are valid
      if (promoCode.start_date) updateData.start_date = promoCode.start_date;
      if (promoCode.end_date) updateData.end_date = promoCode.end_date;
      
      // Include arrays if they exist
      if (promoCode.applicableProducts) updateData.applicable_products = promoCode.applicableProducts;
      if (promoCode.applicableMemberships) updateData.applicable_memberships = promoCode.applicableMemberships;
      
      const { data, error } = await supabase
        .from('promo_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Promo code updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating promo code:', error);
      toast.error(error.message || 'Failed to update promo code');
      return null;
    }
  },
  
  // Delete a promo code
  async deletePromoCode(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Promo code deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      toast.error(error.message || 'Failed to delete promo code');
      return false;
    }
  },
  
  // Validate a promo code
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'active')
        .single();
        
      if (error) throw error;
      
      // Check if promo code is valid (not expired and not reached usage limit)
      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (now < startDate || now > endDate) {
        toast.error('This promo code has expired or is not yet active');
        return null;
      }
      
      if (data.usage_limit && data.current_usage >= data.usage_limit) {
        toast.error('This promo code has reached its usage limit');
        return null;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      toast.error('Invalid promo code');
      return null;
    }
  }
};
