
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EyeOff, Eye, Send, Loader2 } from "lucide-react";
import { IntegrationConfig } from '@/services/integrationService';

interface SmsProviderSettingsProps {
  config: Partial<IntegrationConfig>;
  onUpdateConfig: (config: Partial<IntegrationConfig>) => void;
  onTest: () => Promise<void>;
  onSave: () => void;
}

export const SmsProviderSettings: React.FC<SmsProviderSettingsProps> = ({
  config,
  onUpdateConfig,
  onTest,
  onSave
}) => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  const handleSendTest = async () => {
    if (!testPhone) return;
    setIsSendingTest(true);
    try {
      await onTest();
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Provider Settings</CardTitle>
        <CardDescription>Configure your SMS service provider settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select Provider</Label>
          <RadioGroup
            value={config.provider || 'msg91'}
            onValueChange={(value) => onUpdateConfig({ provider: value })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="msg91" id="msg91" />
              <Label htmlFor="msg91">MSG91</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="twilio" id="twilio" />
              <Label htmlFor="twilio">Twilio</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label>Sender ID</Label>
            <Input
              maxLength={11}
              placeholder="GYMAPP"
              value={config.senderId || ''}
              onChange={(e) => onUpdateConfig({ senderId: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">Maximum 11 characters</p>
          </div>

          {config.provider === 'msg91' ? (
            <div className="space-y-2">
              <Label>MSG91 Auth Key</Label>
              <div className="flex">
                <Input
                  type={showSecrets ? "text" : "password"}
                  placeholder="Enter Auth Key"
                  value={config.msg91AuthKey || ''}
                  onChange={(e) => onUpdateConfig({ msg91AuthKey: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="ml-2"
                >
                  {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Twilio Account SID</Label>
                <Input
                  placeholder="Enter Account SID"
                  value={config.twilioAccountSid || ''}
                  onChange={(e) => onUpdateConfig({ twilioAccountSid: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Twilio Auth Token</Label>
                <div className="flex">
                  <Input
                    type={showSecrets ? "text" : "password"}
                    placeholder="Enter Auth Token"
                    value={config.twilioAuthToken || ''}
                    onChange={(e) => onUpdateConfig({ twilioAuthToken: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="ml-2"
                  >
                    {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Test SMS</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="+91 9876543210"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={isSendingTest}
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmsProviderSettings;
