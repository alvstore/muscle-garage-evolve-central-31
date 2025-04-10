
import React, { useState } from "react";
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
import { Loader2, EyeOff, Eye, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the form schema with Zod
const accessControlSchema = z.object({
  appKey: z.string().min(1, { message: "AppKey is required" }),
  secretKey: z.string().min(1, { message: "SecretKey is required" }),
  siteId: z.string().min(1, { message: "Please select a site" }),
  deviceSerials: z.object({
    entryDevice1: z.string().optional(),
    entryDevice2: z.string().optional(),
    entryDevice3: z.string().optional(),
    swimmingDevice: z.string().optional(),
  }),
  planBasedAccess: z.object({
    gymOnlyAccess: z.boolean().default(true),
    swimmingOnlyAccess: z.boolean().default(true),
    bothAccess: z.boolean().default(true),
  }),
});

type AccessControlFormValues = z.infer<typeof accessControlSchema>;

const AccessControlSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  
  // Mock site data - in a real implementation, this would come from an API
  const mockSites = [
    { id: "site1", name: "Main Branch" },
    { id: "site2", name: "Downtown Branch" },
    { id: "site3", name: "East Wing" },
  ];

  // Default values for the form
  const defaultValues: Partial<AccessControlFormValues> = {
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

  const form = useForm<AccessControlFormValues>({
    resolver: zodResolver(accessControlSchema),
    defaultValues,
  });

  async function onSubmit(data: AccessControlFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      // with proper encryption for sensitive data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Access control settings saved:", data);
      toast.success("Access control settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control Settings</CardTitle>
        <CardDescription>
          Configure Hikvision integration for access control
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
                        {mockSites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name}
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
                        <FormLabel className="text-base">Gym Only Plan</FormLabel>
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
                        <FormLabel className="text-base">Swimming Only Plan</FormLabel>
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
                        <FormLabel className="text-base">Premium Plan</FormLabel>
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

export default AccessControlSettings;
