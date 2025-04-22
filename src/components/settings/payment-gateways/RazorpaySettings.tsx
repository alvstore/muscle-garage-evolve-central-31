
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PaymentGatewaySetting } from '@/types/payment';

interface RazorpaySettingsProps {
  settings: PaymentGatewaySetting;
  onUpdate: (settings: Partial<PaymentGatewaySetting>) => void;
  disabled?: boolean;
}

export const RazorpaySettings = ({ settings, onUpdate, disabled }: RazorpaySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Razorpay Configuration</CardTitle>
            <CardDescription>Connect your Razorpay account for payment processing</CardDescription>
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
            <Label htmlFor="razorpay-key-id">Key ID</Label>
            <Input 
              id="razorpay-key-id"
              value={settings.config?.razorpay?.keyId || ''}
              onChange={(e) => onUpdate({
                config: {
                  ...settings.config,
                  razorpay: {
                    ...settings.config?.razorpay,
                    keyId: e.target.value
                  }
                }
              })}
              disabled={disabled || !settings.is_enabled}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="razorpay-secret">Secret Key</Label>
            <Input 
              id="razorpay-secret"
              type="password"
              value={settings.config?.razorpay?.secretKey || ''}
              onChange={(e) => onUpdate({
                config: {
                  ...settings.config,
                  razorpay: {
                    ...settings.config?.razorpay,
                    secretKey: e.target.value
                  }
                }
              })}
              disabled={disabled || !settings.is_enabled}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="razorpay-webhook">Webhook URL</Label>
          <Input 
            id="razorpay-webhook"
            value={settings.config?.razorpay?.webhookUrl || ''}
            onChange={(e) => onUpdate({
              config: {
                ...settings.config,
                razorpay: {
                  ...settings.config?.razorpay,
                  webhookUrl: e.target.value
                }
              }
            })}
            disabled={disabled || !settings.is_enabled}
            required
          />
          <p className="text-sm text-muted-foreground">Paste this URL in your Razorpay dashboard</p>
        </div>
      </CardContent>
    </Card>
  );
};
