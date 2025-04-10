
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye, HelpCircle, Building } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { hikvisionPartnerService } from "@/services/integrations/hikvisionPartnerService";
import settingsService, { AccessControlSettings } from "@/services/settingsService";

// Define the form schema with Zod
const hikvisionSchema = z.object({
  appKey: z.string().min(1, { message: "AppKey is required" }),
  secretKey: z.string().min(1, { message: "SecretKey is required" }),
  siteId: z.string().min(1, { message: "Please select a site" }),
  deviceSerials: z.object({
    entryDevice1: z.string().default(""),
    entryDevice2: z.string().default(""),
    entryDevice3: z.string().default(""),
    swimmingDevice: z.string().default(""),
  }),
  planBasedAccess: z.object({
    gymOnlyAccess: z.boolean().default(true),
    swimmingOnlyAccess: z.boolean().default(true),
    bothAccess: z.boolean().default(true),
  }),
});

type HikvisionFormValues = z.infer<typeof hikvisionSchema>;

interface Site {
  id: string;
  name: string;
}

const HikvisionSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Default values for the form
  const defaultValues: HikvisionFormValues = {
    appKey: "",
    secretKey: "",
    siteId: "",
    deviceSerials: {
      entryDevice1: "",
      entryDevice2: "",
      entryDevice3: "",
      swimmingDevice: "",
    },
    planBasedAccess: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: true,
      bothAccess: true,
    },
  };

  const form = useForm<HikvisionFormValues>({
    resolver: zodResolver(hikvisionSchema),
    defaultValues,
  });

  // Fetch existing settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getAccessControlSettings();
        form.reset(settings);
        
        // Load sites from hikvision service (this would be a real API call in production)
        const mockSites = [
          { id: "site1", name: "Main Branch" },
          { id: "site2", name: "Downtown Branch" },
          { id: "site3", name: "East Wing" },
        ];
        setSites(mockSites);
        
      } catch (error) {
        console.error("Failed to fetch Hikvision settings:", error);
        // Don't show error toast on initial load as it might not exist yet
      }
    };

    fetchSettings();
  }, [form]);

  async function onSubmit(data: HikvisionFormValues) {
    try {
      setIsLoading(true);
      
      // Save credentials to the Hikvision service first
      await hikvisionPartnerService.saveCredentials(data.appKey, data.secretKey);
      
      // Then save all settings to the settings service
      // Explicitly cast the form data to AccessControlSettings to ensure all required fields are present
      const accessControlSettings: AccessControlSettings = {
        appKey: data.appKey,
        secretKey: data.secretKey,
        siteId: data.siteId,
        deviceSerials: {
          entryDevice1: data.deviceSerials.entryDevice1,
          entryDevice2: data.deviceSerials.entryDevice2,
          entryDevice3: data.deviceSerials.entryDevice3,
          swimmingDevice: data.deviceSerials.swimmingDevice,
        },
        planBasedAccess: {
          gymOnlyAccess: data.planBasedAccess.gymOnlyAccess,
          swimmingOnlyAccess: data.planBasedAccess.swimmingOnlyAccess,
          bothAccess: data.planBasedAccess.bothAccess,
        }
      };
      
      await settingsService.updateAccessControlSettings(accessControlSettings);
      
      toast.success("Hikvision access control settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await hikvisionPartnerService.testConnection();
      if (result.success) {
        toast.success("Connection successful", {
          description: "Successfully connected to Hikvision Partner API.",
        });
      } else {
        toast.error("Connection failed", {
          description: result.message || "Failed to connect to Hikvision Partner API.",
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Connection test failed");
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control Settings</CardTitle>
        <CardDescription>
          Configure Hikvision integration for gym access control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hikvision Partner API Credentials</h3>
              <p className="text-sm text-muted-foreground">
                Enter your Hikvision Partner account credentials to enable access control integration.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="appKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hikvision Partner AppKey</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            placeholder="Enter AppKey" 
                            type={showSecrets ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                onClick={() => setShowSecrets(!showSecrets)}
                                className="ml-2"
                              >
                                {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{showSecrets ? "Hide" : "Show"} sensitive information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormDescription>
                        From your Hikvision Partner Pro console
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hikvision Partner SecretKey</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            placeholder="Enter SecretKey" 
                            type={showSecrets ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Keep this secret key secure
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={testConnection}
                  disabled={isTestingConnection || !form.getValues().appKey || !form.getValues().secretKey}
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Site Configuration</h3>
              
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              {site.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the Hikvision site for this gym branch
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Device Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Map device serials to specific entry points
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="deviceSerials.entryDevice1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gym Entry Device 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter device serial" {...field} />
                      </FormControl>
                      <FormDescription>
                        Main entrance device serial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceSerials.entryDevice2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gym Entry Device 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter device serial" {...field} />
                      </FormControl>
                      <FormDescription>
                        Secondary entrance device serial (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceSerials.entryDevice3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gym Entry Device 3</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter device serial" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tertiary entrance device serial (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceSerials.swimmingDevice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Swimming Pool Device</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter device serial" {...field} />
                      </FormControl>
                      <FormDescription>
                        Swimming pool entrance device serial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Plan-Based Access Rules</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Define which facilities are accessible based on membership plans</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="planBasedAccess.gymOnlyAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FormLabel className="text-base">Gym Only Plan</FormLabel>
                          <Badge variant="outline" className="ml-2">Basic</Badge>
                        </div>
                        <FormDescription>
                          Members with Gym-only plans can access main gym entrance devices
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="planBasedAccess.swimmingOnlyAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FormLabel className="text-base">Swimming Only Plan</FormLabel>
                          <Badge variant="outline" className="ml-2">Aqua</Badge>
                        </div>
                        <FormDescription>
                          Members with Swimming-only plans can access swimming pool entrance devices
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="planBasedAccess.bothAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FormLabel className="text-base">Premium Plan</FormLabel>
                          <Badge variant="outline" className="ml-2">All Access</Badge>
                        </div>
                        <FormDescription>
                          Members with Premium plans can access all facilities
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HikvisionSettings;
