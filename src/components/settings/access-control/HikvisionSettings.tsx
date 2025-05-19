
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';
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
  const [syncStatus, setSyncStatus] = useState<{
    status: 'idle' | 'syncing' | 'success' | 'error';
    message?: string;
    lastSync?: string;
  }>({ status: 'idle' });
  
  const { 
    settings, 
    isLoading, 
    isSaving,
    isConnected,
    isSyncing,
    lastSync,
    error,
    saveSettings,
    testConnection,
    syncDevices
  } = useHikvisionSettings(branchId);

  useEffect(() => {
    if (settings) {
      setFormData({
        baseUrl: settings.apiUrl || '',
        username: settings.appKey || '',
        password: settings.appSecret || '••••••',
        isActive: settings.isActive || false,
        syncInterval: settings.syncInterval || 60,
      });
    }
  }, [settings]);
  
  const handleSave = async () => {
    setErrorMessage(null);
    
    if (!formData.baseUrl || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await saveSettings({
        apiUrl: formData.baseUrl,
        appKey: formData.username,
        appSecret: formData.password === '••••••' ? undefined : formData.password,
        isActive: formData.isActive,
        syncInterval: formData.syncInterval
      });
      
      toast.success('Hikvision settings saved successfully');
    } catch (error: any) {
      const message = error.message || 'An error occurred while saving settings';
      setErrorMessage(message);
      toast.error(`Failed to save Hikvision settings: ${message}`);
    }
  };
  
  const handleSyncDevices = async () => {
    setSyncStatus({ status: 'syncing', message: 'Syncing devices...' });
    try {
      await syncDevices();
      setSyncStatus({ 
        status: 'success', 
        message: 'Devices synced successfully',
        lastSync: new Date().toISOString()
      });
      toast.success('Devices synced successfully');
    } catch (error: any) {
      const message = error.message || 'Failed to sync devices';
      setSyncStatus({ 
        status: 'error', 
        message: `Sync failed: ${message}`,
        lastSync: syncStatus.lastSync
      });
      toast.error(`Failed to sync devices: ${message}`);
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
      const result = await testConnection({
        apiUrl: formData.baseUrl,
        appKey: formData.username,
        appSecret: formData.password === '••••••' ? undefined : formData.password,
        isActive: formData.isActive
      });
      
      if (result.success) {
        toast.success(result.message || 'Successfully connected to Hikvision API');
      } else {
        throw new Error(result.message || 'Connection test failed');
      }
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Connection Status</div>
              {isConnected ? (
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
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncDevices}
              disabled={isLoading || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Sync Devices Now'
              )}
            </Button>
          </div>
          
          {(lastSync || syncStatus.lastSync) && (
            <div className="text-xs text-muted-foreground">
              Last sync: {new Date(syncStatus.lastSync || lastSync || '').toLocaleString()}
            </div>
          )}
          
          {syncStatus.message && (
            <div className={`text-sm ${
              syncStatus.status === 'success' ? 'text-green-600' : 
              syncStatus.status === 'error' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {syncStatus.status === 'syncing' && (
                <Loader2 className="mr-2 h-3 w-3 inline-block animate-spin" />
              )}
              {syncStatus.message}
            </div>
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
