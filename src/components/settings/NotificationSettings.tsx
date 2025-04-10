
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Bell, CalendarCheck, CreditCard, Heart, AlertCircle, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the form schema with Zod
const notificationSchema = z.object({
  inAppNotificationsEnabled: z.boolean().default(true),
  pushNotificationsEnabled: z.boolean().default(false),
  pushProvider: z.enum(["firebase", "onesignal"]).optional(),
  firebaseConfig: z.object({
    apiKey: z.string().optional(),
    authDomain: z.string().optional(),
    projectId: z.string().optional(),
    appId: z.string().optional(),
  }).optional(),
  oneSignalConfig: z.object({
    appId: z.string().optional(),
    apiKey: z.string().optional(),
  }).optional(),
  notificationTypes: z.object({
    attendanceReminders: z.boolean().default(true),
    paymentDueAlerts: z.boolean().default(true),
    classAlerts: z.boolean().default(true),
    birthdayPings: z.boolean().default(true),
  }),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Default values for the form
  const defaultValues: Partial<NotificationFormValues> = {
    inAppNotificationsEnabled: true,
    pushNotificationsEnabled: false,
    pushProvider: "firebase",
    notificationTypes: {
      attendanceReminders: true,
      paymentDueAlerts: true,
      classAlerts: true,
      birthdayPings: true,
    },
  };

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues,
  });

  // Watch for push notifications toggle
  const isPushEnabled = form.watch("pushNotificationsEnabled");
  const pushProvider = form.watch("pushProvider");

  async function onSubmit(data: NotificationFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Notification settings saved:", data);
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleTestNotification = async () => {
    try {
      // In a real implementation, this would be an API call to send a test notification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Test notification sent successfully!");
    } catch (error) {
      toast.error("Failed to send test notification");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure in-app and push notifications for your users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <p className="text-sm text-muted-foreground">
                Configure which notification channels to enable
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="inAppNotificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">In-App Notifications</FormLabel>
                        <FormDescription>
                          Display notifications inside the application
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
                  name="pushNotificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Push Notifications</FormLabel>
                        <FormDescription>
                          Send notifications to users' devices even when they're not using the app
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
            
            {isPushEnabled && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notification Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Select and configure your push notification service
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="pushProvider"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Provider</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-y-0 space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="firebase" />
                              </FormControl>
                              <FormLabel className="font-normal">Firebase</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="onesignal" />
                              </FormControl>
                              <FormLabel className="font-normal">OneSignal</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Firebase Configuration */}
                  {isPushEnabled && pushProvider === "firebase" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name="firebaseConfig.apiKey"
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
                        name="firebaseConfig.authDomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Firebase Auth Domain</FormLabel>
                            <FormControl>
                              <Input placeholder="yourproject.firebaseapp.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="firebaseConfig.projectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Firebase Project ID</FormLabel>
                            <FormControl>
                              <Input placeholder="your-project-id" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="firebaseConfig.appId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Firebase App ID</FormLabel>
                            <FormControl>
                              <Input placeholder="1:12345:web:67890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* OneSignal Configuration */}
                  {isPushEnabled && pushProvider === "onesignal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name="oneSignalConfig.appId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OneSignal App ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter App ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="oneSignalConfig.apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OneSignal API Key</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter API Key" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestNotification}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Send Test Notification
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>
              <p className="text-sm text-muted-foreground">
                Configure which types of notifications to send
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="notificationTypes.attendanceReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <CalendarCheck className="h-4 w-4 mr-2 text-purple-500" />
                          <FormLabel className="text-base">Attendance Reminders</FormLabel>
                        </div>
                        <FormDescription>
                          Remind members to maintain their workout routine
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
                  name="notificationTypes.paymentDueAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-red-500" />
                          <FormLabel className="text-base">Payment Due Alerts</FormLabel>
                        </div>
                        <FormDescription>
                          Notify members about upcoming and overdue payments
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
                  name="notificationTypes.classAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                          <FormLabel className="text-base">Class Alerts</FormLabel>
                        </div>
                        <FormDescription>
                          Send notifications about class bookings, changes, and cancellations
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
                  name="notificationTypes.birthdayPings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-pink-500" />
                          <FormLabel className="text-base">Birthday & Motivation</FormLabel>
                        </div>
                        <FormDescription>
                          Send birthday wishes and motivational messages to members
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

export default NotificationSettings;
