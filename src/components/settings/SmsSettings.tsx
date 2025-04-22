
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationSettings from "./sms/NotificationSettings";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationConfig } from "@/services/integrationService"; // Updated import path
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Define form schemas for each provider

const msg91Schema = z.object({
  provider: z.literal("msg91"),
  senderId: z.string().min(1, { message: "Sender ID is required" }),
  msg91AuthKey: z.string().min(1, { message: "Authentication Key is required" }),
  templates: z.object({
    membershipAlert: z.boolean().default(false),
    renewalReminder: z.boolean().default(false),
    otpVerification: z.boolean().default(false),
    attendanceConfirmation: z.boolean().default(false),
  }),
});

const twilioSchema = z.object({
  provider: z.literal("twilio"),
  senderId: z.string().min(1, { message: "Sender ID/Phone Number is required" }),
  twilioAccountSid: z.string().min(1, { message: "Account SID is required" }),
  twilioAuthToken: z.string().min(1, { message: "Auth Token is required" }),
  templates: z.object({
    membershipAlert: z.boolean().default(false),
    renewalReminder: z.boolean().default(false),
    otpVerification: z.boolean().default(false),
    attendanceConfirmation: z.boolean().default(false),
  }),
});

const customApiSchema = z.object({
  provider: z.literal("custom"),
  customApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  customApiMethod: z.enum(["GET", "POST"]),
  customApiHeaders: z.string().optional(),
  customApiParams: z.string().optional(),
  templates: z.object({
    membershipAlert: z.boolean().default(false),
    renewalReminder: z.boolean().default(false),
    otpVerification: z.boolean().default(false),
    attendanceConfirmation: z.boolean().default(false),
  }),
});

// Combined schema with discriminated union
const smsConfigSchema = z.discriminatedUnion("provider", [
  msg91Schema,
  twilioSchema,
  customApiSchema,
]);

export interface SmsSettingsProps {
  onClose?: () => void;
}

