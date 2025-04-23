
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye, MessageCircle } from "lucide-react";
import { useIntegrations } from "@/hooks/use-integrations";
import { NotificationSettings } from "@/components/settings/sms/NotificationSettings";
import { IntegrationConfig } from "@/services/integrationService";

export interface SmsSettingsProps {
  onClose: () => void;
}

// Base schema with common fields
const baseSmsSchema = z.object({
  provider: z.enum(["msg91", "twilio", "custom"]),
  senderId: z.string().min(1, { message: "Sender ID is required" }),
  templates: z.object({
    membershipAlert: z.boolean().default(true),
    renewalReminder: z.boolean().default(true),
    otpVerification: z.boolean().default(false),
    attendanceConfirmation: z.boolean().default(false),
  }),
});

// Provider-specific schemas
const msg91Schema = baseSmsSchema.extend({
  provider: z.literal("msg91"),
  msg91AuthKey: z.string().min(1, { message: "API Key is required" }),
});

const twilioSchema = baseSmsSchema.extend({
  provider: z.literal("twilio"),
  twilioAccountSid: z.string().min(1, { message: "Account SID is required" }),
  twilioAuthToken: z.string().min(1, { message: "Auth Token is required" }),
});

const customApiSchema = baseSmsSchema.extend({
  provider: z.literal("custom"),
  customApiUrl: z.string().url({ message: "Must be a valid URL" }),
  customApiParams: z.string().optional(),
});

// Combined schema with discriminated union
const smsSchema = z.discriminatedUnion("provider", [
  msg91Schema,
  twilioSchema,
  customApiSchema,
]);

type SmsFormValues = z.infer<typeof smsSchema>;

const SmsSettings: React.FC<SmsSettingsProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { config, updateConfig, test } = useIntegrations("sms");
  
  // Default values with existing config or fallbacks
  const getDefaultValues = () => {
    const baseDefaults = {
      provider: config?.provider || "msg91",
      senderId: config?.senderId || "GYMAPP",
      templates: config?.templates || {
        membershipAlert: true,
        renewalReminder: true,
        otpVerification: false,
        attendanceConfirmation: false,
      },
    };
    
    // Add provider-specific fields
    if (config?.provider === "msg91") {
      return {
        ...baseDefaults,
        msg91AuthKey: config.msg91AuthKey || "",
      };
    } else if (config?.provider === "twilio") {
      return {
        ...baseDefaults,
        twilioAccountSid: config.twilioAccountSid || "",
        twilioAuthToken: config.twilioAuthToken || "",
      };
    } else if (config?.provider === "custom") {
      return {
        ...baseDefaults,
        customApiUrl: config.customApiUrl || "",
        customApiParams: config.customApiParams || "",
      };
    }
    
    // Default to MSG91 if no provider set
    return {
      ...baseDefaults,
      provider: "msg91",
      msg91AuthKey: "",
    };
  };

  const form = useForm<SmsFormValues>({
    resolver: zodResolver(smsSchema),
    defaultValues: getDefaultValues() as any,
  });

  // Watch for provider changes to update the form
  const watchProvider = form.watch("provider");

  async function onSubmit(data: SmsFormValues) {
    try {
      setIsLoading(true);
      
      // Create an updated config object based on the provider
      const updatedConfig: Partial<IntegrationConfig> = {
        provider: data.provider,
        senderId: data.senderId,
        templates: data.templates,
      };
      
      // Add provider-specific fields
      if (data.provider === "msg91") {
        updatedConfig.msg91AuthKey = data.msg91AuthKey;
      } else if (data.provider === "twilio") {
        updatedConfig.twilioAccountSid = data.twilioAccountSid;
        updatedConfig.twilioAuthToken = data.twilioAuthToken;
      } else if (data.provider === "custom") {
        updatedConfig.customApiUrl = data.customApiUrl;
        updatedConfig.customApiParams = data.customApiParams;
      }
      
      // Update the config in the store
      updateConfig(updatedConfig);
      
      toast.success("SMS settings saved successfully!");
      onClose && onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleTestSMS = async () => {
    setIsTesting(true);
    try {
      await test();
      toast.success("Test SMS sent successfully!");
    } catch (error) {
      console.error("Error testing SMS:", error);
      toast.error("Failed to send test SMS.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>
        <CardDescription>
          Configure SMS provider for notifications and communications
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
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="msg91" />
                          </FormControl>
                          <FormLabel className="font-normal">MSG91 (India)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="twilio" />
                          </FormControl>
                          <FormLabel className="font-normal">Twilio (Global)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
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
              
              <div className="mt-6 space-y-4">
                {watchProvider === "msg91" && (
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
                          From your MSG91 dashboard
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {watchProvider === "twilio" && (
                  <>
                    <FormField
                      control={form.control}
                      name="twilioAccountSid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twilio Account SID</FormLabel>
                          <FormControl>
                            <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
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
                  </>
                )}
                
                {watchProvider === "custom" && (
                  <>
                    <FormField
                      control={form.control}
                      name="customApiUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom API URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://api.example.com/sms" {...field} />
                          </FormControl>
                          <FormDescription>
                            The endpoint URL for sending SMS
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
                          <FormLabel>API Parameters</FormLabel>
                          <FormControl>
                            <Input placeholder='{"paramName": "value"}' {...field} />
                          </FormControl>
                          <FormDescription>
                            Additional parameters as JSON
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="senderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="GYMAPP" 
                          maxLength={6} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {watchProvider === "msg91" 
                          ? "6 character Sender ID (approved by TRAI for Indian numbers)" 
                          : "Sender ID or Phone Number"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={isTesting}
                      onClick={handleTestSMS}
                      className="flex items-center gap-2"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4" />
                          Send Test SMS
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <NotificationSettings 
              config={{
                templates: form.watch("templates")
              }}
              onUpdateConfig={(newConfig) => {
                if (newConfig.templates) {
                  form.setValue("templates", newConfig.templates);
                }
              }}
              onSave={() => form.handleSubmit(onSubmit)()}
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset(getDefaultValues() as any)}
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
