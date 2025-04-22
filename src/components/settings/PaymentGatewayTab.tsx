
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePermissions } from '@/hooks/use-permissions';
import { paymentSettingsService } from '@/services/payment-settings-service';
import { RazorpaySettings } from './payment-gateways/RazorpaySettings';
import { PhonePeSettings } from './payment-gateways/PhonePeSettings';
import { CCAvenueSettings } from './payment-gateways/CCAvenueSettings';
import { PayUSettings } from './payment-gateways/PayUSettings';
import { PaymentGatewaySetting } from '@/types/payment';

const PaymentGatewayTab = () => {
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: paymentSettingsService.getPaymentSettings
  });

  const mutation = useMutation({
    mutationFn: paymentSettingsService.updatePaymentSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
    }
  });

  const getGatewaySetting = (name: PaymentGatewaySetting['gateway_name']) => {
    const setting = settings.find(s => s.gateway_name === name);
    if (setting) {
      return setting;
    }
    
    // Return a default setting with empty values but matching the required type
    return {
      id: '',
      gateway_name: name,
      is_enabled: false,
      config: {},
      created_at: '',
      updated_at: ''
    } as PaymentGatewaySetting;
  };

  const handleUpdate = async (gateway: PaymentGatewaySetting['gateway_name'], updates: Partial<PaymentGatewaySetting>) => {
    const setting = getGatewaySetting(gateway);
    await mutation.mutateAsync({
      ...setting,
      ...updates
    });
  };

  if (!can('manage_settings')) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">You don't have permission to manage payment settings.</p>
      </div>
    );
  }

  const disabled = isLoading || mutation.isPending;

  return (
    <div className="space-y-6">
      <RazorpaySettings 
        settings={getGatewaySetting('razorpay')}
        onUpdate={(updates) => handleUpdate('razorpay', updates)}
        disabled={disabled}
      />
      
      <PhonePeSettings 
        settings={getGatewaySetting('phonepe')}
        onUpdate={(updates) => handleUpdate('phonepe', updates)}
        disabled={disabled}
      />
      
      <CCAvenueSettings 
        settings={getGatewaySetting('ccavenue')}
        onUpdate={(updates) => handleUpdate('ccavenue', updates)}
        disabled={disabled}
      />
      
      <PayUSettings 
        settings={getGatewaySetting('payu')}
        onUpdate={(updates) => handleUpdate('payu', updates)}
        disabled={disabled}
      />
    </div>
  );
};

export default PaymentGatewayTab;
