
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PaymentGatewaySetting } from '@/types/payment';

interface PayUSettingsProps {
  settings: PaymentGatewaySetting;
  onUpdate: (settings: Partial<PaymentGatewaySetting>) => void;
  disabled?: boolean;
}

export const PayUSettings = ({ settings, onUpdate, disabled }: PayUSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>PayU Configuration</CardTitle>
            <CardDescription>Connect your PayU account for payment processing</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Enable</span>
            <Switch 
              checked={settings.is_enabled} 
              onCheckedChange={(checked) => onUpdate({ is_enabled: checked })}
              disabled={disabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payu-merchant">Merchant Key</Label>
          <Input 
            id="payu-merchant"
            value={settings.config?.payu?.merchantKey || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                payu: {
                  ...settings.config?.payu,
                  merchantKey: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payu-salt">Salt</Label>
          <Input 
            id="payu-salt"
            type="password"
            value={settings.config?.payu?.salt || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                payu: {
                  ...settings.config?.payu,
                  salt: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payu-webhook">Webhook URL</Label>
          <Input 
            id="payu-webhook"
            value={settings.config?.payu?.webhookUrl || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                payu: {
                  ...settings.config?.payu,
                  webhookUrl: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
          <p className="text-sm text-muted-foreground">Paste this URL in your PayU dashboard</p>
        </div>
      </CardContent>
    </Card>
  );
};
