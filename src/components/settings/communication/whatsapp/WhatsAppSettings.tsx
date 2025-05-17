
import React, { useState, useEffect } from "react";
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
import { Loader2, Copy, EyeOff, Eye, MessageSquare, Send, Pencil, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import integrationService from "@/services/integrationService";

// Define schema for WhatsApp settings
const whatsAppSchema = z.object({
  enabled: z.boolean().default(false),
  apiToken: z.string().min(1, { message: "API Token is required" }),
  phoneNumberId: z.string().min(1, { message: "Phone Number ID is required" }),
  businessAccountId: z.string().min(1, { message: "Business Account ID is required" }),
  notifications: z.object({
    sendWelcomeMessages: z.boolean().default(true),
    sendClassReminders: z.boolean().default(true),
    sendRenewalReminders: z.boolean().default(true),
    sendBirthdayGreetings: z.boolean().default(false),
  }),
});

type WhatsAppFormValues = z.infer<typeof whatsAppSchema>;

// Template interface
interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  enabled: boolean;
  category: "transactional" | "marketing" | "otp";
  status: "approved" | "pending" | "rejected";
}

const WhatsAppSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://your-app.com/api/whatsapp-webhook");
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: "1",
      name: "Welcome Message",
      content: "Hello {{1}}, welcome to Muscle Garage! We're excited to have you join us. Your membership starts on {{2}}.",
      type: "welcome",
      enabled: true,
      category: "transactional",
      status: "approved"
    },
    {
      id: "2",
      name: "Class Reminder",
      content: "Hi {{1}}, this is a reminder about your {{2}} class scheduled for {{3}}. We look forward to seeing you!",
      type: "reminder",
      enabled: true,
      category: "transactional",
      status: "approved"
    },
    {
      id: "3",
      name: "Renewal Reminder",
      content: "Hi {{1}}, your Muscle Garage membership will expire on {{2}}. Please renew to continue enjoying our facilities.",
      type: "renewal",
      enabled: true,
      category: "marketing",
      status: "pending"
    },
    {
      id: "4",
      name: "Birthday Greeting",
      content: "Happy Birthday, {{1}}! From all of us at Muscle Garage, we wish you a fantastic day and a great workout! 🎂💪",
      type: "birthday",
      enabled: false,
      category: "marketing",
      status: "approved"
    },
  ]);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  // Default values for the form
  const defaultValues: WhatsAppFormValues = {
    enabled: false,
    apiToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    notifications: {
      sendWelcomeMessages: true,
      sendClassReminders: true,
      sendRenewalReminders: true,
      sendBirthdayGreetings: false,
    },
  };

  // Form setup with zod validation
  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsAppSchema),
    defaultValues,
  });

  // Load existing WhatsApp config on component mount
  useEffect(() => {
    try {
      const config = integrationService.getConfig('whatsapp');
      if (config && config.enabled !== undefined) {
        const formValues = {
          enabled: config.enabled,
          apiToken: config.apiToken || "",
          phoneNumberId: config.phoneNumberId || "",
          businessAccountId: config.businessAccountId || "",
          notifications: {
            sendWelcomeMessages: config.notifications?.sendWelcomeMessages ?? true,
            sendClassReminders: config.notifications?.sendClassReminders ?? true,
            sendRenewalReminders: config.notifications?.sendRenewalReminders ?? true,
            sendBirthdayGreetings: config.notifications?.sendBirthdayGreetings ?? false,
          }
        };
        form.reset(formValues);
      }
    } catch (error) {
      console.error("Error loading WhatsApp config:", error);
    }
  }, [form]);

  async function onSubmit(data: WhatsAppFormValues) {
    try {
      setIsLoading(true);
      // Update the integration config
      const success = integrationService.updateConfig('whatsapp', data);
      
      if (success) {
        toast.success("WhatsApp settings saved successfully!");
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSendTestMessage = async () => {
    if (!testPhone) {
      toast.error("Please enter a test phone number");
      return;
    }

    try {
      setIsSendingTest(true);
      // In a real implementation, this would be an API call to send a test WhatsApp message
      const result = await integrationService.testIntegration('whatsapp');
      if (result.success) {
        toast.success(`Test message sent to ${testPhone}`);
      } else {
        toast.error(`Failed to send test message: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sending test message:", error);
      toast.error("Failed to send test message");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveTemplate = (updatedTemplate: WhatsAppTemplate) => {
    const updatedTemplates = templates.map(template => 
      template.id === updatedTemplate.id ? updatedTemplate : template
    );
    setTemplates(updatedTemplates);
    setEditingTemplate(null);
    toast.success("Template updated successfully");
  };

  const handleTemplateEnabledChange = (id: string, enabled: boolean) => {
    const updatedTemplates = templates.map(template => 
      template.id === id ? {...template, enabled} : template
    );
    setTemplates(updatedTemplates);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Webhook URL copied to clipboard");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Cloud API Settings</CardTitle>
        <CardDescription>
          Configure WhatsApp Cloud API for sending notifications and messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">WhatsApp Cloud API Credentials</h3>
              <p className="text-sm text-muted-foreground">
                Enter your WhatsApp Cloud API credentials to enable WhatsApp messaging
              </p>
              
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable WhatsApp Integration
                      </FormLabel>
                      <FormDescription>
                        Turn on/off WhatsApp messaging functionality
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
                name="apiToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Token</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input 
                          placeholder="Enter WhatsApp API Token" 
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
                      Generated from your Meta for Developers dashboard
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Phone Number ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      The ID of your WhatsApp business phone number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Account ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Business Account ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your WhatsApp Business Account ID from Meta Business Suite
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Webhook URL</FormLabel>
                <div className="flex items-center">
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={copyToClipboard}
                    className="ml-2"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <FormDescription>
                  {copied ? (
                    <span className="text-green-600">Copied to clipboard!</span>
                  ) : (
                    "Configure this URL in your WhatsApp Cloud API settings"
                  )}
                </FormDescription>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure which notifications will be sent via WhatsApp
              </p>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifications.sendWelcomeMessages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Welcome Messages
                        </FormLabel>
                        <FormDescription>
                          Send welcome messages to new members
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
                  name="notifications.sendClassReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Class Reminders
                        </FormLabel>
                        <FormDescription>
                          Send reminders for upcoming classes
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
                  name="notifications.sendRenewalReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Renewal Reminders
                        </FormLabel>
                        <FormDescription>
                          Send reminders about membership renewals
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
                  name="notifications.sendBirthdayGreetings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Birthday Greetings
                        </FormLabel>
                        <FormDescription>
                          Send birthday greetings to members
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
              
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                  <div className="flex-1">
                    <FormLabel>Send Test Message</FormLabel>
                    <div className="flex items-center mt-2">
                      <Input
                        placeholder="+91 9876543210"
                        type="tel"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSendingTest}
                    onClick={handleSendTestMessage}
                  >
                    {isSendingTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">WhatsApp Templates</h3>
              <p className="text-sm text-muted-foreground">
                Manage message templates for WhatsApp communications
              </p>
              
              <div className="space-y-4">
                <Tabs defaultValue="approved">
                  <TabsList>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="approved" className="mt-4 space-y-4">
                    {templates.filter(t => t.status === "approved").map((template) => (
                      <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">Category: {template.category}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{template.content}</div>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-auto">
                          <Switch
                            checked={template.enabled}
                            onCheckedChange={(checked) => handleTemplateEnabledChange(template.id, checked)}
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit WhatsApp Template</DialogTitle>
                                <DialogDescription>
                                  Customize the content of your WhatsApp template
                                </DialogDescription>
                              </DialogHeader>
                              {editingTemplate && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <FormLabel>Template Name</FormLabel>
                                    <Input
                                      value={editingTemplate.name}
                                      onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <FormLabel>Template Content</FormLabel>
                                    <Textarea
                                      value={editingTemplate.content}
                                      onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                                      rows={4}
                                    />
                                    <FormDescription>
                                      Use {"{{1}}"}, {"{{2}}"} for variables according to WhatsApp template format
                                    </FormDescription>
                                  </div>
                                  <div className="grid gap-2">
                                    <FormLabel>Category</FormLabel>
                                    <select
                                      value={editingTemplate.category}
                                      onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value as "transactional" | "marketing" | "otp"})}
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <option value="transactional">Transactional</option>
                                      <option value="marketing">Marketing</option>
                                      <option value="otp">OTP</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  type="button"
                                  onClick={() => handleSaveTemplate(editingTemplate!)}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Template
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-4 space-y-4">
                    {templates.filter(t => t.status === "pending").map((template) => (
                      <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">Category: {template.category}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{template.content}</div>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-auto">
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {/* Same dialog content as above */}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-4 space-y-4">
                    {templates.map((template) => (
                      <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Category: {template.category} | 
                            Status: <span className={`${
                              template.status === "approved" ? "text-green-600" : 
                              template.status === "pending" ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{template.content}</div>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-auto">
                          <Switch
                            checked={template.enabled}
                            onCheckedChange={(checked) => handleTemplateEnabledChange(template.id, checked)}
                            disabled={template.status !== "approved"}
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {/* Same dialog content as above */}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
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

export default WhatsAppSettings;
