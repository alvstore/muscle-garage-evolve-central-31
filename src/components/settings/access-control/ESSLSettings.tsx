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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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

interface ESSLSettingsProps {
  branchId: string | null;
}

interface ESSLDevice {
  id: string;
  name: string;
  device_id: string;
  ip_address: string;
  port: string;
  comm_key: string;
  is_active: boolean;
  device_type: 'access_control' | 'time_attendance' | 'other';
  location?: string;
  last_sync?: string;
  sync_status?: 'success' | 'failed' | 'pending';
}

interface ESSLApiSettings {
  id: string;
  branch_id: string;
  sdk_path: string;
  is_active: boolean;
  devices: ESSLDevice[];
}

const ESSLSettings = ({ branchId }: ESSLSettingsProps) => {
  const [settings, setSettings] = useState<ESSLApiSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [sdkPath, setSdkPath] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  // Device management state
  const [devices, setDevices] = useState<ESSLDevice[]>([]);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<ESSLDevice | null>(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('4370');
  const [commKey, setCommKey] = useState('0');
  const [deviceType, setDeviceType] = useState<'access_control' | 'time_attendance' | 'other'>('access_control');
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
        .from('essl_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        setSettings(data);
        setSdkPath(data.sdk_path);
        setIsActive(data.is_active);
        
        // Fetch devices
        await fetchDevices();
      } else {
        setSettings(null);
        setSdkPath('');
        setIsActive(false);
        setDevices([]);
      }
    } catch (err) {
      console.error('Error fetching ESSL settings:', err);
      setError('Failed to load ESSL API settings. Please try again later.');
      toast.error('Failed to load ESSL API settings');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDevices = async () => {
    if (!branchId) return;
    
    try {
      const { data, error } = await supabase
        .from('essl_devices')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) throw error;
      
      setDevices(data || []);
    } catch (err) {
      console.error('Error fetching ESSL devices:', err);
      toast.error('Failed to load ESSL devices');
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId]);
  
  // Device management functions
  const openAddDeviceDialog = () => {
    setEditingDevice(null);
    setDeviceName('');
    setDeviceId('');
    setIpAddress('');
    setPort('4370');
    setCommKey('0');
    setDeviceType('access_control');
    setLocation('');
    setIsDeviceActive(true);
    setDeviceTestResult(null);
    setDeviceValidationErrors({});
    setDeviceDialogOpen(true);
  };
  
  const openEditDeviceDialog = (device: ESSLDevice) => {
    setEditingDevice(device);
    setDeviceName(device.name);
    setDeviceId(device.device_id);
    setIpAddress(device.ip_address);
    setPort(device.port);
    setCommKey(device.comm_key);
    setDeviceType(device.device_type);
    setLocation(device.location || '');
    setIsDeviceActive(device.is_active);
    setDeviceTestResult(null);
    setDeviceValidationErrors({});
    setDeviceDialogOpen(true);
  };
  
  const validateDeviceForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!deviceName.trim()) {
      errors.name = 'Device name is required';
    }
    
    if (!deviceId.trim()) {
      errors.deviceId = 'Device ID is required';
    } else if (!/^\d+$/.test(deviceId)) {
      errors.deviceId = 'Device ID must be a number';
    }
    
    if (!ipAddress.trim()) {
      errors.ipAddress = 'IP address is required';
    } else if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipAddress)) {
      errors.ipAddress = 'Invalid IP address format';
    }
    
    if (!port.trim()) {
      errors.port = 'Port is required';
    } else if (!/^\d+$/.test(port) || parseInt(port) < 1 || parseInt(port) > 65535) {
      errors.port = 'Port must be a number between 1 and 65535';
    }
    
    if (!commKey.trim()) {
      errors.commKey = 'Communication key is required';
    }
    
    setDeviceValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveDevice = async () => {
    if (!branchId) return;
    
    if (!validateDeviceForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const deviceData: any = {
        branch_id: branchId,
        name: deviceName.trim(),
        device_id: deviceId.trim(),
        ip_address: ipAddress.trim(),
        port: port.trim(),
        comm_key: commKey.trim(),
        device_type: deviceType,
        location: location.trim() || null,
        is_active: isDeviceActive
      };
      
      if (editingDevice) {
        // Update existing device
        const { error } = await supabase
          .from('essl_devices')
          .update(deviceData)
          .eq('id', editingDevice.id);
          
        if (error) throw error;
        
        toast.success('Device updated successfully');
      } else {
        // Create new device
        const { error } = await supabase
          .from('essl_devices')
          .insert(deviceData);
          
        if (error) throw error;
        
        toast.success('Device added successfully');
      }
      
      setDeviceDialogOpen(false);
      fetchDevices();
    } catch (err) {
      console.error('Error saving device:', err);
      toast.error('Failed to save device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDevice = async (deviceId: string) => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('essl_devices')
        .delete()
        .eq('id', deviceId);
        
      if (error) throw error;
      
      toast.success('Device removed successfully');
      fetchDevices();
    } catch (err) {
      console.error('Error deleting device:', err);
      toast.error('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestDevice = async (deviceId: string) => {
    if (!branchId) return;
    
    try {
      setTestingDevice(true);
      setTestingDeviceId(deviceId);
      setDeviceTestResult(null);
      
      // Get device details
      const { data: device, error } = await supabase
        .from('essl_devices')
        .select('*')
        .eq('id', deviceId)
        .single();
        
      if (error) throw error;
      
      // Call the API to test the device connection
      const response = await axios.post('/api/integrations/essl/test-device', {
        branchId,
        device
      });
      
      if (response.data.success) {
        setDeviceTestResult({
          success: true,
          message: 'Connection successful! Device is accessible.'
        });
        toast.success('Device connection test successful');
        
        // Update the device sync status
        await supabase
          .from('essl_devices')
          .update({
            sync_status: 'success',
            last_sync: new Date().toISOString()
          })
          .eq('id', deviceId);
          
        fetchDevices();
      } else {
        setDeviceTestResult({
          success: false,
          message: response.data.message || 'Connection failed. Please check your device settings.'
        });
        toast.error('Device connection test failed');
        
        // Update the device sync status
        await supabase
          .from('essl_devices')
          .update({
            sync_status: 'failed',
            last_sync: new Date().toISOString()
          })
          .eq('id', deviceId);
          
        fetchDevices();
      }
    } catch (err) {
      console.error('Error testing device connection:', err);
      toast.error('Device connection test failed');
      
      // Update the device sync status
      await supabase
        .from('essl_devices')
        .update({
          sync_status: 'failed',
          last_sync: new Date().toISOString()
        })
        .eq('id', deviceId);
        
      fetchDevices();
    } finally {
      setTestingDevice(false);
      setTestingDeviceId(null);
    }
  };
  
  const handleSyncAllDevices = async () => {
    if (!branchId || devices.length === 0) return;
    
    try {
      setSyncingDevices(true);
      
      // Call the API to sync all devices
      const response = await axios.post('/api/integrations/essl/sync-all-devices', {
        branchId
      });
      
      if (response.data.success) {
        toast.success('All devices synced successfully');
      } else {
        toast.error('Failed to sync all devices');
      }
      
      fetchDevices();
    } catch (err) {
      console.error('Error syncing all devices:', err);
      toast.error('Failed to sync all devices');
    } finally {
      setSyncingDevices(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!sdkPath.trim()) {
        toast.error('SDK path is required');
        return;
      }
      
      const settingsData: any = {
        branch_id: branchId,
        sdk_path: sdkPath,
        is_active: isActive
      };
      
      if (settings) {
        // Update existing settings
        const { error } = await supabase
          .from('essl_api_settings')
          .update(settingsData)
          .eq('id', settings.id);
          
        if (error) {
          throw error;
        }
        
        toast.success('ESSL API settings updated successfully');
      } else {
        // Create new settings
        const { error } = await supabase
          .from('essl_api_settings')
          .insert(settingsData);
          
        if (error) {
          throw error;
        }
        
        toast.success('ESSL API settings created successfully');
      }
      
      fetchSettings();
    } catch (err) {
      console.error('Error saving ESSL settings:', err);
      toast.error('Failed to save ESSL API settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!branchId) return;
    
    try {
      setTestingConnection(true);
      setTestResult(null);
      
      // Call the API to test the connection
      const response = await axios.post('/api/integrations/essl/test-connection', {
        branchId,
        sdkPath
      });
      
      if (response.data.success) {
        setTestResult({
          success: true,
          message: 'Connection successful! ESSL SDK is accessible.'
        });
        toast.success('Connection test successful');
      } else {
        setTestResult({
          success: false,
          message: response.data.message || 'Connection failed. Please check your SDK path.'
        });
        toast.error('Connection test failed');
      }
    } catch (err) {
      console.error('Error testing ESSL connection:', err);
      setTestResult({
        success: false,
        message: err.response?.data?.message || 'Connection failed. Please check your SDK path.'
      });
      toast.error('Connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

  if (!branchId) {
    return (
      <div className="text-center p-4">
        Please select a branch to configure ESSL settings
      </div>
    );
  }

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading ESSL settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>ESSL SDK Configuration</CardTitle>
          <CardDescription>
            Configure the ESSL SDK integration for access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-active">Enable ESSL Integration</Label>
              <Switch 
                id="is-active" 
                checked={isActive} 
                onCheckedChange={setIsActive} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="sdk-path">SDK Path</Label>
              <Input
                id="sdk-path"
                value={sdkPath}
                onChange={(e) => setSdkPath(e.target.value)}
                placeholder="/path/to/essl/sdk"
              />
              <p className="text-sm text-muted-foreground">
                The path to the ESSL SDK installation
              </p>
            </div>
          </div>
          
          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"} className="mt-4">
              <AlertTitle>
                {testResult.success ? "Connection Successful" : "Connection Failed"}
              </AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={testingConnection || loading || !sdkPath}
          >
            {testingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={loading}
          >
            {loading ? (
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
      
      {settings && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                Configure ESSL devices for this branch
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
                            <Badge className="ml-2" variant={device.device_type === 'access_control' ? 'default' : device.device_type === 'time_attendance' ? 'secondary' : 'outline'}>
                              {device.device_type === 'access_control' ? 'Access Control' : 
                               device.device_type === 'time_attendance' ? 'Time Attendance' : 'Other'}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDevice ? 'Edit Device' : 'Add Device'}
            </DialogTitle>
            <DialogDescription>
              Configure an ESSL device for access control
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Main Entrance Access Control"
              />
              {deviceValidationErrors.name && (
                <p className="text-sm text-destructive">{deviceValidationErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device-id">Device ID</Label>
              <Input
                id="device-id"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="1"
              />
              <p className="text-sm text-muted-foreground">
                The numeric ID of the device (e.g., 1, 2, 3)
              </p>
              {deviceValidationErrors.deviceId && (
                <p className="text-sm text-destructive">{deviceValidationErrors.deviceId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select 
                value={deviceType} 
                onValueChange={(value) => setDeviceType(value as 'access_control' | 'time_attendance' | 'other')}
              >
                <SelectTrigger id="device-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access_control">Access Control</SelectItem>
                  <SelectItem value="time_attendance">Time Attendance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip-address">IP Address</Label>
                <Input
                  id="ip-address"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.100"
                />
                {deviceValidationErrors.ipAddress && (
                  <p className="text-sm text-destructive">{deviceValidationErrors.ipAddress}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="4370"
                />
                {deviceValidationErrors.port && (
                  <p className="text-sm text-destructive">{deviceValidationErrors.port}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comm-key">Communication Key</Label>
              <Input
                id="comm-key"
                value={commKey}
                onChange={(e) => setCommKey(e.target.value)}
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground">
                Default is 0 for most devices
              </p>
              {deviceValidationErrors.commKey && (
                <p className="text-sm text-destructive">{deviceValidationErrors.commKey}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Main Entrance"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-device-active" 
                checked={isDeviceActive} 
                onCheckedChange={setIsDeviceActive} 
              />
              <Label htmlFor="is-device-active">Device Active</Label>
            </div>
            
            {deviceTestResult && (
              <Alert variant={deviceTestResult.success ? "default" : "destructive"} className="mt-4">
                <AlertTitle>
                  {deviceTestResult.success ? "Connection Successful" : "Connection Failed"}
                </AlertTitle>
                <AlertDescription>{deviceTestResult.message}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeviceDialogOpen(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {editingDevice && (
                <Button 
                  variant="outline" 
                  onClick={() => handleTestDevice(editingDevice.id)}
                  disabled={testingDevice}
                >
                  {testingDevice ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              )}
              <Button 
                onClick={handleSaveDevice} 
                disabled={loading || testingDevice}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Device'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ESSLSettings;
