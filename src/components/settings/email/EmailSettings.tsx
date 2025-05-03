import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEmailSettings, EmailSettings as EmailSettingsType } from '@/hooks/use-email-settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, SendIcon, EyeOff, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const baseEmailSchema = z.object({
  provider: z.enum(["sendgrid", "mailgun", "smtp"]),
  from_email: z.string().email({ message: "Please enter a valid email address" }),
  is_active: z.boolean().default(true),
  notifications: z.object({
    sendOnRegistration: z.boolean().default(true),
    sendOnInvoice: z.boolean().default(true),
    sendClassUpdates: z.boolean().default(true),
  }),
});

const sendgridSchema = baseEmailSchema.extend({
  provider: z.literal("sendgrid"),
  sendgrid_api_key: z.string().min(1, { message: "API Key is required" }),
});

const mailgunSchema = baseEmailSchema.extend({
  provider: z.literal("mailgun"),
  mailgun_api_key: z.string().min(1, { message: "API Key is required" }),
  mailgun_domain: z.string().min(1, { message: "Domain is required" }),
});

const smtpSchema = baseEmailSchema.extend({
  provider: z.literal("smtp"),
  smtp_host: z.string().min(1, { message: "SMTP Host is required" }),
  smtp_port: z.coerce.number().int().positive(),
  smtp_username: z.string().min(1, { message: "SMTP Username is required" }),
  smtp_password: z.string().min(1, { message: "SMTP Password is required" }),
  smtp_secure: z.boolean().default(true),
});

const emailSchema = z.discriminatedUnion("provider", [
  sendgridSchema,
  mailgunSchema,
  smtpSchema,
]);

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailSettings = ({ branchId }: { branchId?: string }) => {
  const { settings, isLoading, fetchSettings, saveSettings, testConnection } = useEmailSettings(branchId);
  const [showSecrets, setShowSecrets] = React.useState(false);
  const [testEmailAddress, setTestEmailAddress] = React.useState("");
  const [isSendingTest, setIsSendingTest] = React.useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      provider: 'sendgrid',
      from_email: '',
      is_active: true,
      notifications: {
        sendOnRegistration: true,
        sendOnInvoice: true,
        sendClassUpdates: true
      }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error("Please enter a test email address");
      return;
    }

    setIsSendingTest(true);
    const formValues = form.getValues();
    const result = await testConnection(testEmailAddress);
    
    if (result.success) {
      // Ensure notifications has required fields
      const notifications = {
        sendOnRegistration: true,
        sendOnInvoice: true,
        sendClassUpdates: true,
        ...(formValues.notifications || {})
      };
      
      await saveSettings({
        ...formValues,
        notifications
      });
    }
    
    setIsSendingTest(false);
  };

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    // Ensure notifications has required fields
    const notifications = {
      sendOnRegistration: true,
      sendOnInvoice: true,
      sendClassUpdates: true,
      ...(data.notifications || {})
    };
    
    await saveSettings({
      ...data,
      notifications
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>
          Configure email service for notifications and communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Provider</h3>
              <p className="text-sm text-muted-foreground">
                Select your email service provider and configure credentials
              </p>
              
              <FormField
                control={form.control}
                name="provider"
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
                            <RadioGroupItem value="sendgrid" />
                          </FormControl>
                          <FormLabel className="font-normal">SendGrid</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mailgun" />
                          </FormControl>
                          <FormLabel className="font-normal">Mailgun</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="smtp" />
                          </FormControl>
                          <FormLabel className="font-normal">SMTP</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Tabs value={form.watch("provider")} className="mt-6">
                <TabsContent value="sendgrid" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="sendgrid_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SendGrid API Key</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Enter API Key" 
                                type={showSecrets ? "text" : "password"} 
                                {...field} 
                              />
                            </FormControl>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              type="button"
                              onClick={() => setShowSecrets(!showSecrets)}
                              className="ml-2"
                            >
                              {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                          <FormDescription>
                            Generated from your SendGrid account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="mailgun" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="mailgun_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mailgun API Key</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Enter API Key" 
                                type={showSecrets ? "text" : "password"} 
                                {...field} 
                              />
                            </FormControl>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              type="button"
                              onClick={() => setShowSecrets(!showSecrets)}
                              className="ml-2"
                            >
                              {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mailgun_domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mailgun Domain</FormLabel>
                          <FormControl>
                            <Input placeholder="mg.yourdomain.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="smtp" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="smtp_host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtp_port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="587" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtp_username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtp_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Password" 
                                type={showSecrets ? "text" : "password"} 
                                {...field} 
                              />
                            </FormControl>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              type="button"
                              onClick={() => setShowSecrets(!showSecrets)}
                              className="ml-2"
                            >
                              {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtp_secure"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Use SSL/TLS</FormLabel>
                            <FormDescription>
                              Enable secure connection (recommended)
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
                </TabsContent>
              </Tabs>
              
              <FormField
                control={form.control}
                name="from_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="notifications@yourgym.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This email will be used as the sender for all notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                  <div className="flex-1">
                    <FormLabel>Send Test Email</FormLabel>
                    <div className="flex items-center mt-2">
                      <Input
                        placeholder="test@example.com"
                        type="email"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSendingTest}
                    onClick={handleTestEmail}
                  >
                    {isSendingTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure when emails should be sent to members
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="notifications.sendOnRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Registration Emails</FormLabel>
                        <FormDescription>
                          Send welcome emails when new members register
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
                  name="notifications.sendOnInvoice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Invoice & Payment Emails</FormLabel>
                        <FormDescription>
                          Send notifications for invoices and payments
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
                  name="notifications.sendClassUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Class Update Emails</FormLabel>
                        <FormDescription>
                          Send notifications for class changes and schedules
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
                onClick={() => form.reset()}
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

export default EmailSettings;
