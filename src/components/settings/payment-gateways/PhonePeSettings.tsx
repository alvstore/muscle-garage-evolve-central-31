
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PaymentGatewaySetting } from '@/types/payment';

interface PhonePeSettingsProps {
  settings: PaymentGatewaySetting;
  onUpdate: (settings: Partial<PaymentGatewaySetting>) => void;
  disabled?: boolean;
}

export const PhonePeSettings = ({ settings, onUpdate, disabled }: PhonePeSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>PhonePe Configuration</CardTitle>
            <CardDescription>Connect your PhonePe account for payment processing</CardDescription>
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
          <Label htmlFor="phonepe-merchant">Merchant ID</Label>
          <Input 
            id="phonepe-merchant"
            value={settings.config?.phonepe?.merchantId || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                phonepe: {
                  ...settings.config?.phonepe,
                  merchantId: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phonepe-salt">Salt Key</Label>
          <Input 
            id="phonepe-salt"
            type="password"
            value={settings.config?.phonepe?.saltKey || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                phonepe: {
                  ...settings.config?.phonepe,
                  saltKey: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phonepe-webhook">Webhook URL</Label>
          <Input 
            id="phonepe-webhook"
            value={settings.config?.phonepe?.webhookUrl || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                phonepe: {
                  ...settings.config?.phonepe,
                  webhookUrl: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
          <p className="text-sm text-muted-foreground">Paste this URL in your PhonePe dashboard</p>
        </div>
      </CardContent>
    </Card>
  );
};
