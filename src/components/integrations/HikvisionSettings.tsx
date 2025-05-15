import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAutomations } from '@/hooks/use-automations';

interface HikvisionSettingsForm {
  api_url: string;
  app_key: string;
  app_secret: string;
  is_active: boolean;
}

const HikvisionSettings = () => {
  const [formData, setFormData] = useState<HikvisionSettingsForm>({
    api_url: 'https://open.hikvision.com',
    app_key: '',
    app_secret: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getIntegrationStatus } = useAutomations();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const status = await getIntegrationStatus('hikvision');
        const settings = status?.config || {};
        if (settings) {
          setFormData({
            api_url: settings.api_url || 'https://open.hikvision.com',
            app_key: settings.app_key || '',
            app_secret: settings.app_secret || '',
            is_active: settings.is_active || false
          });
        }
      } catch (error) {
        console.error('Error fetching Hikvision settings:', error);
        toast.error('Failed to load Hikvision settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [getIntegrationStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { updateIntegrationStatus } = useAutomations();
      await updateIntegrationStatus('hikvision', formData.is_active ? 'configured' : 'not-configured', formData);
      toast.success('Hikvision settings saved successfully!');
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      toast.error('Failed to save Hikvision settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Integration</CardTitle>
        <CardDescription>Configure your Hikvision device settings here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="api_url">API URL</Label>
            <Input
              type="text"
              id="api_url"
              name="api_url"
              value={formData.api_url}
              onChange={handleChange}
              placeholder="https://open.hikvision.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="app_key">App Key</Label>
            <Input
              type="text"
              id="app_key"
              name="app_key"
              value={formData.app_key}
              onChange={handleChange}
              placeholder="Your Hikvision App Key"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="app_secret">App Secret</Label>
            <Input
              type="text"
              id="app_secret"
              name="app_secret"
              value={formData.app_secret}
              onChange={handleChange}
              placeholder="Your Hikvision App Secret"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Enable Integration</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HikvisionSettings;
