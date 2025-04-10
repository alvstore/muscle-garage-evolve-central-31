
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
import { hikvisionService, HikvisionCredentials, HikvisionEvent } from '@/services/integrations/hikvisionService';
import { usePermissions } from '@/hooks/use-permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';

// Schema for Hikvision API credentials
const hikvisionCredentialsSchema = z.object({
  apiUrl: z.string().url({ message: "Please enter a valid API URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const HikvisionIntegrationPage = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [autoSync, setAutoSync] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [events, setEvents] = useState<HikvisionEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [attendanceProcessed, setAttendanceProcessed] = useState(0);
  const { can } = usePermissions();

  // Initialize form with react-hook-form
  const form = useForm<HikvisionCredentials>({
    resolver: zodResolver(hikvisionCredentialsSchema),
    defaultValues: {
      apiUrl: '',
      username: '',
      password: '',
    },
  });

  // Load saved credentials from localStorage on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('hikvisionCredentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        form.reset(parsed);
        testConnection(parsed);
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
      }
    }
  }, []);

  // Test the Hikvision API connection
  const testConnection = async (credentials: HikvisionCredentials) => {
    setConnectionStatus('testing');
    try {
      const success = await hikvisionService.testConnection(credentials);
      if (success) {
        setConnectionStatus('connected');
        toast.success('Successfully connected to Hikvision API');
        return true;
      } else {
        setConnectionStatus('disconnected');
        toast.error('Failed to connect to Hikvision API');
        return false;
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('disconnected');
      toast.error('Error testing connection to Hikvision API');
      return false;
    }
  };

  // Save credentials and test connection
  const onSubmit = async (data: HikvisionCredentials) => {
    const success = await testConnection(data);
    if (success) {
      // Save credentials to localStorage
      localStorage.setItem('hikvisionCredentials', JSON.stringify(data));
    }
  };

  // Fetch recent events from Hikvision
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      // Get events from the last 24 hours
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const startTime = oneDayAgo.toISOString();
      const endTime = now.toISOString();
      
      const fetchedEvents = await hikvisionService.getEvents(startTime, endTime);
      setEvents(fetchedEvents);
      setLastSyncTime(new Date().toISOString());
      toast.success(`Fetched ${fetchedEvents.length} access events`);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to fetch access events');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Process attendance from events
  const processAttendance = async () => {
    if (events.length === 0) {
      toast.error('No events to process');
      return;
    }

    try {
      const count = await hikvisionService.processAttendance(events);
      setAttendanceProcessed(count);
      if (count > 0) {
        toast.success(`Processed ${count} attendance records`);
      } else {
        toast.info('No new attendance records to process');
      }
    } catch (error) {
      console.error('Failed to process attendance:', error);
      toast.error('Failed to process attendance records');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PermissionGuard permission="full_system_access">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Hikvision Access Control Integration</h1>
          <p className="text-muted-foreground mt-2">
            Connect to Hikvision access control system to track member attendance automatically.
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="sync">Attendance Sync</TabsTrigger>
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
                  {connectionStatus === 'connected' ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Connected
                    </Badge>
                  ) : connectionStatus === 'testing' ? (
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
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="admin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2">
                      <Button type="submit" disabled={connectionStatus === 'testing'}>
                        {connectionStatus === 'connected' ? 'Update Connection' : 'Connect to Hikvision'}
                      </Button>
                      
                      {connectionStatus === 'connected' && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => testConnection(form.getValues())}
                        >
                          Test Connection
                        </Button>
                      )}
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
                      disabled={connectionStatus !== 'connected'} 
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

          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Access Events</CardTitle>
                  <CardDescription>
                    Access control events from your Hikvision system
                  </CardDescription>
                </div>
                <Button 
                  onClick={fetchEvents} 
                  disabled={isLoadingEvents || connectionStatus !== 'connected'}
                  className="flex items-center gap-1"
                >
                  {isLoadingEvents ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Refresh Events
                </Button>
              </CardHeader>
              <CardContent>
                {lastSyncTime && (
                  <div className="mb-4 flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Last synchronized: {formatDate(lastSyncTime)}
                  </div>
                )}

                {events.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 border-b bg-muted p-3 font-medium">
                      <div>Event Time</div>
                      <div>Type</div>
                      <div>Person</div>
                      <div>Door/Device</div>
                      <div>Card/Face ID</div>
                    </div>
                    <div className="divide-y max-h-96 overflow-auto">
                      {events.map((event) => (
                        <div key={event.eventId} className="grid grid-cols-5 gap-4 p-3 text-sm">
                          <div>{formatDate(event.eventTime)}</div>
                          <div>
                            <Badge 
                              variant={
                                event.eventType === 'entry' ? 'success' :
                                event.eventType === 'exit' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {event.eventType.toUpperCase()}
                            </Badge>
                          </div>
                          <div>{event.personName || event.personId}</div>
                          <div>{event.doorName || event.doorId}</div>
                          <div>{event.cardNo || event.faceId || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Click the "Refresh Events" button to fetch recent access events from your Hikvision system.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Attendance Processing</CardTitle>
                  <CardDescription>
                    Process access events into attendance records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Available Events</h4>
                        <p className="text-sm text-muted-foreground">
                          {events.length} event(s) ready to process
                        </p>
                      </div>
                      <Button 
                        onClick={processAttendance} 
                        disabled={events.length === 0}
                        className="flex items-center gap-1"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Process Attendance
                      </Button>
                    </div>

                    {attendanceProcessed > 0 && (
                      <div className="rounded-md bg-muted p-4">
                        <h4 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Processing Complete
                        </h4>
                        <p className="text-sm mt-2">
                          Successfully processed {attendanceProcessed} attendance records from access events.
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Export Events
                        </Button>
                        <Button variant="outline" className="justify-start" disabled={events.length === 0}>
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Upload Events
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Advanced settings for Hikvision integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <h4 className="font-medium">Webhook Configuration</h4>
                      <div className="flex items-center p-2 rounded-md bg-muted">
                        <code className="text-xs flex-1 overflow-auto">
                          https://yourdomain.com/api/webhooks/hikvision
                        </code>
                        <Button size="icon" variant="ghost">
                          <Server className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure your Hikvision system to send real-time events to this webhook URL
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Security Settings</h4>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <p className="text-sm">Enable Webhook Authentication</p>
                          <p className="text-xs text-muted-foreground">
                            Require authentication for incoming webhook requests
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Regenerate Webhook Secret
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">API Limits & Throttling</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm block mb-1">Max API Calls</label>
                          <Input type="number" defaultValue="100" disabled={connectionStatus !== 'connected'} />
                        </div>
                        <div>
                          <label className="text-sm block mb-1">Timeout (seconds)</label>
                          <Input type="number" defaultValue="30" disabled={connectionStatus !== 'connected'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Configuration</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PermissionGuard>
    </div>
  );
};

export default HikvisionIntegrationPage;
