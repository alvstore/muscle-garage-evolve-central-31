
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
  ip_address: string;
  port: string;
  username: string;
  password: string;
  is_active: boolean;
  device_type: 'door_controller' | 'camera' | 'other';
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
  const [deviceType, setDeviceType] = useState<'door_controller' | 'camera' | 'other'>('door_controller');
  const [location, setLocation] = useState('');
  const [isDeviceActive, setIsDeviceActive] = useState(true);
  const [testingDevice, setTestingDevice] = useState(false);
  const [testingDeviceId, setTestingDeviceId] = useState<string | null>(null);
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [deviceTestResult, setDeviceTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [deviceValidationErrors, setDeviceValidationErrors] = useState<{[key: string]: string}>({});

  const fetchSettings = async () => {
    if (!branchId) return;
    
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
    
    try {
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) throw error;
      
      setDevices(data || []);
    } catch (err) {
      console.error('Error fetching Hikvision devices:', err);
      toast.error('Failed to load Hikvision devices');
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
  
  const handleTestConnection = async () => {
    if (!branchId) return;
    
    try {
      setTestingConnection(true);
      setTestResult(null);
      
      // Call your API endpoint to test the connection
      const response = await axios.post('/api/access-control/hikvision/test-connection', {
        apiUrl,
        appKey,
        appSecret: appSecret || (settings?.app_secret || ''),
      });
      
      if (response.data.success) {
        setTestResult({
          success: true,
          message: 'Connection successful! API credentials are valid.'
        });
        toast.success('Hikvision API connection successful');
      } else {
        setTestResult({
          success: false,
          message: response.data.message || 'Connection failed. Please check your API credentials.'
        });
        toast.error('Hikvision API connection failed');
      }
    } catch (err) {
      console.error('Error testing Hikvision connection:', err);
      setTestResult({
        success: false,
        message: 'Connection failed. Please check your API credentials and network settings.'
      });
      toast.error('Hikvision API connection test failed');
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
    setDeviceType('door_controller');
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
    setIpAddress(device.ip_address);
    setPort(device.port);
    setUsername(device.username);
    // Don't set password for security reasons
    setPassword(''); // Leave blank, will only update if changed
    setDeviceType(device.device_type);
    setLocation(device.location || '');
    setIsDeviceActive(device.is_active);
    setDeviceDialogOpen(true);
  };
  
  const validateDeviceForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!deviceName.trim()) errors.name = 'Device name is required';
    if (!deviceId.trim()) errors.deviceId = 'Device ID is required';
    if (!ipAddress.trim()) errors.ipAddress = 'IP address is required';
    if (!port.trim()) errors.port = 'Port is required';
    if (!username.trim()) errors.username = 'Username is required';
    if (!editingDevice && !password.trim()) errors.password = 'Password is required';
    
    setDeviceValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveDevice = async () => {
    if (!branchId) return;
    
    // Validate form
    if (!validateDeviceForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare device data
      const deviceData = {
        branch_id: branchId,
        name: deviceName,
        device_id: deviceId,
        ip_address: ipAddress,
        port,
        username,
        device_type: deviceType,
        location,
        is_active: isDeviceActive,
      };
      
      // Only include password if it was changed (not empty)
      if (password) {
        deviceData['password'] = password;
      }
      
      let result;
      
      if (editingDevice) {
        // Update existing device
        result = await supabase
          .from('hikvision_devices')
          .update(deviceData)
          .eq('id', editingDevice.id);
      } else {
        // Insert new device
        result = await supabase
          .from('hikvision_devices')
          .insert(deviceData);
      }
      
      if (result.error) throw result.error;
      
      toast.success(`Device ${editingDevice ? 'updated' : 'added'} successfully`);
      await fetchDevices();
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
      
      // Find the device
      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        throw new Error('Device not found');
      }
      
      // Call your API endpoint to test the device connection
      const response = await axios.post('/api/access-control/hikvision/test-device', {
        deviceId: device.id,
      });
      
      if (response.data.success) {
        setDeviceTestResult({
          success: true,
          message: 'Device connection successful!'
        });
        toast.success('Device connection successful');
        
        // Update device status in the database
        await supabase
          .from('hikvision_devices')
          .update({ 
            sync_status: 'success',
            last_sync: new Date().toISOString()
          })
          .eq('id', deviceId);
          
        // Refresh devices
        await fetchDevices();
      } else {
        setDeviceTestResult({
          success: false,
          message: response.data.message || 'Device connection failed.'
        });
        toast.error('Device connection failed');
        
        // Update device status in the database
        await supabase
          .from('hikvision_devices')
          .update({ 
            sync_status: 'failed',
            last_sync: new Date().toISOString()
          })
          .eq('id', deviceId);
          
        // Refresh devices
        await fetchDevices();
      }
    } catch (err) {
      console.error('Error testing Hikvision device:', err);
      toast.error('Device connection test failed');
      
      // Update device status in the database
      await supabase
        .from('hikvision_devices')
        .update({ 
          sync_status: 'failed',
          last_sync: new Date().toISOString()
        })
        .eq('id', deviceId);
        
      // Refresh devices
      await fetchDevices();
    } finally {
      setTestingDevice(false);
      setTestingDeviceId(null);
    }
  };
  
  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hikvision_devices')
        .delete()
        .eq('id', deviceId);
        
      if (error) throw error;
      
      toast.success('Device deleted successfully');
      await fetchDevices();
    } catch (err) {
      console.error('Error deleting Hikvision device:', err);
      toast.error('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSyncAllDevices = async () => {
    try {
      setSyncingDevices(true);
      
      // Call your API endpoint to sync all devices
      const response = await axios.post('/api/access-control/hikvision/sync-all-devices', {
        branchId,
      });
      
      if (response.data.success) {
        toast.success('All devices synced successfully');
        await fetchDevices();
      } else {
        toast.error('Failed to sync all devices');
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
                            <Badge className="ml-2" variant={device.device_type === 'door_controller' ? 'default' : device.device_type === 'camera' ? 'secondary' : 'outline'}>
                              {device.device_type === 'door_controller' ? 'Door Controller' : 
                               device.device_type === 'camera' ? 'Camera' : 'Other'}
                            </Badge>
                            {device.sync_status && (
                              <Badge className="ml-2" variant={device.sync_status === 'success' ? 'success' : device.sync_status === 'failed' ? 'destructive' : 'outline'}>
                                {device.sync_status === 'success' ? 'Synced' : 
                                 device.sync_status === 'failed' ? 'Sync Failed' : 'Pending'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {device.ip_address}:{device.port} • ID: {device.device_id}
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Select 
                  value={deviceType} 
                  onValueChange={(value) => setDeviceType(value as 'door_controller' | 'camera' | 'other')}
                  disabled={loading}
                >
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
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
