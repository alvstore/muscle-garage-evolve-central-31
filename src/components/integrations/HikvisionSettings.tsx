
import React, { useEffect, useState } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { integrationsService } from '@/services/integrationsService';
import { useBranch } from '@/hooks/use-branches';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/services/supabaseClient';

interface HikvisionSettingsProps {
  onUpdated?: () => void;
}

interface HikvisionConfig {
  id?: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  is_active: boolean;
  branch_id: string;
  devices: any[];
  created_at?: string;
  updated_at?: string;
}

const HikvisionSettings: React.FC<HikvisionSettingsProps> = ({ onUpdated }) => {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<HikvisionConfig>({
    app_key: '',
    app_secret: '',
    api_url: 'https://open.hikvision.com',
    is_active: false,
    branch_id: '',
    devices: []
  });

  // Load existing configuration
  useEffect(() => {
    async function fetchConfig() {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setConfig(data);
        } else {
          // Create default config with branch ID
          setConfig({
            app_key: '',
            app_secret: '',
            api_url: 'https://open.hikvision.com',
            is_active: false,
            branch_id: currentBranch.id,
            devices: []
          });
        }
      } catch (error) {
        console.error('Error loading Hikvision settings:', error);
        toast.error('Failed to load Hikvision settings');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConfig();
  }, [currentBranch?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const toggleActive = (checked: boolean) => {
    setConfig(prev => ({ ...prev, is_active: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBranch?.id) {
      toast.error('No branch selected');
      return;
    }
    
    try {
      setIsSaving(true);
      const configToSave = { 
        ...config,
        branch_id: currentBranch.id,
        updated_at: new Date().toISOString()
      };
      
      if (config.id) {
        // Update existing config
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update(configToSave)
          .eq('id', config.id);
          
        if (error) throw error;
      } else {
        // Insert new config
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert([{ 
            ...configToSave,
            created_at: new Date().toISOString()
          }])
          .select();
          
        if (error) throw error;
        if (data?.[0]?.id) {
          setConfig(prev => ({ ...prev, id: data[0].id }));
        }
      }
      
      toast.success('Hikvision settings saved successfully');
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      toast.error('Failed to save Hikvision settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hikvision Integration</CardTitle>
        <CardDescription>Configure your Hikvision access control integration</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={config.is_active}
                  onCheckedChange={toggleActive}
                />
                <Label htmlFor="is_active">Enable Hikvision Integration</Label>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_url">API URL</Label>
                  <Input
                    id="api_url"
                    name="api_url"
                    value={config.api_url}
                    onChange={handleInputChange}
                    placeholder="https://open.hikvision.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Default: https://open.hikvision.com
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app_key">App Key</Label>
                  <Input
                    id="app_key"
                    name="app_key"
                    value={config.app_key}
                    onChange={handleInputChange}
                    placeholder="Enter your Hikvision App Key"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app_secret">App Secret</Label>
                  <Input
                    id="app_secret"
                    name="app_secret"
                    type="password"
                    value={config.app_secret}
                    onChange={handleInputChange}
                    placeholder="Enter your Hikvision App Secret"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HikvisionSettings;
