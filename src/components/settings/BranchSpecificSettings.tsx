
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBranch } from '@/hooks/use-branch';
import { toast } from "sonner";
import { Building2, Clock, Users, Settings, Bell, Link, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Form schema
const branchSettingsSchema = z.object({
  general: z.object({
    openingHours: z.string().min(1, "Opening hours are required"),
    closingHours: z.string().min(1, "Closing hours are required"),
    maxCapacity: z.string().transform(val => parseInt(val, 10)).pipe(
      z.number().min(1, "Capacity must be at least 1")
    ),
    timezone: z.string().min(1, "Timezone is required"),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
    contactPhone: z.string().optional(),
  }),
  notifications: z.object({
    enableEmail: z.boolean().default(true),
    enableSms: z.boolean().default(false),
    enablePush: z.boolean().default(true),
    dailyDigest: z.boolean().default(true),
    capacityAlerts: z.boolean().default(true),
    maintenanceAlerts: z.boolean().default(true),
  }),
  integrations: z.object({
    hikvisionEnabled: z.boolean().default(false),
    paymentProcessorId: z.string().optional(),
    smsProviderId: z.string().optional(),
    emailProviderId: z.string().optional(),
  }),
});

type BranchSettingsFormValues = z.infer<typeof branchSettingsSchema>;

const BranchSpecificSettings = () => {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Mock data for demonstration
  const paymentProcessors = [
    { id: "razorpay", name: "Razorpay" },
    { id: "stripe", name: "Stripe" },
    { id: "paytm", name: "Paytm" },
  ];

  const smsProviders = [
    { id: "twilio", name: "Twilio" },
    { id: "msg91", name: "MSG91" },
    { id: "textlocal", name: "Textlocal" },
  ];

  const emailProviders = [
    { id: "mailgun", name: "Mailgun" },
    { id: "sendgrid", name: "SendGrid" },
    { id: "smtp", name: "Custom SMTP" },
  ];

  const form = useForm<BranchSettingsFormValues>({
    resolver: zodResolver(branchSettingsSchema),
    defaultValues: {
      general: {
        openingHours: "06:00",
        closingHours: "22:00",
        maxCapacity: "200",
        timezone: "Asia/Kolkata",
        description: "",
        contactEmail: "",
        contactPhone: "",
      },
      notifications: {
        enableEmail: true,
        enableSms: false,
        enablePush: true,
        dailyDigest: true,
        capacityAlerts: true,
        maintenanceAlerts: true,
      },
      integrations: {
        hikvisionEnabled: false,
        paymentProcessorId: "",
        smsProviderId: "",
        emailProviderId: "",
      },
    },
  });

  useEffect(() => {
    if (currentBranch) {
      fetchBranchSettings();
    }
  }, [currentBranch]);

  const fetchBranchSettings = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Example of branch-specific settings
      if (currentBranch?.id === 'branch1') {
        form.reset({
          general: {
            openingHours: "06:00",
            closingHours: "22:00",
            maxCapacity: "200",
            timezone: "Asia/Kolkata",
            description: "Our flagship branch with full amenities",
            contactEmail: "downtown@musclegarage.com",
            contactPhone: "555-1234",
          },
          notifications: {
            enableEmail: true,
            enableSms: true,
            enablePush: true,
            dailyDigest: true,
            capacityAlerts: true,
            maintenanceAlerts: true,
          },
          integrations: {
            hikvisionEnabled: true,
            paymentProcessorId: "razorpay",
            smsProviderId: "twilio",
            emailProviderId: "sendgrid",
          },
        });
      } else if (currentBranch?.id === 'branch2') {
        form.reset({
          general: {
            openingHours: "05:00",
            closingHours: "23:00",
            maxCapacity: "150",
            timezone: "Asia/Kolkata",
            description: "Modern facilities in the heart of the city",
            contactEmail: "westside@musclegarage.com",
            contactPhone: "555-5678",
          },
          notifications: {
            enableEmail: true,
            enableSms: false,
            enablePush: true,
            dailyDigest: false,
            capacityAlerts: true,
            maintenanceAlerts: false,
          },
          integrations: {
            hikvisionEnabled: false,
            paymentProcessorId: "paytm",
            smsProviderId: "",
            emailProviderId: "mailgun",
          },
        });
      } else {
        // Default values for new branches
        form.reset({
          general: {
            openingHours: "06:00",
            closingHours: "22:00",
            maxCapacity: "100",
            timezone: "Asia/Kolkata",
            description: "",
            contactEmail: "",
            contactPhone: "",
          },
          notifications: {
            enableEmail: true,
            enableSms: false,
            enablePush: true,
            dailyDigest: true,
            capacityAlerts: true,
            maintenanceAlerts: true,
          },
          integrations: {
            hikvisionEnabled: false,
            paymentProcessorId: "",
            smsProviderId: "",
            emailProviderId: "",
          },
        });
      }
    } catch (error) {
      console.error('Error fetching branch settings:', error);
      toast.error('Failed to load branch settings');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<BranchSettingsFormValues> = async (data) => {
    if (!currentBranch) {
      toast.error('No branch selected');
      return;
    }
    
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving branch settings:', data);
      
      toast.success('Branch settings saved successfully');
    } catch (error) {
      console.error('Error saving branch settings:', error);
      toast.error('Failed to save branch settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Branch Settings</CardTitle>
            <CardDescription>
              Configure settings for {currentBranch?.name || 'this branch'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {currentBranch?.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center">
                  <Link className="mr-2 h-4 w-4" />
                  Integrations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="general.openingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Hours</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the branch opens daily
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="general.closingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Hours</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the branch closes daily
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="general.maxCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum number of members allowed at once
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="general.timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Local timezone for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="general.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a description for this branch" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of this branch and its facilities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="general.contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="branch@musclegarage.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Public contact email for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="general.contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormDescription>
                          Public contact phone for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="pt-6 space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enable-email" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Send notifications via email to members
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.enableEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="enable-email"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enable-sms" className="flex flex-col space-y-1">
                      <span>SMS Notifications</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Send notifications via SMS to members
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.enableSms"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="enable-sms"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enable-push" className="flex flex-col space-y-1">
                      <span>Push Notifications</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Send push notifications to mobile app users
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.enablePush"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="enable-push"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Notification Types</h3>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="daily-digest" className="flex flex-col space-y-1">
                      <span>Daily Digest</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Send a daily summary of branch activity
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.dailyDigest"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="daily-digest"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="capacity-alerts" className="flex flex-col space-y-1">
                      <span>Capacity Alerts</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Notify when branch reaches 80% capacity
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.capacityAlerts"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="capacity-alerts"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="maintenance-alerts" className="flex flex-col space-y-1">
                      <span>Maintenance Alerts</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Notify about scheduled maintenance
                      </span>
                    </Label>
                    <FormField
                      control={form.control}
                      name="notifications.maintenanceAlerts"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              id="maintenance-alerts"
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integrations" className="pt-6 space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Hikvision Access Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable Hikvision access control integration for this branch
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="integrations.hikvisionEnabled"
                    render={({ field }) => (
                      <FormItem>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="integrations.paymentProcessorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Processor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment processor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {paymentProcessors.map(processor => (
                              <SelectItem key={processor.id} value={processor.id}>
                                {processor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Primary payment processor for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="integrations.smsProviderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMS Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select SMS provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {smsProviders.map(provider => (
                              <SelectItem key={provider.id} value={provider.id}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          SMS provider for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="integrations.emailProviderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select email provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {emailProviders.map(provider => (
                              <SelectItem key={provider.id} value={provider.id}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Email provider for this branch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => fetchBranchSettings()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSaving || isLoading}>
                {isSaving ? (
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

export default BranchSpecificSettings;
