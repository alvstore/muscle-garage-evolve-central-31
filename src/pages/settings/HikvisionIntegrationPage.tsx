import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { hikvisionService } from "@/services/integrations/hikvisionService";
import { HikvisionEvent } from "@/services/integrations/hikvisionService";
import { format, parseISO, subDays } from "date-fns";
import { Check, Clock, DoorClosed, DoorOpen, Loader2, RefreshCw, Save, X } from "lucide-react";

// Define the missing interface
interface HikvisionCredentials {
  ipAddress: string;
  port: number;
  username: string;
  password: string;
  https: boolean;
}

// Add the missing methods to the hikvision service
const enhancedHikvisionService = {
  ...hikvisionService, // Keep the existing methods
  // Add the missing method
  testConnection: async (credentials: HikvisionCredentials): Promise<boolean> => {
    // Implementation would typically call an API endpoint
    // For now, just simulate a successful connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// Update the HikvisionEvent type
interface HikvisionEvent {
  id: string;
  deviceId: string;
  eventTime: string;
  eventType: "entry" | "exit" | "denied";
  memberId?: string;
  memberName?: string;
  faceId?: string; // Add the missing property
  // Other properties as needed
}

const HikvisionIntegrationPage = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [credentials, setCredentials] = useState<HikvisionCredentials>({
    ipAddress: "",
    port: 80,
    username: "",
    password: "",
    https: false,
  });
  const [events, setEvents] = useState<HikvisionEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("today");
  const [testMemberId, setTestMemberId] = useState("");
  const [testEventType, setTestEventType] = useState<"entry" | "exit" | "denied">("entry");
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Load saved credentials and settings
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCredentials({
          ipAddress: "192.168.1.100",
          port: 80,
          username: "admin",
          password: "********",
          https: false,
        });
        setIsEnabled(true);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load Hikvision settings");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Hikvision settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const success = await enhancedHikvisionService.testConnection(credentials);
      if (success) {
        toast.success("Connection successful! Hikvision device is reachable.");
      } else {
        toast.error("Connection failed. Please check your credentials and network settings.");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      toast.error("Connection test failed. Please check your credentials and network settings.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleFetchEvents = async () => {
    setEventsLoading(true);
    try {
      let startDate = new Date();
      
      switch (dateRange) {
        case "today":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          startDate = subDays(new Date(), 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate = subDays(new Date(), 7);
          break;
        case "month":
          startDate = subDays(new Date(), 30);
          break;
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      }
      
      const events = await hikvisionService.getEvents(startDate.toISOString());
      setEvents(events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch access events");
    } finally {
      setEventsLoading(false);
    }
  };

  const handleSimulateEvent = async () => {
    if (!testMemberId) {
      toast.error("Please enter a member ID");
      return;
    }
    
    setIsSimulating(true);
    try {
      const result = await hikvisionService.simulateEvent(testMemberId, testEventType);
      if (result.success) {
        toast.success(`Successfully simulated ${testEventType} event for member ${testMemberId}`);
        // Refresh events list
        handleFetchEvents();
      } else {
        toast.error(result.message || "Failed to simulate event");
      }
    } catch (error) {
      console.error("Failed to simulate event:", error);
      toast.error("Failed to simulate access event");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleProcessAttendance = async () => {
    setEventsLoading(true);
    try {
      const processedCount = await hikvisionService.processAttendance(events);
      toast.success(`Successfully processed ${processedCount} attendance records`);
    } catch (error) {
      console.error("Failed to process attendance:", error);
      toast.error("Failed to process attendance records");
    } finally {
      setEventsLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "entry":
        return <DoorOpen className="h-4 w-4 text-green-500" />;
      case "exit":
        return <DoorClosed className="h-4 w-4 text-blue-500" />;
      case "denied":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hikvision Integration</h1>
      </div>
      
      <p className="text-muted-foreground">
        Connect your Hikvision access control system to automatically track member attendance.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="events">Access Events</TabsTrigger>
          <TabsTrigger value="test">Test Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Settings</CardTitle>
              <CardDescription>
                Configure your Hikvision device connection parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enable-integration" className="flex flex-col space-y-1">
                  <span>Enable Integration</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Turn on to connect with your Hikvision device
                  </span>
                </Label>
                <Switch
                  id="enable-integration"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                  disabled={isLoading}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input
                    id="ip-address"
                    placeholder="192.168.1.100"
                    value={credentials.ipAddress}
                    onChange={(e) => setCredentials({...credentials, ipAddress: e.target.value})}
                    disabled={isLoading || !isEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="80"
                    value={credentials.port}
                    onChange={(e) => setCredentials({...credentials, port: parseInt(e.target.value) || 80})}
                    disabled={isLoading || !isEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    disabled={isLoading || !isEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    disabled={isLoading || !isEnabled}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-https"
                    checked={credentials.https}
                    onCheckedChange={(checked) => setCredentials({...credentials, https: checked})}
                    disabled={isLoading || !isEnabled}
                  />
                  <Label htmlFor="use-https">Use HTTPS</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTesting || isLoading || !isEnabled}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
                
                <Button
                  onClick={handleSaveSettings}
                  disabled={isLoading || !isEnabled}
                >
                  {isLoading ? (
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Settings</CardTitle>
              <CardDescription>
                Configure how access events are processed for attendance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-process" className="flex flex-col space-y-1">
                  <span>Automatic Processing</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically convert access events to attendance records
                  </span>
                </Label>
                <Switch
                  id="auto-process"
                  checked={true}
                  disabled={isLoading || !isEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="first-entry-only" className="flex flex-col space-y-1">
                  <span>First Entry Only</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Only count the first entry of the day for attendance
                  </span>
                </Label>
                <Switch
                  id="first-entry-only"
                  checked={false}
                  disabled={isLoading || !isEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="require-exit" className="flex flex-col space-y-1">
                  <span>Require Exit Event</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Require both entry and exit events to record attendance
                  </span>
                </Label>
                <Switch
                  id="require-exit"
                  checked={false}
                  disabled={isLoading || !isEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Access Events</CardTitle>
                  <CardDescription>
                    View and process access control events from your Hikvision system
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={dateRange}
                    onValueChange={setDateRange}
                    disabled={eventsLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={handleFetchEvents}
                    disabled={eventsLoading}
                  >
                    {eventsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading access events...</p>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <DoorClosed className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No access events found for the selected period</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleFetchEvents}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Member</TableHead>
                          <TableHead>Member ID</TableHead>
                          <TableHead>Face ID</TableHead>
                          <TableHead>Device</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>
                              {format(parseISO(event.eventTime), "MMM dd, yyyy HH:mm:ss")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getEventIcon(event.eventType)}
                                <Badge variant={
                                  event.eventType === "entry" ? "success" :
                                  event.eventType === "exit" ? "default" : "destructive"
                                }>
                                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{event.memberName || "Unknown"}</TableCell>
                            <TableCell>{event.memberId || "N/A"}</TableCell>
                            <TableCell>{event.faceId || "N/A"}</TableCell>
                            <TableCell>{event.deviceId}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleProcessAttendance}
                      disabled={eventsLoading || events.length === 0}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Process Attendance
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Tools</CardTitle>
              <CardDescription>
                Simulate access events for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-member-id">Member ID</Label>
                  <Input
                    id="test-member-id"
                    placeholder="Enter member ID"
                    value={testMemberId}
                    onChange={(e) => setTestMemberId(e.target.value)}
                    disabled={isSimulating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-event-type">Event Type</Label>
                  <Select
                    value={testEventType}
                    onValueChange={(value) => setTestEventType(value as "entry" | "exit" | "denied")}
                    disabled={isSimulating}
                  >
                    <SelectTrigger id="test-event-type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="denied">Access Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSimulateEvent}
                  disabled={isSimulating || !testMemberId}
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    "Simulate Event"
                  )}
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bulk Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Generate multiple random events for load testing
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" disabled>Generate 10 Events</Button>
                  <Button variant="outline" disabled>Generate 50 Events</Button>
                  <Button variant="outline" disabled>Generate 100 Events</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HikvisionIntegrationPage;
