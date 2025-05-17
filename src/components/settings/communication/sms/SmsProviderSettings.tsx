import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SmsProvider } from '@/types/communication/sms';

interface SmsProviderSettingsProps {
  provider: SmsProvider;
  onUpdate: (updates: Partial<SmsProvider>) => Promise<void>;
  isSaving: boolean;
}

export const SmsProviderSettings: React.FC<SmsProviderSettingsProps> = ({
  provider,
  onUpdate,
  isSaving,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    provider: provider?.id || '',
    apiKey: provider?.apiKey || '',
    senderId: provider?.senderId || '',
  });

  React.useEffect(() => {
    setFormData({
      provider: provider?.id || '',
      apiKey: provider?.apiKey || '',
      senderId: provider?.senderId || '',
    });
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onUpdate({
        provider: formData.provider,
        apiKey: formData.apiKey,
        senderId: formData.senderId,
      });
      
      toast({
        title: 'Settings saved',
        description: 'Your SMS provider settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Provider</CardTitle>
        <CardDescription>
          Configure your SMS provider settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">SMS Provider</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => handleSelectChange('provider', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="plivo">Plivo</SelectItem>
                <SelectItem value="msg91">MSG91</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Enter your API key"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderId">Sender ID</Label>
            <Input
              id="senderId"
              name="senderId"
              value={formData.senderId}
              onChange={handleChange}
              placeholder="Your sender ID"
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmsProviderSettings;
