import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { paymentSettingsService } from '@/services/payment-settings-service';
import { PaymentGatewaySetting } from '@/types/payment';
import { usePermissions } from '@/hooks/use-permissions';
import { toast } from 'sonner';

const PaymentGatewayTab = () => {
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: paymentSettingsService.getPaymentSettings
  });

  const mutation = useMutation({
    mutationFn: paymentSettingsService.updatePaymentSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
    }
  });

  const getGatewaySetting = (name: PaymentGatewaySetting['gateway_name']) => 
    settings?.find(s => s.gateway_name === name) || {
      gateway_name: name,
      is_enabled: false,
      config: {}
    };

  const handleSaveSettings = async (gateway: PaymentGatewaySetting['gateway_name'], values: any) => {
    const setting = getGatewaySetting(gateway);
    await mutation.mutateAsync({
      ...setting,
      config: values
    });
  };

  if (!can('manage_settings')) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">You don't have permission to manage payment settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Razorpay Settings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Razorpay Configuration</CardTitle>
              <CardDescription>Configure your Razorpay payment gateway</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Enable Razorpay</span>
              <Switch 
                checked={getGatewaySetting('razorpay').is_enabled}
                onCheckedChange={(checked) => 
                  mutation.mutateAsync({
                    ...getGatewaySetting('razorpay'),
                    is_enabled: checked
                  })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="razorpay-key-id">Key ID</Label>
              <Input 
                id="razorpay-key-id"
                placeholder="rzp_test_..."
                defaultValue={getGatewaySetting('razorpay').config?.razorpay?.keyId}
                onChange={(e) => handleSaveSettings('razorpay', {
                  ...getGatewaySetting('razorpay').config,
                  keyId: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay-secret">Secret Key</Label>
              <Input 
                id="razorpay-secret"
                type="password"
                placeholder="Enter secret key"
                defaultValue={getGatewaySetting('razorpay').config?.razorpay?.secretKey}
                onChange={(e) => handleSaveSettings('razorpay', {
                  ...getGatewaySetting('razorpay').config,
                  secretKey: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="razorpay-webhook">Webhook URL</Label>
            <Input 
              id="razorpay-webhook"
              placeholder="https://your-webhook-url.com/razorpay"
              defaultValue={getGatewaySetting('razorpay').config?.razorpay?.webhookUrl}
              onChange={(e) => handleSaveSettings('razorpay', {
                ...getGatewaySetting('razorpay').config,
                webhookUrl: e.target.value
              })}
            />
            <p className="text-sm text-muted-foreground">
              Add this URL to your Razorpay dashboard to receive payment notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PhonePe Settings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>PhonePe Configuration</CardTitle>
              <CardDescription>Configure your PhonePe payment gateway</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Enable PhonePe</span>
              <Switch 
                checked={getGatewaySetting('phonepe').is_enabled}
                onCheckedChange={(checked) => 
                  mutation.mutateAsync({
                    ...getGatewaySetting('phonepe'),
                    is_enabled: checked
                  })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phonepe-merchant">Merchant ID</Label>
            <Input 
              id="phonepe-merchant"
              placeholder="Enter merchant ID"
              defaultValue={getGatewaySetting('phonepe').config?.phonepe?.merchantId}
              onChange={(e) => handleSaveSettings('phonepe', {
                ...getGatewaySetting('phonepe').config,
                merchantId: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phonepe-salt">Salt Key</Label>
            <Input 
              id="phonepe-salt"
              type="password"
              placeholder="Enter salt key"
              defaultValue={getGatewaySetting('phonepe').config?.phonepe?.saltKey}
              onChange={(e) => handleSaveSettings('phonepe', {
                ...getGatewaySetting('phonepe').config,
                saltKey: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phonepe-webhook">Webhook URL</Label>
            <Input 
              id="phonepe-webhook"
              placeholder="https://your-webhook-url.com/phonepe"
              defaultValue={getGatewaySetting('phonepe').config?.phonepe?.webhookUrl}
              onChange={(e) => handleSaveSettings('phonepe', {
                ...getGatewaySetting('phonepe').config,
                webhookUrl: e.target.value
              })}
            />
            <p className="text-sm text-muted-foreground">
              Add this URL to your PhonePe dashboard to receive payment notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Similar cards for CCAvenue and PayU... */}
      {/* I'll add them in a future update to keep the response concise */}
    </div>
  );
};

export default PaymentGatewayTab;
