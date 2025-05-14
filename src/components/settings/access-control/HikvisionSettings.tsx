
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2, Check, AlertCircle, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HikvisionSettingsProps {
  branchId: string | null;
}

interface HikvisionDevice {
  id: string;
  name: string;
  device_id: string;
  ip_address?: string; // Optional for cloud-managed devices
  port?: string; // Optional for cloud-managed devices
  username?: string; // Optional for cloud-managed devices
  password?: string; // Optional for cloud-managed devices
  is_active: boolean;
  device_type: 'door_controller' | 'access_control_device' | 'camera' | 'other';
  management_type: 'cloud' | 'local'; // Cloud = Partner API, Local = ISUP Protocol
  location?: string;
  last_sync?: string;
  sync_status?: 'success' | 'failed' | 'pending';
}

interface HikvisionApiSettings {
  id: string;
  branch_id: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: HikvisionDevice[];
  is_active: boolean;
}

const HikvisionSettings = ({ branchId }: HikvisionSettingsProps) => {
  const [settings, setSettings] = useState<HikvisionApiSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [appKey, setAppKey] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  // Device management state
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<HikvisionDevice | null>(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('80');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deviceType, setDeviceType] = useState<'door_controller' | 'access_control_device' | 'camera' | 'other'>('access_control_device');
  const [managementType, setManagementType] = useState<'cloud' | 'local'>('cloud');
  const [location, setLocation] = useState('');
  const [isDeviceActive, setIsDeviceActive] = useState(true);
  const [testingDevice, setTestingDevice] = useState(false);
  const [testingDeviceId, setTestingDeviceId] = useState<string | null>(null);
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [deviceTestResult, setDeviceTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [deviceValidationErrors, setDeviceValidationErrors] = useState<{[key: string]: string}>({});

  const fetchSettings = async () => {
    if (!branchId) return;
    
    console.log('Fetching Hikvision settings for branch:', branchId);
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        setSettings(data);
        setApiUrl(data.api_url);
        setAppKey(data.app_key);
        // Don't set app_secret for security reasons
        setAppSecret(''); // Leave blank, will only update if changed
        setIsActive(data.is_active);
        
        // Fetch devices
        await fetchDevices();
      } else {
        setSettings(null);
        setApiUrl('');
        setAppKey('');
        setAppSecret('');
        setIsActive(false);
        setDevices([]);
      }
    } catch (err) {
      console.error('Error fetching Hikvision settings:', err);
      setError('Failed to load Hikvision API settings. Please try again later.');
      toast.error('Failed to load Hikvision API settings');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDevices = async () => {
    if (!branchId) return;
    
    console.log('Fetching Hikvision devices for branch:', branchId);
    
    try {
      // Get API settings which contains devices as a JSON field
      const { data: apiSettings, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found - this is not an error
          setDevices([]);
          return;
        }
        throw error;
      }
      
      // Extract devices from the JSON field
      const deviceList = apiSettings?.devices || [];
      setDevices(Array.isArray(deviceList) ? deviceList : []);
    } catch (err) {
      console.error('Error fetching Hikvision devices:', err);
      toast.error('Failed to load Hikvision devices');
      // Set empty array to prevent further errors
      setDevices([]);
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId]);

  const handleSaveSettings = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate inputs
      if (!apiUrl) {
        setError('API URL is required');
        return;
      }
      
      if (!appKey) {
        setError('App Key is required');
        return;
      }
      
      // Prepare data for update or insert
      const settingsData = {
        branch_id: branchId,
        api_url: apiUrl,
        app_key: appKey,
        is_active: isActive,
      };
      
      // Only include app_secret if it was changed (not empty)
      if (appSecret) {
        settingsData['app_secret'] = appSecret;
      }
      
      console.log('Saving Hikvision settings:', settingsData);
      
      let result;
      
      if (settings) {
        // Update existing settings
        result = await supabase
          .from('hikvision_api_settings')
          .update(settingsData)
          .eq('id', settings.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('hikvision_api_settings')
          .insert(settingsData);
      }
      
      if (result.error) throw result.error;
      
      toast.success('Hikvision API settings saved successfully');
      await fetchSettings();
    } catch (err) {
      console.error('Error saving Hikvision settings:', err);
      setError('Failed to save Hikvision API settings. Please try again later.');
      toast.error('Failed to save Hikvision API settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to handle successful connection
  const handleSuccessfulConnection = async (data: any, baseUrl: string) => {
    console.log('Hikvision API response:', data);
    
    if (data && data.accessToken) {
      // Connection successful
      setTestResult({
        success: true,
        message: 'Connection successful! API credentials are valid.'
      });
      toast.success('Hikvision API connection successful');
      
      // Store token in hikvision_tokens table
      await supabase.from('hikvision_tokens').upsert({
        branch_id: branchId!,
        access_token: data.accessToken,
        expires_at: new Date(Date.now() + (data.expiresIn * 1000)).toISOString(),
        created_at: new Date().toISOString()
      });
      
      // Update the API settings in the database
      if (settings) {
        // Update existing settings
        await supabase
          .from('hikvision_api_settings')
          .update({
            api_url: baseUrl,
            app_key: appKey,
            app_secret: appSecret || settings.app_secret,
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
      } else {
        // Create new settings
        await supabase
          .from('hikvision_api_settings')
          .insert({
            branch_id: branchId,
            api_url: baseUrl,
            app_key: appKey,
            app_secret: appSecret,
            is_active: true,
            devices: []
          });
      }
      
      // Refresh settings
      fetchSettings();
    } else {
      throw new Error('Invalid response from Hikvision API');
    }
  };

  const handleTestConnection = async () => {
    if (!branchId) {
      toast.error('Please select a branch first');
      return;
    }
    
    try {
      setTestingConnection(true);
      setTestResult(null);
      
      // Clean the API URL to remove any spaces and ensure it's properly formatted
      const cleanApiUrl = apiUrl.trim();
      const baseUrl = cleanApiUrl.endsWith('/') ? cleanApiUrl.slice(0, -1) : cleanApiUrl;
      
      if (!baseUrl) {
        throw new Error('API URL is required');
      }
      
      if (!appKey) {
        throw new Error('App Key is required');
      }
      
      const secret = appSecret || settings?.app_secret;
      if (!secret) {
        throw new Error('App Secret is required');
      }
      
      console.log('Testing connection with Hikvision API');
      
      // Try direct connection if in development mode
      if (process.env.NODE_ENV === 'development') {
        const timestamp = new Date().getTime().toString();
        const nonce = Math.random().toString(36).substring(2, 15);
        
        // In a real implementation, you would generate the signature here
        // const signature = generateSignature(baseUrl, appKey, secret, timestamp, nonce);
        
        const response = await axios.post(`${baseUrl}/api/hpcgw/v1/token/get`, {
          appKey,
          secretKey: secret
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Ca-Key': appKey,
            'X-Ca-Timestamp': timestamp,
            'X-Ca-Nonce': nonce,
            // 'X-Ca-Signature': signature
          },
          timeout: 10000 // 10 second timeout
        });
        
        return handleSuccessfulConnection(response.data, baseUrl);
      } else {
        // Use Supabase Edge Function in production
        const response = await axios.post('/api/proxy/hikvision/token', {
          apiUrl: baseUrl,
          appKey,
          secretKey: secret
        }, {
          timeout: 10000 // 10 second timeout
        });
        
        return handleSuccessfulConnection(response.data, baseUrl);
      }
      
    } catch (err: any) {
      console.error('Error testing Hikvision connection:', err);
      
      let errorMessage = 'Connection failed';
      let errorCode = '';
      
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Handle network errors
        errorMessage = 'Unable to connect to the Hikvision API. Please check your internet connection and API URL.';
        if (process.env.NODE_ENV === 'development') {
          errorMessage += ' (Local development server may not be running)';
        }
      } else if (err.response && err.response.data) {
        // Handle API errors
        const hikvisionError = err.response.data;
        errorCode = hikvisionError.errorCode || '';
        
        // Map error codes to user-friendly messages
        switch(errorCode) {
          case 'EVZ20002':
            errorMessage = 'Device does not exist';
            break;
          case 'EVZ20007':
            errorMessage = 'The device is offline';
            break;
          case 'EVZ0012':
            errorMessage = 'Adding device failed';
            break;
          case 'EVZ20014':
            errorMessage = 'Incorrect device serial number';
            break;
          case '0x400019F1':
            errorMessage = 'The maximum number of devices reached';
            break;
          case '0x30000010':
            errorMessage = 'Database search failed';
            break;
          case '0x30001000':
            errorMessage = 'HBP Exception';
            break;
          default:
            errorMessage = hikvisionError.message || 'Unknown error occurred';
        }
        
        errorMessage = errorCode ? `${errorMessage} (Error code: ${errorCode})` : errorMessage;
      } else if (err.message) {
        // Handle other errors
        errorMessage = err.message;
      }
      
      setTestResult({
        success: false,
        message: errorMessage
      });
      
      console.log(`Hikvision API error: ${errorMessage} (${errorCode})`);
      toast.error(`Hikvision API connection failed: ${errorMessage}`);
    } finally {
      setTestingConnection(false);
    }
  };
  
  // Device management functions
  const resetDeviceForm = () => {
    setDeviceName('');
    setDeviceId('');
    setIpAddress('');
    setPort('80');
    setUsername('');
    setPassword('');
    setDeviceType('access_control_device');
    setManagementType('cloud');
    setLocation('');
    setIsDeviceActive(true);
    setEditingDevice(null);
    setDeviceValidationErrors({});
    setDeviceTestResult(null);
  };
  
  const openAddDeviceDialog = () => {
    resetDeviceForm();
    setDeviceDialogOpen(true);
  };
  
  const openEditDeviceDialog = (device: HikvisionDevice) => {
    setEditingDevice(device);
    setDeviceName(device.name);
    setDeviceId(device.device_id);
    setIpAddress(device.ip_address || '');
    setPort(device.port || '80');
    setUsername(device.username || '');
    // Don't set password for security reasons
    setPassword(''); // Leave blank, will only update if changed
    setDeviceType(device.device_type);
    setManagementType(device.management_type || 'cloud');
    setLocation(device.location || '');
    setIsDeviceActive(device.is_active);
    setDeviceDialogOpen(true);
  };
  
  const validateDeviceForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!deviceName.trim()) errors.name = 'Device name is required';
    if (!deviceId.trim()) errors.deviceId = 'Device ID is required';
    
    // Only validate these fields for locally managed devices
    if (managementType === 'local') {
      if (!ipAddress?.trim()) errors.ipAddress = 'IP address is required for locally managed devices';
      if (!port?.trim()) errors.port = 'Port is required for locally managed devices';
      if (!username?.trim()) errors.username = 'Username is required for locally managed devices';
      // Password is not validated if editing an existing device (to allow keeping existing password)
      if (!password?.trim() && !editingDevice) errors.password = 'Password is required for locally managed devices';
    }
    
    setDeviceValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveDevice = async () => {
    if (!branchId || !settings) return;
    
    // Validate form
    if (!validateDeviceForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare device data
      const deviceData: HikvisionDevice = {
        id: editingDevice?.id || crypto.randomUUID(),
        name: deviceName,
        device_id: deviceId,
        device_type: deviceType,
        management_type: managementType,
        is_active: isDeviceActive,
        location,
      };
      
      console.log('Saving Hikvision device:', deviceData);
      
      // Only include these fields for locally managed devices
      if (managementType === 'local') {
        deviceData.ip_address = ipAddress;
        deviceData.port = port;
        deviceData.username = username;
        // Only include password if it was changed (not empty)
        if (password) {
          deviceData.password = password;
        } else if (editingDevice?.password) {
          // Keep existing password if editing
          deviceData.password = editingDevice.password;
        }
      }
      
      // Get current devices from settings
      const currentDevices = Array.isArray(settings.devices) ? settings.devices : [];
      
      let updatedDevices;
      
      if (editingDevice) {
        // Update existing device in the array
        updatedDevices = currentDevices.map(device => 
          device.id === editingDevice.id ? deviceData : device
        );
      } else {
        // Add new device to the array
        updatedDevices = [...currentDevices, deviceData];
      }
      
      // Update the devices array in the API settings
      const { error } = await supabase
        .from('hikvision_api_settings')
        .update({
          devices: updatedDevices,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);
      
      if (error) throw error;
      
      toast.success(`Device ${editingDevice ? 'updated' : 'added'} successfully`);
      await fetchSettings(); // Refresh settings which includes devices
      setDeviceDialogOpen(false);
      resetDeviceForm();
    } catch (err) {
      console.error('Error saving Hikvision device:', err);
      toast.error(`Failed to ${editingDevice ? 'update' : 'add'} device`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestDevice = async (deviceId: string) => {
    try {
      setTestingDevice(true);
      setTestingDeviceId(deviceId);
      setDeviceTestResult(null);
      
      if (!settings) {
        throw new Error('API settings not found');
      }
      
      // Find the device
      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        throw new Error('Device not found');
      }
      
      // Get the current access token
      const { data: tokenData, error: tokenError } = await supabase
        .from('hikvision_tokens')
        .select('access_token, expires_at')
        .eq('branch_id', branchId)
        .single();
      
      if (tokenError || !tokenData) {
        throw new Error('Access token not found. Please test API connection first.');
      }
      
      // Check if token is expired
      const expiresAt = new Date(tokenData.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('Access token expired. Please test API connection to refresh.');
      }
      
      // Different testing logic based on management type
      if (device.management_type === 'cloud') {
        // For cloud devices, we test using the Hikvision Partner API
        console.log(`Testing cloud device: ${device.name} (${device.device_id})`);
        
        const response = await axios.post('/api/proxy/hikvision/test-device', {
          deviceId: device.device_id,
          accessToken: tokenData.access_token
        });
        
        console.log('Device test response:', response.data);
        
        if (response.data.success) {
          setDeviceTestResult({
            success: true,
            message: 'Cloud device connection successful!'
          });
          toast.success('Cloud device connection successful');
        } else {
          throw new Error(response.data.message || 'Cloud device connection failed');
        }
      } else {
        // For local devices, test direct connection using IP, port, username, password
        if (!device.ip_address || !device.port || !device.username || !device.password) {
          throw new Error('Missing connection details for local device');
        }
        
        console.log(`Testing local device: ${device.name} (${device.ip_address}:${device.port})`);
        
        const response = await axios.post('/api/proxy/hikvision/test-local-device', {
          ip: device.ip_address,
          port: device.port,
          username: device.username,
          password: device.password
        });
        
        console.log('Local device test response:', response.data);
        
        if (response.data.success) {
          setDeviceTestResult({
            success: true,
            message: 'Local device connection successful!'
          });
          toast.success('Local device connection successful');
        } else {
          throw new Error(response.data.message || 'Local device connection failed');
        }
      }
      
      // Update device status in the devices array
      const updatedDevices = devices.map(d => {
        if (d.id === deviceId) {
          return {
            ...d,
            sync_status: 'success',
            last_sync: new Date().toISOString()
          };
        }
        return d;
      });
      
      // Update the settings in the database
      await supabase
        .from('hikvision_api_settings')
        .update({ 
          devices: updatedDevices,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);
        
      // Refresh settings which includes devices
      await fetchSettings();
      
    } catch (err) {
      console.error('Error testing Hikvision device:', err);
      
      // Extract error code and message from Hikvision API response
      let errorMessage = 'Device test failed';
      let errorCode = '';
      
      if (err.response && err.response.data) {
        const hikvisionError = err.response.data;
        errorCode = hikvisionError.errorCode || '';
        
        // Map error codes to user-friendly messages
        switch(errorCode) {
          case 'EVZ20002':
            errorMessage = 'Device does not exist';
            break;
          case 'EVZ20007':
            errorMessage = 'The device is offline';
            break;
          case 'EVZ0012':
            errorMessage = 'Adding device failed';
            break;
          case 'EVZ20014':
            errorMessage = 'Incorrect device serial number';
            break;
          default:
            errorMessage = hikvisionError.message || 'Unknown error occurred';
        }
        
        errorMessage += errorCode ? ` (Error code: ${errorCode})` : '';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setDeviceTestResult({
        success: false,
        message: errorMessage
      });
      
      console.log(`Hikvision device test error: ${errorMessage} (${errorCode})`);
      toast.error(`Device test failed: ${errorMessage}`);
      
      if (settings) {
        // Update device status in the devices array
        const updatedDevices = devices.map(d => {
          if (d.id === deviceId) {
            return {
              ...d,
              sync_status: 'failed',
              last_sync: new Date().toISOString()
            };
          }
          return d;
        });
        
        // Update the settings in the database
        await supabase
          .from('hikvision_api_settings')
          .update({ 
            devices: updatedDevices,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
          
        // Refresh settings which includes devices
        await fetchSettings();
      }
    } finally {
      setTestingDevice(false);
      setTestingDeviceId(null);
    }
  };
  
  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    if (!settings) return;
    
    try {
      setLoading(true);
      
      // Filter out the device to be deleted
      const updatedDevices = devices.filter(device => device.id !== deviceId);
      
      // Update the settings with the filtered devices array
      const { error } = await supabase
        .from('hikvision_api_settings')
        .update({
          devices: updatedDevices,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);
        
      if (error) throw error;
      
      toast.success('Device deleted successfully');
      await fetchSettings(); // Refresh settings which includes devices
    } catch (err) {
      console.error('Error deleting Hikvision device:', err);
      toast.error('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSyncAllDevices = async () => {
    if (!settings || !branchId) return;
    
    try {
      setSyncingDevices(true);
      
      // In development, we'll simulate a successful response
      if (process.env.NODE_ENV === 'development') {
        // Simulate API response in development
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update all devices' sync status
        const updatedDevices = devices.map(device => ({
          ...device,
          sync_status: 'success',
          last_sync: new Date().toISOString()
        }));
        
        // Update the settings in the database
        await supabase
          .from('hikvision_api_settings')
          .update({
            devices: updatedDevices,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
          
        toast.success('All devices synced successfully');
        await fetchSettings(); // Refresh settings which includes devices
      } else {
        // Call your API endpoint to sync all devices
        const response = await axios.post('/api/access-control/hikvision/sync-all-devices', {
          branchId,
          apiSettings: {
            api_url: settings.api_url,
            app_key: settings.app_key,
            app_secret: settings.app_secret
          },
          devices: settings.devices
        });
        
        if (response.data.success) {
          toast.success('All devices synced successfully');
          await fetchSettings(); // Refresh settings which includes devices
        } else {
          toast.error('Failed to sync all devices');
        }
      }
    } catch (err) {
      console.error('Error syncing Hikvision devices:', err);
      toast.error('Failed to sync all devices');
    } finally {
      setSyncingDevices(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && !settings && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Hikvision API Settings</CardTitle>
          <CardDescription>
            Configure Hikvision API settings for access control integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                placeholder="https://api.hikvision.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-key">App Key</Label>
              <Input
                id="app-key"
                placeholder="Your Hikvision App Key"
                value={appKey}
                onChange={(e) => setAppKey(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-secret">App Secret {settings && '(Leave blank to keep current secret)'}</Label>
            <Input
              id="app-secret"
              type="password"
              placeholder="Your Hikvision App Secret"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
            <Label htmlFor="is-active">Enable Hikvision Integration</Label>
          </div>
          
          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={loading || testingConnection || !apiUrl || !appKey || (!appSecret && !settings)}
          >
            {testingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>Test Connection</>
            )}
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={loading || !apiUrl || !appKey}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Settings</>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {settings && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                Configure Hikvision devices for this branch
              </CardDescription>
            </div>
            <Button onClick={openAddDeviceDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No devices configured yet. Add your first device to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((device) => (
                  <Card key={device.id} className="overflow-hidden">
                    <div className={`h-2 ${device.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{device.name}</h3>
                            <Badge className="ml-2" variant={device.device_type === 'access_control_device' ? 'default' : device.device_type === 'door_controller' ? 'secondary' : device.device_type === 'camera' ? 'secondary' : 'outline'}>
                              {device.device_type === 'access_control_device' ? 'Access Control' :
                               device.device_type === 'door_controller' ? 'Door Controller' : 
                               device.device_type === 'camera' ? 'Camera' : 'Other'}
                            </Badge>
                            <Badge className="ml-2" variant={device.management_type === 'cloud' ? 'outline' : 'secondary'}>
                              {device.management_type === 'cloud' ? 'Cloud API' : 'Local'}
                            </Badge>
                            {device.sync_status && (
                              <Badge className="ml-2" variant={device.sync_status === 'success' ? 'success' : device.sync_status === 'failed' ? 'destructive' : 'outline'}>
                                {device.sync_status === 'success' ? 'Synced' : 
                                 device.sync_status === 'failed' ? 'Sync Failed' : 'Pending'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {device.management_type === 'local' && device.ip_address ? `${device.ip_address}:${device.port || '80'} • ` : ''}
                            ID: {device.device_id}
                          </p>
                          {device.location && (
                            <p className="text-sm text-muted-foreground">
                              Location: {device.location}
                            </p>
                          )}
                          {device.last_sync && (
                            <p className="text-xs text-muted-foreground">
                              Last synced: {new Date(device.last_sync).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleTestDevice(device.id)}
                            disabled={testingDevice}
                          >
                            {testingDevice && device.id === testingDeviceId ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Test
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDeviceDialog(device)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDevice(device.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSyncAllDevices} 
              disabled={loading || devices.length === 0}
            >
              {syncingDevices ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing All Devices...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync All Devices
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Device Dialog */}
      <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDevice ? 'Edit Device' : 'Add New Device'}</DialogTitle>
            <DialogDescription>
              {editingDevice ? 'Update the device details below.' : 'Enter the device details below to add it to your branch.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input
                  id="device-name"
                  placeholder="Main Entrance"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  disabled={loading}
                />
                {deviceValidationErrors.name && (
                  <p className="text-sm text-destructive">{deviceValidationErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-id">Device ID</Label>
                <Input
                  id="device-id"
                  placeholder="Device ID"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  disabled={loading}
                />
                {deviceValidationErrors.deviceId && (
                  <p className="text-sm text-destructive">{deviceValidationErrors.deviceId}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="management-type">Management Type</Label>
              <Select 
                value={managementType} 
                onValueChange={(value) => setManagementType(value as 'cloud' | 'local')}
                disabled={loading}
              >
                <SelectTrigger id="management-type">
                  <SelectValue placeholder="Select management type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud (Partner API)</SelectItem>
                  <SelectItem value="local">Local (ISUP Protocol)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Cloud-managed devices use the Hikvision Partner API. Local devices require direct IP access.
              </p>
            </div>
            
            {managementType === 'local' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">IP Address</Label>
                    <Input
                      id="ip-address"
                      placeholder="192.168.1.100"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      disabled={loading}
                    />
                    {deviceValidationErrors.ipAddress && (
                      <p className="text-sm text-destructive">{deviceValidationErrors.ipAddress}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="80"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      disabled={loading}
                    />
                    {deviceValidationErrors.port && (
                      <p className="text-sm text-destructive">{deviceValidationErrors.port}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                    />
                    {deviceValidationErrors.username && (
                      <p className="text-sm text-destructive">{deviceValidationErrors.username}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password {editingDevice && '(Leave blank to keep current)'}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    {deviceValidationErrors.password && (
                      <p className="text-sm text-destructive">{deviceValidationErrors.password}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Select 
                  value={deviceType} 
                  onValueChange={(value) => setDeviceType(value as 'door_controller' | 'access_control_device' | 'camera' | 'other')}
                  disabled={loading}
                >
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access_control_device">Access Control Device</SelectItem>
                    <SelectItem value="door_controller">Door Controller</SelectItem>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Main Entrance"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is-device-active"
                checked={isDeviceActive}
                onCheckedChange={setIsDeviceActive}
                disabled={loading}
              />
              <Label htmlFor="is-device-active">Device Active</Label>
            </div>
            
            {deviceTestResult && (
              <Alert variant={deviceTestResult.success ? 'default' : 'destructive'}>
                {deviceTestResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{deviceTestResult.success ? 'Success' : 'Error'}</AlertTitle>
                <AlertDescription>{deviceTestResult.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeviceDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveDevice} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingDevice ? 'Update' : 'Add'} Device</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HikvisionSettings;
