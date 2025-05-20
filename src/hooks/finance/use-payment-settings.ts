
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/settings/use-branches';

export interface PaymentGatewaySettings {
  id: string;
  gateway: string;
  config: {
    key_id?: string;
    key_secret?: string;
    merchant_id?: string;
    access_code?: string;
    working_key?: string;
    salt?: string;
    merchant_key?: string;
  };
  is_active: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  created_at: string;
  updated_at: string;
}

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentGatewaySettings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('payment_gateway_settings')
        .select('*');
        
      if (error) throw error;
      
      setSettings(data as PaymentGatewaySettings[]);
    } catch (err: any) {
      console.error('Error fetching payment gateway settings:', err);
      setError(err.message || 'Failed to load payment settings');
      toast.error('Failed to load payment gateway settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGatewaySettings = async (
    gatewayId: string, 
    updatedConfig: Partial<PaymentGatewaySettings>
  ) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('payment_gateway_settings')
        .update(updatedConfig)
        .eq('id', gatewayId);
        
      if (error) throw error;
      
      toast.success('Payment gateway settings updated successfully');
      fetchSettings();
      return true;
    } catch (err: any) {
      console.error('Error updating payment gateway settings:', err);
      toast.error(err.message || 'Failed to update payment settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createGatewaySettings = async (newSettings: Omit<PaymentGatewaySettings, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('payment_gateway_settings')
        .insert([newSettings])
        .select();
        
      if (error) throw error;
      
      toast.success('Payment gateway added successfully');
      fetchSettings();
      return data?.[0] as PaymentGatewaySettings;
    } catch (err: any) {
      console.error('Error adding payment gateway:', err);
      toast.error(err.message || 'Failed to add payment gateway');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateGatewaySettings,
    createGatewaySettings
  };
}
