
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useBranch } from '@/hooks/use-branch';
import { integrationsService } from '@/services/integrationsService';
import { HikvisionSettings as HikvisionSettingsType } from '@/types';
import { toast } from 'sonner';

const HikvisionSettings: React.FC = () => {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<HikvisionSettingsType>({
    id: '',
    app_key: '',
    app_secret: '',
    api_url: '',
    branch_id: currentBranch?.id || '',
    is_active: false,
    devices: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (currentBranch?.id) {
      loadSettings();
    }
  }, [currentBranch?.id]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const status = await integrationsService.getIntegrationStatus('hikvision');
      if (status && status.config) {
        setSettings({
          ...settings,
          api_url: status.config.api_url || '',
          app_key: status.config.app_key || '',
          app_secret: status.config.app_secret || '',
          is_active: status.config.is_active || false,
        });
      }
    } catch (error) {
      console.error('Error loading Hikvision settings:', error);
      toast.error('Failed to load Hikvision settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await integrationsService.updateIntegrationStatus('hikvision', settings.is_active ? 'active' : 'inactive', {
        api_url: settings.api_url,
        app_key: settings.app_key,
        app_secret: settings.app_secret,
        is_active: settings.is_active
      });
      
      toast.success('Hikvision settings updated successfully');
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      toast.error('Failed to save Hikvision settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof HikvisionSettingsType, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hikvision Integration</CardTitle>
            <CardDescription>Connect to Hikvision devices for access control</CardDescription>
          </div>
          <Badge variant={settings.is_active ? "outline" : "secondary"}>
            {settings.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="hikvision-active" 
              checked={settings.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
              disabled={isLoading || isSaving}
            />
            <Label htmlFor="hikvision-active">Enable Hikvision Integration</Label>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input 
                id="api-url" 
                value={settings.api_url || ''}
                onChange={(e) => handleChange('api_url', e.target.value)}
                placeholder="https://api.hikvisionpartner.com/api" 
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="app-key">App Key</Label>
              <Input 
                id="app-key" 
                value={settings.app_key || ''}
                onChange={(e) => handleChange('app_key', e.target.value)}
                placeholder="Enter your App Key"
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="app-secret">App Secret</Label>
              <Input 
                id="app-secret" 
                type="password"
                value={settings.app_secret || ''}
                onChange={(e) => handleChange('app_secret', e.target.value)}
                placeholder="Enter your App Secret"
                disabled={isLoading || isSaving}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={isLoading || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HikvisionSettings;
