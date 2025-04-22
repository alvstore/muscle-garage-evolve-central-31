
import { supabase } from '@/services/supabaseClient';
import { PaymentGatewaySetting } from '@/types/payment';
import { toast } from 'sonner';

export const paymentSettingsService = {
  async getPaymentSettings(): Promise<PaymentGatewaySetting[]> {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*');

    if (error) {
      console.error('Error fetching payment settings:', error);
      throw error;
    }

    return data || [];
  },

  async updatePaymentSetting(setting: Partial<PaymentGatewaySetting>): Promise<PaymentGatewaySetting | null> {
    const { data, error } = await supabase
      .from('payment_settings')
      .upsert({
        gateway_name: setting.gateway_name,
        is_enabled: setting.is_enabled,
        config: setting.config,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating payment settings:', error);
      toast.error('Failed to update payment settings');
      throw error;
    }

    toast.success('Payment settings updated successfully');
    return data;
  }
};

