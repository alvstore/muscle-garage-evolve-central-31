
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IntegrationConfig } from "@/services/integrationService";

interface EmailProviderSettingsProps {
  config: IntegrationConfig;
  onUpdateConfig: (config: Partial<IntegrationConfig>) => void;
  onTest: () => Promise<void>;
  onSave: () => Promise<void>;
}

export const EmailProviderSettings = ({ 
  config, 
  onUpdateConfig, 
  onTest, 
  onSave 
}: EmailProviderSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Provider</CardTitle>
        <CardDescription>Configure your email service provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="provider">Email Provider</Label>
          <select 
            id="provider"
            className="w-full p-2 border rounded-md"
            value={config.provider || 'sendgrid'}
            onChange={(e) => onUpdateConfig({ provider: e.target.value })}
          >
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fromEmail">From Email Address</Label>
          <Input 
            id="fromEmail"
            placeholder="noreply@yourgym.com"
            value={config.fromEmail || ''}
            onChange={(e) => onUpdateConfig({ fromEmail: e.target.value })}
          />
        </div>
        
        {config.provider === 'sendgrid' && (
          <div className="space-y-2">
            <Label htmlFor="apiKey">SendGrid API Key</Label>
            <Input 
              id="apiKey"
              type="password"
              placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.apiKey || ''}
              onChange={(e) => onUpdateConfig({ apiKey: e.target.value })}
            />
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onTest}>Test Connection</Button>
          <Button onClick={onSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};
