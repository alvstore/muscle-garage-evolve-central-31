
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CheckCircle, XCircle, RefreshCw, Clock, UserCheck, Lock, Download, UploadCloud, Server, Shield } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';
import HikvisionDeviceManager from '@/components/access-control/HikvisionDeviceManager';
import HikvisionWebhookHandler from '@/components/access-control/HikvisionWebhookHandler';


const hikvisionCredentialsSchema = z.object({
  api_url: z.string().url({ message: "Please enter a valid API URL" }),
  app_key: z.string().min(1, { message: "App Key is required" }),
  app_secret: z.string().min(1, { message: "Secret Key is required" }),
  is_active: z.boolean().default(false),
});

const HikvisionIntegrationPage = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [errorLogs, setErrorLogs] = useState<Array<{time: string, message: string, code: string}>>([]);
  const [autoSync, setAutoSync] = useState(false);
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  
  const { 
    isLoading, 
    isConnected, 
    settings, 
    fetchSettings, 
    saveSettings, 
    testConnection,
    isSaving
  } = useHikvision();

  const form = useForm<z.infer<typeof hikvisionCredentialsSchema>>({
    resolver: zodResolver(hikvisionCredentialsSchema),
    defaultValues: {
      api_url: settings?.api_url || 'https://api.hikvision.com',
      app_key: settings?.app_key || '',
      app_secret: settings?.app_secret || '',
      is_active: settings?.is_active || false,
    },
  });

  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings().then(settings => {
        if (settings) {
          form.reset({
            apiUrl: settings.apiUrl,
            appKey: settings.appKey,
            secretKey: settings.appSecret,
          });
          
          // Set connected state based on existing settings
          if (isConnected === null) {
            testConnection({
              apiUrl: settings.apiUrl,
              appKey: settings.appKey,
              secretKey: settings.appSecret,
            });
          }
        }
      });
    }
  }, [currentBranch?.id]);

  const handleTestConnection = async () => {
    const formData = form.getValues();
    const result = await testConnection(formData);
    
    if (result.success) {
      toast.success('Successfully connected to Hikvision API');
    } else {
      toast.error(`Connection test failed: ${result.message}`);
      
      setErrorLogs(prev => [...prev, {
        time: new Date().toISOString(),
        message: result.message || 'Connection test failed',
        code: 'CONNECTION_FAILED'
      }]);
    }
  };

  const handleSave = async (values: z.infer<typeof hikvisionCredentialsSchema>) => {
    try {
      const result = await saveSettings({
        ...values,
        branch_id: currentBranch?.id || '',
      });
      if (result) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred while saving settings');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const clearErrorLogs = () => {
    setErrorLogs([]);
    toast.success('Error logs cleared');
  };

  if (!currentBranch?.id) {
    return (
      <div className="container py-6 mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold">No Branch Selected</h2>
            <p className="text-muted-foreground mt-2">Please select a branch to configure Hikvision integration</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PermissionGuard permission="full_system_access">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Hikvision Access Control Integration</h1>
          <p className="text-muted-foreground mt-2">
            Connect to Hikvision access control system to track member attendance automatically.
          </p>
        </div>

        <Tabs 
          defaultValue="settings" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="logs">Error Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Hikvision API Connection</CardTitle>
                <CardDescription>
                  Configure connection to your Hikvision access control system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center space-x-2">
                  <div className="font-medium">Connection Status:</div>
                  {isConnected === true ? (
                    <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4" /> Connected
                    </Badge>
                  ) : isLoading ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Testing Connection
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> Disconnected
                    </Badge>
                  )}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="apiUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://hikvision-controller.example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL of your Hikvision access control system API endpoint
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Hikvision App Key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2">
                      <Button type="submit" disabled={isLoading}>
                        {isConnected === true ? 'Update Connection' : 'Connect to Hikvision'}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleTestConnection}
                        disabled={isLoading}
                      >
                        Test Connection
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Automatic Sync Settings</CardTitle>
                <CardDescription>
                  Configure how and when attendance data is synchronized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <h4 className="font-medium">Enable Auto-Sync</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync access events to attendance records
                      </p>
                    </div>
                    <Switch 
                      checked={autoSync} 
                      onCheckedChange={setAutoSync} 
                      disabled={isConnected !== true} 
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Sync Frequency</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={autoSync ? "outline" : "ghost"} disabled={!autoSync}>
                        Every 15 minutes
                      </Button>
                      <Button variant={autoSync ? "default" : "ghost"} disabled={!autoSync}>
                        Hourly
                      </Button>
                      <Button variant={autoSync ? "outline" : "ghost"} disabled={!autoSync}>
                        Daily (midnight)
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select how often the system should fetch new access events
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Process Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="entry-as-check-in" checked={true} disabled={!autoSync} />
                        <label htmlFor="entry-as-check-in" className="text-sm">
                          Process "entry" events as check-ins
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="exit-as-check-out" checked={true} disabled={!autoSync} />
                        <label htmlFor="exit-as-check-out" className="text-sm">
                          Process "exit" events as check-outs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="denied-access-log" checked={true} disabled={!autoSync} />
                        <label htmlFor="denied-access-log" className="text-sm">
                          Log denied access attempts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled={!autoSync}>
                  Reset to Defaults
                </Button>
                <Button disabled={!autoSync}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices">
            <HikvisionDeviceManager />
          </TabsContent>

          <TabsContent value="events">
            <HikvisionWebhookHandler />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Error Logs</CardTitle>
                    <CardDescription>
                      Track and resolve integration errors
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearErrorLogs}
                    disabled={errorLogs.length === 0}
                  >
                    Clear Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {errorLogs.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 border-b bg-muted p-3 font-medium">
                      <div>Time</div>
                      <div>Error</div>
                      <div>Code</div>
                    </div>
                    <div className="divide-y max-h-96 overflow-auto">
                      {errorLogs.map((log, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 p-3 text-sm">
                          <div>{formatDate(log.time)}</div>
                          <div className="text-red-600">{log.message}</div>
                          <div><code>{log.code}</code></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">No errors found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      The integration is working correctly with no recorded errors.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Error logs are automatically cleared after 30 days
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </PermissionGuard>
    </div>
  );
};

export default HikvisionIntegrationPage;
