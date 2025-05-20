
impor { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentGatewaySettings {
  id?: string;
  gateway: 'razorpay' | 'stripe';
  config: Record<string, any>;
  webhook_url?: string;
  webhook_secret?: string;
  is_active: boolean;
}

export const usePaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentGatewaySettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('payment_gateway_settings')
        .select('*');

      if (queryError) throw queryError;

      setSettings(data || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching payment settings:', err);
      toast.error(`Failed to load payment settings: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (gateway: string, newData: Partial<PaymentGatewaySettings>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      // Find if we already have settings for this gateway
      const existingSettings = settings.find(s => s.gateway === gateway);
      
      let response;
      if (existingSettings) {
        // Update existing settings
        const { data, error: updateError } = await supabase
          .from('payment_gateway_settings')
          .update(newData)
          .eq('id', existingSettings.id)
          .select();

        if (updateError) throw updateError;
        response = data?.[0];
      } else {
        // Insert new settings
        const { data, error: insertError } = await supabase
          .from('payment_gateway_settings')
          .insert({ gateway, ...newData })
          .select();

        if (insertError) throw insertError;
        response = data?.[0];
      }

      if (response) {
        // Update our local state
        const updatedSettings = [...settings];
        const index = updatedSettings.findIndex(s => s.gateway === gateway);
        
        if (index >= 0) {
          updatedSettings[index] = response;
        } else {
          updatedSettings.push(response);
        }
        
        setSettings(updatedSettings);
        toast.success('Payment settings saved successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error saving payment settings:', err);
      toast.error(`Failed to save payment settings: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGatewayStatus = async (gateway: string, isActive: boolean): Promise<boolean> => {
    const existingSettings = settings.find(s => s.gateway === gateway);
    if (!existingSettings) {
      toast.error(`No settings found for ${gateway}`);
      return false;
    }

    return await saveSettings(gateway, { is_active: isActive });
  };

  // Initialize settings
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    toggleGatewayStatus,
    getGatewaySettings: (gateway: string) => settings.find(s => s.gateway === gateway)
  };
};
