
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
import { Loader2, EyeOff, Eye, MessageCircle, Pencil, Save, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Base schema with common fields
const baseSmsSchema = z.object({
  provider: z.enum(["msg91", "twilio"]),
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

// Combined schema with discriminated union
const smsSchema = z.discriminatedUnion("provider", [
  msg91Schema,
  twilioSchema,
]);

type SmsFormValues = z.infer<typeof smsSchema>;

// Template interface
interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  enabled: boolean;
}

const SmsSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"msg91" | "twilio">("msg91");
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

  // Default values for the form
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

  // Watch for provider changes to update the form
  const watchProvider = form.watch("provider");
  React.useEffect(() => {
    setSelectedProvider(watchProvider);
  }, [watchProvider]);

  async function onSubmit(data: SmsFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("SMS settings saved:", data);
      toast.success("SMS settings saved successfully!");
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
      // In a real implementation, this would be an API call to send a test SMS
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`Test SMS sent to ${testPhone}`);
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
                        className="flex flex-row space-y-0 space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="msg91" />
                          </FormControl>
                          <FormLabel className="font-normal">MSG91</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="twilio" />
                          </FormControl>
                          <FormLabel className="font-normal">Twilio</FormLabel>
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
