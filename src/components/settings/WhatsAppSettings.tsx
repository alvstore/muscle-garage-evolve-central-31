
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, MessageSquare, AlertCircle, Copy, Check, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import integrationService, { IntegrationConfig } from "@/services/integrationService";

// Define the schema for WhatsApp settings
const whatsAppSchema = z.object({
  apiToken: z.string().min(1, { message: "API Token is required." }),
  phoneNumberId: z.string().min(1, { message: "Phone Number ID is required." }),
  businessAccountId: z.string().min(1, { message: "Business Account ID is required." }),
  notifications: z.object({
    sendWelcomeMessages: z.boolean().default(false),
    sendClassReminders: z.boolean().default(false),
    sendRenewalReminders: z.boolean().default(false),
    sendBirthdayGreetings: z.boolean().default(false),
  }),
  webhookUrl: z.string().optional(),
  verificationToken: z.string().optional(),
});

// Define the type for the form values based on the schema
type WhatsAppFormValues = z.infer<typeof whatsAppSchema>;

// Template interface
interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  status: 'approved' | 'pending' | 'rejected';
  language: string;
  category: string;
}

const WhatsAppSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  const [activeTab, setActiveTab] = useState("settings");
  const [testTemplate, setTestTemplate] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: "1",
      name: "Welcome Message",
      content: "Hello {{1}}! Welcome to Muscle Garage. Your membership is now active. Visit our website or mobile app to book classes and track your fitness journey.",
      variables: ["member_name"],
      status: 'approved',
      language: 'en',
      category: 'MARKETING'
    },
    {
      id: "2",
      name: "Class Reminder",
      content: "Hi {{1}}! This is a reminder that your {{2}} class is scheduled for {{3}} at {{4}}. Please arrive 10 minutes early.",
      variables: ["member_name", "class_name", "date", "time"],
      status: 'approved',
      language: 'en',
      category: 'APPOINTMENT_REMINDER'
    },
    {
      id: "3",
      name: "Membership Renewal",
      content: "Hello {{1}}. Your membership is expiring on {{2}}. Please renew to continue enjoying our facilities.",
      variables: ["member_name", "expiry_date"],
      status: 'pending',
      language: 'en',
      category: 'PAYMENT_UPDATE'
    },
    {
      id: "4",
      name: "Birthday Greeting",
      content: "Happy Birthday, {{1}}! 🎂 As a birthday gift, enjoy a special 10% discount on your next membership renewal or personal training session.",
      variables: ["member_name"],
      status: 'approved',
      language: 'en',
      category: 'MARKETING'
    }
  ]);

  // Load existing WhatsApp config when component mounts
  useEffect(() => {
    const loadWhatsAppConfig = async () => {
      try {
        const config = integrationService.getConfig('whatsapp');
        if (config && config.enabled) {
          form.reset({
            apiToken: config.apiToken || "",
            phoneNumberId: config.phoneNumberId || "",
            businessAccountId: config.businessAccountId || "",
            notifications: {
              sendWelcomeMessages: config.notifications?.sendWelcomeMessages ?? false,
              sendClassReminders: config.notifications?.sendClassReminders ?? false,
              sendRenewalReminders: config.notifications?.sendRenewalReminders ?? false,
              sendBirthdayGreetings: config.notifications?.sendBirthdayGreetings ?? false,
            },
            webhookUrl: config.webhookUrl || "",
            verificationToken: config.verificationToken || "",
          });
        }
      } catch (error) {
        console.error("Error loading WhatsApp config:", error);
      }
    };
    
    loadWhatsAppConfig();
  }, []);

  // Initialize the form with useForm
  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsAppSchema),
    defaultValues: {
      apiToken: "",
      phoneNumberId: "",
      businessAccountId: "",
      notifications: {
        sendWelcomeMessages: false,
        sendClassReminders: false,
        sendRenewalReminders: false,
        sendBirthdayGreetings: false,
      },
      webhookUrl: "",
      verificationToken: "",
    },
    mode: "onChange",
  });

  const { formState } = form;

  // Function to handle form submission
  const onSubmit = async (values: WhatsAppFormValues) => {
    setIsLoading(true);
    try {
      // Update WhatsApp integration config
      const config: IntegrationConfig = {
        enabled: true,
        apiToken: values.apiToken,
        phoneNumberId: values.phoneNumberId,
        businessAccountId: values.businessAccountId,
        notifications: values.notifications,
        webhookUrl: values.webhookUrl,
        verificationToken: values.verificationToken,
      };
      
      const success = integrationService.updateConfig('whatsapp', config);
      
      if (success) {
        toast.success("WhatsApp settings saved successfully!");
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving WhatsApp settings:", error);
      toast.error("Failed to save WhatsApp settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sending a test message
  const onSendTestMessage = async (templateId?: string) => {
    if (!testNumber) {
      toast.error("Please enter a test phone number");
      return;
    }

    setIsSendingTest(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const templateName = templateId 
        ? templates.find(t => t.id === templateId)?.name || "selected template"
        : "default template";
        
      toast.success(`Test message sent to ${testNumber} using ${templateName}`);
      setTestTemplate(null);
    } catch (error) {
      console.error("Error sending test message:", error);
      toast.error("Failed to send test message. Please try again.");
    } finally {
      setIsSendingTest(false);
    }
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard`);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };
  
  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ));
      setEditingTemplate(null);
      toast.success("Template updated successfully");
    }
  };

  const getTemplateVariablesDisplay = (template: WhatsAppTemplate) => {
    return template.variables.map((variable, index) => (
      <Badge key={index} variant="outline" className="mr-1 mb-1">
        {variable}
      </Badge>
    ));
  };

  return (
    <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="settings">API Settings</TabsTrigger>
        <TabsTrigger value="templates">Message Templates</TabsTrigger>
        <TabsTrigger value="webhook">Webhook Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration</CardTitle>
            <CardDescription>
              Configure WhatsApp Cloud API integration for automated notifications and
              communication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200 text-blue-800 mb-6">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Important Note</h4>
                  <p className="text-sm mt-1">
                    To enable WhatsApp integration, you need a valid WhatsApp
                    Business account and API token. Ensure that the phone number ID
                    and business account ID are correctly configured from the Meta
                    Developer dashboard.
                  </p>
                </div>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="apiToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Token</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="WhatsApp API Token"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your WhatsApp Cloud API token.
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
                          <Input
                            placeholder="WhatsApp Phone Number ID"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your WhatsApp Phone Number ID from Meta Business dashboard.
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
                          <Input
                            placeholder="WhatsApp Business Account ID"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your WhatsApp Business Account ID.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Notification Settings
                  </h3>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="notifications.sendWelcomeMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Welcome Messages
                            </FormLabel>
                            <FormDescription>
                              Automatically send welcome messages to new members.
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Class Reminders
                            </FormLabel>
                            <FormDescription>
                              Send reminders for upcoming classes.
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Renewal Reminders
                            </FormLabel>
                            <FormDescription>
                              Send reminders for membership renewals.
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Birthday Greetings
                            </FormLabel>
                            <FormDescription>
                              Send birthday greetings to members.
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
                
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                  <div className="flex-1">
                    <FormLabel>Send Test Message</FormLabel>
                    <div className="flex items-center mt-2">
                      <Input
                        placeholder="+91 9876543210"
                        type="tel"
                        value={testNumber}
                        onChange={(e) => setTestNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => onSendTestMessage()}
                    disabled={isSendingTest || !formState.isValid}
                  >
                    {isSendingTest ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    {isSendingTest ? "Sending..." : "Send Test Message"}
                  </Button>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Message Templates</CardTitle>
            <CardDescription>
              Manage approved templates for automated WhatsApp messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center p-4 bg-muted/20">
                    <div className="space-y-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          template.status === 'approved' ? 'default' :
                          template.status === 'pending' ? 'outline' : 'destructive'
                        }>
                          {template.status}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant="secondary">{template.language}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Template</DialogTitle>
                            <DialogDescription>
                              Modify your WhatsApp message template
                            </DialogDescription>
                          </DialogHeader>
                          {editingTemplate && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <FormLabel>Template Name</FormLabel>
                                <Input 
                                  value={editingTemplate.name} 
                                  onChange={(e) => setEditingTemplate({
                                    ...editingTemplate,
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <FormLabel>Content</FormLabel>
                                <Textarea 
                                  rows={4} 
                                  value={editingTemplate.content}
                                  onChange={(e) => setEditingTemplate({
                                    ...editingTemplate,
                                    content: e.target.value
                                  })}
                                />
                                <FormDescription>
                                  Use {{1}}, {{2}}, etc. for variables.
                                </FormDescription>
                              </div>
                              <div className="space-y-2">
                                <FormLabel>Variables (comma-separated)</FormLabel>
                                <Input 
                                  value={editingTemplate.variables.join(', ')} 
                                  onChange={(e) => setEditingTemplate({
                                    ...editingTemplate,
                                    variables: e.target.value.split(',').map(v => v.trim())
                                  })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <FormLabel>Category</FormLabel>
                                  <Input 
                                    value={editingTemplate.category} 
                                    onChange={(e) => setEditingTemplate({
                                      ...editingTemplate,
                                      category: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <FormLabel>Language</FormLabel>
                                  <Input 
                                    value={editingTemplate.language} 
                                    onChange={(e) => setEditingTemplate({
                                      ...editingTemplate,
                                      language: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleSaveTemplate}>Save Template</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setTestTemplate(template.id);
                          setActiveTab("settings");
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="font-mono text-sm p-3 bg-muted rounded-md">
                      {template.content}
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Variables:</div>
                      <div className="flex flex-wrap">
                        {getTemplateVariablesDisplay(template)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="rounded-md bg-muted/20 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Need to add new templates? You must register them in the Meta Business dashboard first.
                </p>
                <Button variant="outline" size="sm" onClick={() => setEditingTemplate({
                  id: `template-${Date.now()}`,
                  name: "New Template",
                  content: "Hello {{1}}! This is a new template message.",
                  variables: ["member_name"],
                  status: 'pending',
                  language: 'en',
                  category: 'MARKETING'
                })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Existing Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="webhook">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Webhook Configuration</CardTitle>
            <CardDescription>
              Set up webhooks to receive WhatsApp message events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200 text-amber-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Configuration Required</h4>
                    <p className="text-sm mt-1">
                      You need to configure the webhook URL and verification token in the Meta Developer portal.
                      This allows your application to receive incoming message events.
                    </p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input
                              placeholder="https://your-domain.com/api/whatsapp-webhook"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => copyToClipboard(field.value || "", "Webhook URL")}
                          >
                            {copied === "Webhook URL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormDescription>
                          This is the URL you should configure in the Meta Developer portal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="verificationToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Verification Token</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input
                              placeholder="Your verification token"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => copyToClipboard(field.value || "", "Verification Token")}
                          >
                            {copied === "Verification Token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormDescription>
                          This token helps verify webhook requests from Meta.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">
                    <div className="font-semibold mb-2">Webhook Configuration Steps:</div>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Go to the Meta Developer Portal</li>
                      <li>Navigate to WhatsApp > Configuration</li>
                      <li>Under Webhooks, click "Edit"</li>
                      <li>Enter the Webhook URL and Verification Token</li>
                      <li>Subscribe to these fields: messages, message_status_updates</li>
                      <li>Click "Verify and Save"</li>
                    </ol>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    className="mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Webhook Settings"
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Test message dialog when template is selected */}
      <Dialog open={!!testTemplate} onOpenChange={(open) => !open && setTestTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test WhatsApp Message</DialogTitle>
            <DialogDescription>
              Test a specific WhatsApp template message
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <div className="font-medium mt-1">
                  {templates.find(t => t.id === testTemplate)?.name}
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-muted/20">
                <div className="text-sm font-medium mb-2">Message Preview:</div>
                <div className="p-3 bg-muted rounded-md font-mono text-sm">
                  {templates.find(t => t.id === testTemplate)?.content
                    .replace(/{{1}}/g, "John")
                    .replace(/{{2}}/g, "Yoga")
                    .replace(/{{3}}/g, "April 25")
                    .replace(/{{4}}/g, "6:00 PM")}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Recipient Phone Number</Label>
                <Input
                  placeholder="+91 9876543210"
                  type="tel"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestTemplate(null)}>Cancel</Button>
            <Button 
              onClick={() => onSendTestMessage(testTemplate || undefined)}
              disabled={isSendingTest || !testNumber}
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Test Message"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default WhatsAppSettings;
