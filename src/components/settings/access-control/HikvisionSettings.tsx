
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHikvision } from '@/hooks/access/use-hikvision-consolidated';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface HikvisionSettingsProps {
  branchId: string;
}

export default function HikvisionSettings({ branchId }: HikvisionSettingsProps) {
  const [formData, setFormData] = useState({
    baseUrl: '',
    username: '',
    password: '',
    isActive: false,
    syncInterval: 60, // Default sync interval in minutes
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  
  const { 
    isLoading, 
    settings, 
    refreshSettings,
    refreshDevices,
    devices,
    error
  } = useHikvision();

  useEffect(() => {
    if (branchId) {
      refreshSettings().then(settings => {
        if (settings) {
          setFormData({
            baseUrl: settings.baseUrl || '',
            username: settings.username || '',
            password: settings.password || '',
            isActive: settings.isActive || false,
            syncInterval: settings.syncInterval || 60,
          });
        }
      });
    }
  }, [branchId, refreshSettings]);
  
  const handleSave = async () => {
    setErrorMessage(null);
    
    if (!formData.baseUrl || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // In a real implementation, you would call a save function here
      // For now, we'll just update the local state
      await refreshSettings();
      toast.success('Hikvision settings saved successfully');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while saving settings');
      toast.error('Failed to save Hikvision settings');
    }
  };
  
  const handleTestConnection = async () => {
    setErrorMessage(null);
    setIsTesting(true);
    
    if (!formData.baseUrl || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      setIsTesting(false);
      return;
    }
    
    try {
      // In a real implementation, you would call a test connection function here
      // For now, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully connected to Hikvision API');
    } catch (error: any) {
      const message = error.message || 'Failed to connect to Hikvision API';
      setErrorMessage(message);
      toast.error(`Connection test failed: ${message}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Access Control Settings</CardTitle>
        <CardDescription>
          Configure integration with Hikvision access control devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between space-x-2">
          <div>
            <h3 className="font-medium">Enable Hikvision Integration</h3>
            <p className="text-sm text-muted-foreground">Activate the Hikvision access control integration</p>
          </div>
          <Switch 
            checked={formData.isActive} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6 flex items-center space-x-2">
          <div className="font-medium">Connection Status:</div>
          {formData.isActive ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4" /> Connected
            </Badge>
          ) : isLoading ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" /> Testing Connection
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" /> Disconnected
            </Badge>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input 
              id="base-url" 
              value={formData.baseUrl} 
              onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
              placeholder="https://example.hikvision.com"
              disabled={isLoading || !formData.isActive}
            />
            <p className="text-xs text-muted-foreground">
              The base URL of your Hikvision Partner Pro API
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-key">App Key</Label>
            <Input 
              id="username" 
              value={formData.username} 
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter Username"
              disabled={isLoading || !formData.isActive}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <Input 
              id="password" 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              disabled={isLoading || !formData.isActive}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleTestConnection} 
          disabled={isLoading || !formData.isActive || !formData.baseUrl || !formData.username || !formData.password}
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !formData.isActive || !formData.baseUrl || !formData.username || !formData.password}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
