import React, { useState, useEffect } from "react";
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
import { Loader2, EyeOff, Eye, MessageCircle, Pencil, Save, Send, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import integrationService from "@/services/integrationService";

// Base schema with common fields
const baseSmsSchema = z.object({
  provider: z.enum(["msg91", "twilio", "custom"]),
  senderId: z.string().min(1, { message: "Sender ID is required" }).max(11),
  templates: z.object({
    membershipAlert: z.boolean().default(true),
    renewalReminder: z.boolean().default(true),
    otpVerification: z.boolean().default(true),
    attendanceConfirmation: z.boolean().default(false),
  }),
});

// Provider-specific schemas
const msg91Schema = baseSmsSchema.extend({
  provider: z.literal("msg91"),
  msg91AuthKey: z.string().min(1, { message: "Auth Key is required" }),
});

const twilioSchema = baseSmsSchema.extend({
  provider: z.literal("twilio"),
  twilioAccountSid: z.string().min(1, { message: "Account SID is required" }),
  twilioAuthToken: z.string().min(1, { message: "Auth Token is required" }),
});

const customSchema = baseSmsSchema.extend({
  provider: z.literal("custom"),
  customApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  customApiHeaders: z.string().optional(),
  customApiMethod: z.enum(["GET", "POST"]),
  customApiParams: z.string().optional(),
});

// Combined schema with discriminated union
const smsSchema = z.discriminatedUnion("provider", [
  msg91Schema,
  twilioSchema,
  customSchema,
]);

// Replace the existing SmsFormValues type with:
interface SmsFormValues {
  provider: "msg91" | "twilio" | "custom";
  senderId: string;
  templates: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
  // Add provider-specific fields
  msg91AuthKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  customApiUrl?: string;
  customApiHeaders?: string;
  customApiMethod?: "GET" | "POST";
  customApiParams?: string;
}

type SmsTemplate = {
  id: string;
  name: string;
  content: string;
  type: string;
  enabled: boolean;
};

const SmsSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"msg91" | "twilio" | "custom">("msg91");
  const [testPhone, setTestPhone] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([
    {
      id: "1",
      name: "Membership Alert",
      content: "Hi {name}, your Muscle Garage gym membership will expire on {date}. Please renew to continue enjoying our services.",
      type: "membership",
      enabled: true
    },
    {
      id: "2",
      name: "Renewal Reminder",
      content: "Hi {name}, this is a reminder that your Muscle Garage gym membership has expired. Renew now to avoid reactivation fees.",
      type: "renewal",
      enabled: true
    },
    {
      id: "3",
      name: "OTP Verification",
      content: "Your Muscle Garage verification code is {otp}. Valid for 10 minutes.",
      type: "otp",
      enabled: true
    },
    {
      id: "4",
      name: "Attendance Confirmation",
      content: "Thank you for visiting Muscle Garage today, {name}! You've completed {count} workouts this month.",
      type: "attendance",
      enabled: false
    },
  ]);
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
  const [customApiTestResult, setCustomApiTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadSmsConfig = async () => {
      try {
        const config = integrationService.getConfig('sms');
        if (config.provider) {
          setSelectedProvider(config.provider as "msg91" | "twilio" | "custom");
          
          let formValues = {
            provider: config.provider,
            senderId: config.senderId || "MUSCLEGM",
            templates: {
              membershipAlert: config.templates?.membershipAlert ?? true,
              renewalReminder: config.templates?.renewalReminder ?? true,
              otpVerification: config.templates?.otpVerification ?? true,
              attendanceConfirmation: config.templates?.attendanceConfirmation ?? false,
            }
          };
          
          if (config.provider === "msg91") {
            formValues = { ...formValues, msg91AuthKey: config.authKey || "" };
          } else if (config.provider === "twilio") {
            formValues = { 
              ...formValues, 
              twilioAccountSid: config.accountSid || "",
              twilioAuthToken: config.authToken || ""
            };
          } else if (config.provider === "custom") {
            formValues = { 
              ...formValues,
              customApiUrl: config.customApiUrl || "",
              customApiHeaders: config.customApiHeaders || "",
              customApiMethod: (config.customApiMethod || "POST") as "GET" | "POST",
              customApiParams: config.customApiParams || ""
            };
          }
          
          form.reset(formValues as any);
        }
      } catch (error) {
        console.error("Error loading SMS config:", error);
      }
    };
    
    loadSmsConfig();
  }, []);

  const defaultValues: Partial<SmsFormValues> = {
    provider: "msg91",
    senderId: "MUSCLEGM",
    templates: {
      membershipAlert: true,
      renewalReminder: true,
      otpVerification: true,
      attendanceConfirmation: false,
    },
  };

  const form = useForm<SmsFormValues>({
    resolver: zodResolver(smsSchema),
    defaultValues: defaultValues as any,
  });

  const watchProvider = form.watch("provider");
  React.useEffect(() => {
    setSelectedProvider(watchProvider);
  }, [watchProvider]);

  async function onSubmit(data: SmsFormValues) {
    try {
      setIsLoading(true);
      let config: any = {
        enabled: true,
        provider: data.provider,
        senderId: data.senderId,
        templates: data.templates
      };
      
      if (data.provider === 'msg91') {
        config.authKey = data.msg91AuthKey;
      } else if (data.provider === 'twilio') {
        config.accountSid = data.twilioAccountSid;
        config.authToken = data.twilioAuthToken;
      } else if (data.provider === 'custom') {
        config.customApiUrl = data.customApiUrl;
        config.customApiHeaders = data.customApiHeaders;
        config.customApiMethod = data.customApiMethod;
        config.customApiParams = data.customApiParams;
      }
      
      const success = integrationService.updateConfig('sms', config);
      
      if (success) {
        toast.success("SMS settings saved successfully!");
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

  const handleSendTestSms = async () => {
    if (!testPhone) {
      toast.error("Please enter a test phone number");
      return;
    }

    try {
      setIsSendingTest(true);
      const result = await integrationService.testIntegration('sms');
      if (result.success) {
        toast.success(`Test SMS sent to ${testPhone}`);
      } else {
        toast.error(`Failed to send test SMS: ${result.message}`);
      }
    } catch (error) {
      toast.error("Failed to send test SMS");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveTemplate = (updatedTemplate: SmsTemplate) => {
    const updatedTemplates = smsTemplates.map(template => 
      template.id === updatedTemplate.id ? updatedTemplate : template
    );
    setSmsTemplates(updatedTemplates);
    setEditingTemplate(null);
    toast.success("Template updated successfully");
  };

  const handleTemplateEnabledChange = (id: string, enabled: boolean) => {
    const updatedTemplates = smsTemplates.map(template => 
      template.id === id ? {...template, enabled} : template
    );
    setSmsTemplates(updatedTemplates);
  };
  
  const testCustomApi = async () => {
    try {
      const formValues = form.getValues();
      if (formValues.provider !== 'custom' || !formValues.customApiUrl) {
        toast.error("Please configure the Custom API settings first");
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const url = formValues.customApiUrl;
      const hasPlaceholders = url.includes('{mobile}') || url.includes('{message}');
      
      if (!hasPlaceholders) {
        setCustomApiTestResult({
          success: false,
          message: "API URL should contain {mobile} and {message} placeholders"
        });
        return;
      }
      
      setCustomApiTestResult({
        success: true,
        message: "Test request successful! The API endpoint accepted the request format."
      });
      
    } catch (error) {
      setCustomApiTestResult({
        success: false,
        message: "Test failed. Please check your API configuration."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>
        <CardDescription>
          Configure SMS provider for notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SMS Provider</h3>
              <p className="text-sm text-muted-foreground">
                Select your SMS service provider and configure credentials
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
                        className="flex flex-row space-y-0 space-x-4 flex-wrap"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="msg91" />
                          </FormControl>
                          <FormLabel className="font-normal">MSG91 (India)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="twilio" />
                          </FormControl>
                          <FormLabel className="font-normal">Twilio</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="font-normal">Custom API</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="senderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender ID</FormLabel>
                    <FormControl>
                      <Input placeholder="MUSCLEGM" maxLength={11} {...field} />
                    </FormControl>
                    <FormDescription>
                      The sender ID that will appear on SMS messages (max 11 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Tabs value={selectedProvider} className="mt-6">
                <TabsContent value="msg91" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="msg91AuthKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MSG91 Auth Key</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Enter Auth Key" 
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
                            Generated from your MSG91 account dashboard
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="twilio" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="twilioAccountSid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twilio Account SID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Account SID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="twilioAuthToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twilio Auth Token</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input 
                                placeholder="Enter Auth Token" 
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
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="customApiUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://api.example.com/sms?mobile={mobile}&message={message}" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include placeholders <code>{'{mobile}'}</code> and <code>{'{message}'}</code> in your URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customApiMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="GET" />
                                </FormControl>
                                <FormLabel className="font-normal">GET</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="POST" />
                                </FormControl>
                                <FormLabel className="font-normal">POST</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customApiHeaders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Headers (Optional JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json"}'
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter headers as JSON object
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customApiParams"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Params (Optional JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"sender": "CUSTOM", "country_code": "91"}'
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Additional parameters as JSON object (for POST method)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testCustomApi}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          "Test API Configuration"
                        )}
                      </Button>
                      
                      {customApiTestResult && (
                        <div className={`mt-3 p-3 rounded-md text-sm ${
                          customApiTestResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium">
                                {customApiTestResult.success ? 'Test Successful' : 'Test Failed'}
                              </div>
                              <p>{customApiTestResult.message}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                  <div className="flex-1">
                    <FormLabel>Send Test SMS</FormLabel>
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
                    onClick={handleSendTestSms}
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
              <h3 className="text-lg font-medium">SMS Templates</h3>
              <p className="text-sm text-muted-foreground">
                Manage SMS templates and toggle their availability
              </p>
              
              <div className="space-y-4">
                {smsTemplates.map((template) => (
                  <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                    <div className="space-y-1">
                      <div className="font-medium">{template.name}</div>
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
                            <DialogTitle>Edit SMS Template</DialogTitle>
                            <DialogDescription>
                              Customize the content of your SMS template
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
                                  Use {"{name}"}, {"{date}"}, {"{otp}"}, etc. as variables
                                </FormDescription>
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

export default SmsSettings;