const SmsSettings: React.FC<SmsSettingsProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("provider");
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const { config, updateConfig, test } = useIntegrations('sms'); // Fixed to use direct properties from the hook
  
  // Set default templates if they don't exist in the config
  const defaultTemplates = {
    membershipAlert: false,
    renewalReminder: false,
    otpVerification: false,
    attendanceConfirmation: false,
  };
  
  // Create a form with the correct provider schema
  const form = useForm<z.infer<typeof smsConfigSchema>>({
    resolver: zodResolver(smsConfigSchema),
    defaultValues: {
      provider: (config?.provider as "msg91" | "twilio" | "custom") || "msg91",
      senderId: config?.senderId || "",
      // Provider-specific fields with type assertion
      ...(config?.provider === "msg91" ? {
        msg91AuthKey: config.msg91AuthKey || "",
      } : {}),
      ...(config?.provider === "twilio" ? {
        twilioAccountSid: config.twilioAccountSid || "",
        twilioAuthToken: config.twilioAuthToken || "",
      } : {}),
      ...(config?.provider === "custom" ? {
        customApiUrl: config.customApiUrl || "",
        customApiMethod: config.customApiMethod || "POST",
        customApiHeaders: config.customApiHeaders || "",
        customApiParams: config.customApiParams || "",
      } : {}),
      templates: config?.templates || defaultTemplates,
    } as any,
  });
  
  const provider = form.watch("provider");
  
  // When provider changes, reset the form with the new provider schema
  useEffect(() => {
    if (provider) {
      form.reset({
        provider,
        senderId: form.getValues("senderId"),
        // Provider-specific fields
        ...(provider === "msg91" ? {
          msg91AuthKey: form.getValues("msg91AuthKey") || "",
        } : {}),
        ...(provider === "twilio" ? {
          twilioAccountSid: form.getValues("twilioAccountSid") || "",
          twilioAuthToken: form.getValues("twilioAuthToken") || "",
        } : {}),
        ...(provider === "custom" ? {
          customApiUrl: form.getValues("customApiUrl") || "",
          customApiMethod: form.getValues("customApiMethod") || "POST",
          customApiHeaders: form.getValues("customApiHeaders") || "",
          customApiParams: form.getValues("customApiParams") || "",
        } : {}),
        templates: form.getValues("templates") || defaultTemplates,
      } as any);
    }
  }, [provider]);

  const onSubmit = async (data: z.infer<typeof smsConfigSchema>) => {
    try {
      setIsLoading(true);
      
      // Ensure templates are properly structured
      const fullTemplates = {
        membershipAlert: data.templates.membershipAlert,
        renewalReminder: data.templates.renewalReminder,
        otpVerification: data.templates.otpVerification,
        attendanceConfirmation: data.templates.attendanceConfirmation,
      };
      
      const updatedConfig: IntegrationConfig = {
        ...data,
        templates: fullTemplates,
      } as IntegrationConfig;
      
      const success = updateConfig(updatedConfig); // Fixed function call to use single argument
      
      if (success) {
        toast.success("SMS settings saved successfully");
        if (onClose) {
          onClose();
        }
      } else {
        toast.error("Failed to save SMS settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestIntegration = async () => {
    try {
      setTestStatus("loading");
      setTestMessage("");
      
      const data = form.getValues();
      
      // Ensure templates are properly structured before testing
      const fullTemplates = {
        membershipAlert: data.templates?.membershipAlert || false,
        renewalReminder: data.templates?.renewalReminder || false,
        otpVerification: data.templates?.otpVerification || false,
        attendanceConfirmation: data.templates?.attendanceConfirmation || false,
      };
      
      const testConfig: IntegrationConfig = {
        ...data,
        templates: fullTemplates,
      } as IntegrationConfig;
      
      // Update config temporarily for testing
      updateConfig(testConfig); // Fixed to use single argument
      
      // Run test
      const result = await test(); // Fixed to use no arguments as per hook expectation
      
      if (result.success) {
        setTestStatus("success");
        setTestMessage(result.message || "Test message sent successfully");
      } else {
        setTestStatus("error");
        setTestMessage(result.message || "Failed to send test message");
      }
    } catch (error) {
      console.error("Test error:", error);
      setTestStatus("error");
      setTestMessage("An unexpected error occurred during testing");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Integration Settings</CardTitle>
        <CardDescription>
          Configure SMS providers for sending notifications and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="provider">Provider Settings</TabsTrigger>
            <TabsTrigger value="templates">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider" className="space-y-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="provider"
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
                          <SelectItem value="msg91">MSG91 (India)</SelectItem>
                          <SelectItem value="twilio">Twilio (Global)</SelectItem>
                          <SelectItem value="custom">Custom API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your SMS gateway provider
                      </FormDescription>
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
                        <Input placeholder="Enter sender ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        {provider === "twilio" 
                          ? "Your Twilio phone number that will send SMS messages" 
                          : "6-character alphanumeric sender ID (e.g., GYMMSG)"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {provider === "msg91" && (
                  <FormField
                    control={form.control}
                    name="msg91AuthKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MSG91 Auth Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter auth key" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your MSG91 authentication key
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {provider === "twilio" && (
                  <>
                    <FormField
                      control={form.control}
                      name="twilioAccountSid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twilio Account SID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account SID" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your Twilio account SID
                          </FormDescription>
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
                          <FormControl>
                            <Input placeholder="Enter auth token" type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your Twilio authentication token
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {provider === "custom" && (
                  <>
                    <FormField
                      control={form.control}
                      name="customApiUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-sms-api.com/send" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL endpoint of your SMS API
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
                          <FormLabel>HTTP Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select HTTP method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            HTTP method to use for API requests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customApiHeaders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Headers (JSON)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={'{\n  "Authorization": "Bearer YOUR_TOKEN",\n  "Content-Type": "application/json"\n}'}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            HTTP headers in JSON format
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
                          <FormLabel>Parameter Template (JSON)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={'{\n  "to": "{{phone}}",\n  "message": "{{message}}"\n}'}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Parameter template with placeholders for phone and message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestIntegration}
                    disabled={isLoading || testStatus === "loading"}
                    className="flex gap-2 items-center"
                  >
                    {testStatus === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        {testStatus === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : testStatus === "error" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : null}
                        Test Connection
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Reset
                    </Button>
                    
                    <Button type="submit" disabled={isLoading}>
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
                </div>
                
                {testMessage && (
                  <div className={`mt-2 p-2 text-sm rounded border ${
                    testStatus === "success" 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    {testMessage}
                  </div>
                )}
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 py-4">
            <NotificationSettings
              templates={{
                membershipAlert: form.watch("templates.membershipAlert") || false,
                renewalReminder: form.watch("templates.renewalReminder") || false,
                otpVerification: form.watch("templates.otpVerification") || false,
                attendanceConfirmation: form.watch("templates.attendanceConfirmation") || false
              }}
              onChange={(templates) => {
                form.setValue("templates", templates as any, { shouldDirty: true });
              }}
            />
            
            <div className="flex justify-end pt-4">
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmsSettings;

