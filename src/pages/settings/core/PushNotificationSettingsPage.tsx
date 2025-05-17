
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Bell, Settings, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pushConfigSchema = z.object({
  firebase: z.object({
    enabled: z.boolean().default(false),
    apiKey: z.string().min(1, { message: "API Key is required" }).optional().or(z.literal("")),
    authDomain: z.string().optional().or(z.literal("")),
    projectId: z.string().optional().or(z.literal("")),
    messagingSenderId: z.string().optional().or(z.literal("")),
    appId: z.string().optional().or(z.literal(""))
  }),
  oneSignal: z.object({
    enabled: z.boolean().default(false),
    appId: z.string().optional().or(z.literal("")),
    apiKey: z.string().optional().or(z.literal(""))
  })
});

type PushConfigFormValues = z.infer<typeof pushConfigSchema>;

const PushNotificationSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("firebase");
  const [isLoading, setIsLoading] = useState(false);
  
  // Default values for the form
  const defaultValues: PushConfigFormValues = {
    firebase: {
      enabled: false,
      apiKey: "",
      authDomain: "",
      projectId: "",
      messagingSenderId: "",
      appId: ""
    },
    oneSignal: {
      enabled: false,
      appId: "",
      apiKey: ""
    }
  };

  const form = useForm<PushConfigFormValues>({
    resolver: zodResolver(pushConfigSchema),
    defaultValues,
  });

  async function onSubmit(data: PushConfigFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Push notification settings saved:", data);
      toast.success("Push notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/integrations">
              Integrations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/integrations/push" isCurrentPage>
              Push Notifications
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Push Notification Settings</h1>
            <p className="text-muted-foreground">Configure push notification providers for mobile and web apps</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-2 w-full md:w-auto">
                <TabsTrigger value="firebase" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Firebase</span>
                </TabsTrigger>
                <TabsTrigger value="onesignal" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>OneSignal</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="firebase">
                <Card>
                  <CardHeader>
                    <CardTitle>Firebase Cloud Messaging</CardTitle>
                    <CardDescription>
                      Configure Firebase Cloud Messaging for push notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="firebase.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Firebase Notifications</FormLabel>
                            <FormDescription>
                              Use Firebase Cloud Messaging for push notifications
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
                    
                    {form.watch("firebase.enabled") && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="firebase.apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Firebase API Key</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter API Key" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firebase.authDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Auth Domain</FormLabel>
                              <FormControl>
                                <Input placeholder="project-id.firebaseapp.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firebase.projectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project ID</FormLabel>
                              <FormControl>
                                <Input placeholder="project-id" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firebase.messagingSenderId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Messaging Sender ID</FormLabel>
                              <FormControl>
                                <Input placeholder="123456789012" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firebase.appId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>App ID</FormLabel>
                              <FormControl>
                                <Input placeholder="1:123456789012:web:abc123def456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="onesignal">
                <Card>
                  <CardHeader>
                    <CardTitle>OneSignal</CardTitle>
                    <CardDescription>
                      Configure OneSignal for cross-platform push notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="oneSignal.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable OneSignal</FormLabel>
                            <FormDescription>
                              Use OneSignal for cross-platform push notifications
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
                    
                    {form.watch("oneSignal.enabled") && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="oneSignal.appId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>OneSignal App ID</FormLabel>
                              <FormControl>
                                <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="oneSignal.apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>REST API Key</FormLabel>
                              <FormControl>
                                <Input placeholder="OneSignal REST API Key" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
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
        </Tabs>
      </div>
    </Container>
  );
};

export default PushNotificationSettingsPage;
