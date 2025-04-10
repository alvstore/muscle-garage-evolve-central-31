
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye, MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import settingsService, { WhatsAppSettings as WhatsAppSettingsType } from "@/services/settingsService";
import { messagingService } from "@/services/integrations/messagingService";
import { Label } from "@/components/ui/label";

// Define the form schema with Zod
const whatsAppSchema = z.object({
  apiToken: z.string().min(1, { message: "API Token is required" }),
  phoneNumberId: z.string().min(1, { message: "Phone Number ID is required" }),
  businessAccountId: z.string().min(1, { message: "Business Account ID is required" }),
  notifications: z.object({
    sendWelcomeMessages: z.boolean().default(true),
    sendClassReminders: z.boolean().default(true),
    sendRenewalReminders: z.boolean().default(true),
    sendBirthdayGreetings: z.boolean().default(true),
  }),
});

type WhatsAppFormValues = z.infer<typeof whatsAppSchema>;

interface Template {
  id: string;
  name: string;
  content: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

const WhatsAppSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "" });
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Default values for the form
  const defaultValues: Partial<WhatsAppFormValues> = {
    apiToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    notifications: {
      sendWelcomeMessages: true,
      sendClassReminders: true,
      sendRenewalReminders: true,
      sendBirthdayGreetings: true,
    },
  };

  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsAppSchema),
    defaultValues,
  });

  // Fetch existing settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getWhatsAppSettings();
        form.reset(settings);
        
        // Load mock templates (in a real app, this would be from an API)
        setTemplates([
          { 
            id: "welcome", 
            name: "Welcome Message", 
            content: "Welcome to {{1}}! We're excited to have you join our fitness community. Your member ID is {{2}}.", 
            status: "APPROVED" 
          },
          { 
            id: "class_reminder", 
            name: "Class Reminder", 
            content: "Reminder: Your {{1}} class starts at {{2}} tomorrow. Don't forget to bring your {{3}}!", 
            status: "APPROVED" 
          },
          { 
            id: "renewal", 
            name: "Membership Renewal", 
            content: "Your membership expires on {{1}}. Renew now to continue enjoying our services without interruption.", 
            status: "PENDING" 
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch WhatsApp settings:", error);
        // Don't show error toast on initial load as it might not exist yet
      }
    };

    fetchSettings();
  }, [form]);

  async function onSubmit(data: WhatsAppFormValues) {
    try {
      setIsLoading(true);
      
      // Save settings to the settings service
      await settingsService.updateWhatsAppSettings(data);
      
      toast.success("WhatsApp settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const addNewTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error("Template name and content are required");
      return;
    }
    
    // In a real app, this would be an API call to add a template
    const newTemplateObject = {
      id: `template_${Date.now()}`,
      name: newTemplate.name,
      content: newTemplate.content,
      status: "PENDING" as const
    };
    
    setTemplates([...templates, newTemplateObject]);
    setNewTemplate({ name: "", content: "" });
    toast.success("Template submitted for approval");
  };
  
  const sendTestMessage = async () => {
    if (!testPhoneNumber) {
      toast.error("Please enter a test phone number");
      return;
    }

    try {
      setIsSendingTest(true);
      const result = await messagingService.sendWhatsApp(
        testPhoneNumber,
        "This is a test message from your WhatsApp integration!"
      );
      
      if (!result) {
        toast.error("Failed to send test message");
      }
    } catch (error) {
      console.error("Error sending test message:", error);
      toast.error("Failed to send test message");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Integration Settings</CardTitle>
        <CardDescription>
          Configure WhatsApp Business API for member communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="credentials">API Credentials</TabsTrigger>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="credentials" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">WhatsApp Cloud API Credentials</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your WhatsApp Cloud API credentials to enable WhatsApp messaging
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="apiToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Token</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Enter API Token" 
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
                            Permanent access token for WhatsApp Cloud API
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
                            ID of the phone number from WhatsApp Business Manager
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
                            Your WhatsApp Business Account ID
                          </FormDescription>
                          <FormMessage />
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
                            placeholder="+917XXXXXXXX"
                            value={testPhoneNumber}
                            onChange={(e) => setTestPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isSendingTest}
                        onClick={sendTestMessage}
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
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Message Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage pre-approved message templates for WhatsApp communications
                  </p>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <h4 className="font-medium">New Template</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input 
                          id="template-name" 
                          placeholder="e.g., welcome_message"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-content">Template Content</Label>
                        <Textarea 
                          id="template-content" 
                          placeholder="Enter template content with {{1}}, {{2}} for variables"
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                          rows={4}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Use {{1}}, {{2}} etc. for dynamic variables
                        </p>
                      </div>
                      <Button 
                        type="button" 
                        onClick={addNewTemplate}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Submit Template
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Existing Templates</h4>
                    {templates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No templates found</p>
                    ) : (
                      <div className="space-y-4">
                        {templates.map((template) => (
                          <div key={template.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium">{template.name}</h5>
                                <p className="text-sm text-muted-foreground">ID: {template.id}</p>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                template.status === "APPROVED" 
                                  ? "bg-green-100 text-green-800" 
                                  : template.status === "PENDING" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {template.status}
                              </div>
                            </div>
                            <p className="text-sm border p-2 rounded bg-gray-50">{template.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure when WhatsApp messages should be sent to members
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="notifications.sendWelcomeMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Welcome Messages</FormLabel>
                            <FormDescription>
                              Send welcome messages when new members register
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
                            <FormLabel className="text-base">Class Reminders</FormLabel>
                            <FormDescription>
                              Send reminders before scheduled classes
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
                            <FormLabel className="text-base">Renewal Reminders</FormLabel>
                            <FormDescription>
                              Send reminders when memberships are about to expire
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
                            <FormLabel className="text-base">Birthday Greetings</FormLabel>
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
                </div>
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
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
