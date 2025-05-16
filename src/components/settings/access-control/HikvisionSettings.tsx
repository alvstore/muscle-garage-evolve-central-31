
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHikvision } from '@/hooks/use-hikvision';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface HikvisionSettingsProps {
  branchId: string;
}

export default function HikvisionSettings({ branchId }: HikvisionSettingsProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [appKey, setAppKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { 
    isLoading, 
    isConnected, 
    settings, 
    fetchSettings, 
    saveSettings,
    testConnection
  } = useHikvision({ branchId });

  useEffect(() => {
    if (branchId) {
      fetchSettings().then(settings => {
        if (settings) {
          setApiUrl(settings.apiUrl || '');
          setAppKey(settings.appKey || '');
          setSecretKey(settings.appSecret || '');
          setIsEnabled(settings.isActive);
        }
      });
    }
  }, [branchId, fetchSettings]);
  
  const handleSave = async () => {
    setErrorMessage(null);
    
    if (!apiUrl || !appKey || !secretKey) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const success = await saveSettings({
        apiUrl,
        appKey,
        secretKey
      }, branchId);
      
      if (success) {
        toast.success('Hikvision settings saved successfully');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while saving settings');
      toast.error('Failed to save Hikvision settings');
    }
  };
  
  const handleTestConnection = async () => {
    setErrorMessage(null);
    
    if (!apiUrl || !appKey || !secretKey) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const result = await testConnection({
        apiUrl,
        appKey,
        secretKey
      });
      
      if (result.success) {
        toast.success('Successfully connected to Hikvision API');
      } else {
        setErrorMessage(result.message || 'Failed to connect to Hikvision API');
        toast.error(`Connection test failed: ${result.message}`);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while testing connection');
      toast.error('Failed to test connection');
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
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6 flex items-center space-x-2">
          <div className="font-medium">Connection Status:</div>
          {isConnected === true ? (
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
              id="api-url" 
              value={apiUrl} 
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://example.hikvision.com"
              disabled={isLoading || !isEnabled}
            />
            <p className="text-xs text-muted-foreground">
              The base URL of your Hikvision Partner Pro API
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-key">App Key</Label>
            <Input 
              id="app-key" 
              value={appKey} 
              onChange={(e) => setAppKey(e.target.value)}
              placeholder="Enter App Key"
              disabled={isLoading || !isEnabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <Input 
              id="secret-key" 
              type="password" 
              value={secretKey} 
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="••••••••••••••"
              disabled={isLoading || !isEnabled}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleTestConnection} 
          disabled={isLoading || !isEnabled || !apiUrl || !appKey || !secretKey}
        >
          {isLoading ? (
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
          disabled={isLoading || !isEnabled || !apiUrl || !appKey || !secretKey}
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
