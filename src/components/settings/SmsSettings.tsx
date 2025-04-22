import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntegrations } from '@/hooks/use-integrations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { SmsSettingsHeader } from './sms/SmsSettingsHeader';
import { NotificationSettings } from './sms/NotificationSettings';
import { IntegrationConfig } from '@/services/integrationService';

interface SmsSettingsProps {
  onClose: () => void;
}

const SmsSettings: React.FC<SmsSettingsProps> = ({ onClose }) => {
  const { config, updateConfig, test } = useIntegrations('sms');
  const [providerConfig, setProviderConfig] = useState<Partial<IntegrationConfig>>({
    provider: config?.provider || 'msg91',
    senderId: config?.senderId || ''
  });
  const [msg91AuthKey, setMsg91AuthKey] = useState(config?.msg91AuthKey || '');
  const [twilioAccountSid, setTwilioAccountSid] = useState(config?.twilioAccountSid || '');
  const [twilioAuthToken, setTwilioAuthToken] = useState(config?.twilioAuthToken || '');
  const [customApiUrl, setCustomApiUrl] = useState(config?.customApiUrl || '');
  const [customApiMethod, setCustomApiMethod] = useState<"GET" | "POST">(config?.customApiMethod || "GET");
  const [customApiHeaders, setCustomApiHeaders] = useState(config?.customApiHeaders || '');
  const [customApiParams, setCustomApiParams] = useState(config?.customApiParams || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleProviderChange = (provider: string) => {
    setProviderConfig({ ...providerConfig, provider });
  };

  const handleSenderIdChange = (senderId: string) => {
    setProviderConfig({ ...providerConfig, senderId });
  };

  const handleSaveProvider = async () => {
    setIsLoading(true);
    try {
      if (!providerConfig.provider) {
        toast.error("Please select a provider");
        return;
      }

      if (!providerConfig.senderId) {
        toast.error("Please enter a Sender ID");
        return;
      }

      // Different fields for different providers
      let additionalConfig: Partial<IntegrationConfig> = {};
  
      if (providerConfig.provider === 'msg91') {
        additionalConfig = {
          msg91AuthKey: msg91AuthKey
        };
      } else if (providerConfig.provider === 'twilio') {
        additionalConfig = {
          twilioAccountSid: twilioAccountSid,
          twilioAuthToken: twilioAuthToken
        };
      } else if (providerConfig.provider === 'custom') {
        additionalConfig = {
          customApiUrl: customApiUrl,
          customApiMethod: customApiMethod as "GET" | "POST",
          customApiHeaders: customApiHeaders,
          customApiParams: customApiParams
        };
      }

      const success = updateConfig({
        provider: providerConfig.provider,
        senderId: providerConfig.senderId,
        ...additionalConfig
      });

      if (success) {
        toast.success("Provider settings saved successfully");
      } else {
        toast.error("Failed to save provider settings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await test();
      if (result.success) {
        toast.success("SMS test sent successfully");
      } else {
        toast.error(`SMS test failed: ${result.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Provider Settings</CardTitle>
        <CardDescription>Configure your SMS provider and credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={providerConfig.provider}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="msg91">MSG91</SelectItem>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="senderId">Sender ID</Label>
            <Input
              id="senderId"
              value={providerConfig.senderId || ''}
              onChange={(e) => handleSenderIdChange(e.target.value)}
            />
          </div>

          {providerConfig.provider === 'msg91' && (
            <div>
              <Label htmlFor="msg91AuthKey">MSG91 Auth Key</Label>
              <Input
                id="msg91AuthKey"
                type="password"
                value={msg91AuthKey}
                onChange={(e) => setMsg91AuthKey(e.target.value)}
              />
            </div>
          )}

          {providerConfig.provider === 'twilio' && (
            <>
              <div>
                <Label htmlFor="twilioAccountSid">Twilio Account SID</Label>
                <Input
                  id="twilioAccountSid"
                  value={twilioAccountSid}
                  onChange={(e) => setTwilioAccountSid(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
                <Input
                  id="twilioAuthToken"
                  type="password"
                  value={twilioAuthToken}
                  onChange={(e) => setTwilioAuthToken(e.target.value)}
                />
              </div>
            </>
          )}

          {providerConfig.provider === 'custom' && (
            <>
              <div>
                <Label htmlFor="customApiUrl">Custom API URL</Label>
                <Input
                  id="customApiUrl"
                  type="url"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customApiMethod">Custom API Method</Label>
                <Select
                  value={customApiMethod}
                  onValueChange={(value) => setCustomApiMethod(value as "GET" | "POST")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customApiHeaders">Custom API Headers</Label>
                <Input
                  id="customApiHeaders"
                  value={customApiHeaders}
                  onChange={(e) => setCustomApiHeaders(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customApiParams">Custom API Params</Label>
                <Input
                  id="customApiParams"
                  value={customApiParams}
                  onChange={(e) => setCustomApiParams(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleTestConnection} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          <Button onClick={handleSaveProvider} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmsSettings;
