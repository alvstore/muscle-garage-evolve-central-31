
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye, SendIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Base schema with common fields
const baseEmailSchema = z.object({
  provider: z.enum(["sendgrid", "mailgun", "smtp"]),
  senderEmail: z.string().email({ message: "Please enter a valid email address" }),
  notifications: z.object({
    sendOnRegistration: z.boolean().default(true),
    sendOnInvoice: z.boolean().default(true),
    sendClassUpdates: z.boolean().default(true),
  }),
});

// Provider-specific schemas
const sendgridSchema = baseEmailSchema.extend({
  provider: z.literal("sendgrid"),
  sendgridApiKey: z.string().min(1, { message: "API Key is required" }),
});

const mailgunSchema = baseEmailSchema.extend({
  provider: z.literal("mailgun"),
  mailgunApiKey: z.string().min(1, { message: "API Key is required" }),
  mailgunDomain: z.string().min(1, { message: "Domain is required" }),
});

const smtpSchema = baseEmailSchema.extend({
  provider: z.literal("smtp"),
  smtpHost: z.string().min(1, { message: "SMTP Host is required" }),
  smtpPort: z.coerce.number().int().positive(),
  smtpUsername: z.string().min(1, { message: "SMTP Username is required" }),
  smtpPassword: z.string().min(1, { message: "SMTP Password is required" }),
  smtpSecure: z.boolean().default(true),
});

// Combined schema with discriminated union
const emailSchema = z.discriminatedUnion("provider", [
  sendgridSchema,
  mailgunSchema,
  smtpSchema,
]);

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"sendgrid" | "mailgun" | "smtp">("sendgrid");
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Default values for the form
  const defaultValues: Partial<EmailFormValues> = {
    provider: "sendgrid",
    senderEmail: "notifications@muscle-garage.com",
    notifications: {
      sendOnRegistration: true,
      sendOnInvoice: true,
      sendClassUpdates: true,
    },
  };

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: defaultValues as any,
  });

  // Watch for provider changes to update the form
  const watchProvider = form.watch("provider");
  React.useEffect(() => {
    setSelectedProvider(watchProvider);
  }, [watchProvider]);

  async function onSubmit(data: EmailFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Email settings saved:", data);
      toast.success("Email settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error("Please enter a test email address");
      return;
    }

    try {
      setIsSendingTest(true);
      // In a real implementation, this would be an API call to send a test email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`Test email sent to ${testEmailAddress}`);
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
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
              
              <Tabs value={selectedProvider} className="mt-6">
                <TabsContent value="sendgrid" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="sendgridApiKey"
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
                      name="mailgunApiKey"
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
                      name="mailgunDomain"
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
                      name="smtpHost"
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
                      name="smtpPort"
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
                      name="smtpUsername"
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
                      name="smtpPassword"
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
                      name="smtpSecure"
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
                name="senderEmail"
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
                    onClick={handleSendTestEmail}
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
                onClick={() => form.reset(defaultValues as any)}
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
