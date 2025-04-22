
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PaymentGatewaySetting } from '@/types/payment';

interface CCAvenueSettingsProps {
  settings: PaymentGatewaySetting;
  onUpdate: (settings: Partial<PaymentGatewaySetting>) => void;
  disabled?: boolean;
}

export const CCAvenueSettings = ({ settings, onUpdate, disabled }: CCAvenueSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>CCAvenue Configuration</CardTitle>
            <CardDescription>Connect your CCAvenue account for payment processing</CardDescription>
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ccavenue-access">Access Code</Label>
            <Input 
              id="ccavenue-access"
              value={settings.config?.ccavenue?.accessCode || ''}
              onChange={(e) => onUpdate({
                config: {
                  ...settings.config,
                  ccavenue: {
                    ...settings.config?.ccavenue,
                    accessCode: e.target.value
                  }
                }
              })}
              disabled={disabled || !settings.is_enabled}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ccavenue-working">Working Key</Label>
            <Input 
              id="ccavenue-working"
              type="password"
              value={settings.config?.ccavenue?.workingKey || ''}
              onChange={(e) => onUpdate({
                config: {
                  ...settings.config,
                  ccavenue: {
                    ...settings.config?.ccavenue,
                    workingKey: e.target.value
                  }
                }
              })}
              disabled={disabled || !settings.is_enabled}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ccavenue-merchant">Merchant ID</Label>
          <Input 
            id="ccavenue-merchant"
            value={settings.config?.ccavenue?.merchantId || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                ccavenue: {
                  ...settings.config?.ccavenue,
                  merchantId: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ccavenue-webhook">Webhook URL</Label>
          <Input 
            id="ccavenue-webhook"
            value={settings.config?.ccavenue?.webhookUrl || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                ccavenue: {
                  ...settings.config?.ccavenue,
                  webhookUrl: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
          <p className="text-sm text-muted-foreground">Paste this URL in your CCAvenue dashboard</p>
        </div>
      </CardContent>
    </Card>
  );
};
