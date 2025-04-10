import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";

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
});

// Define the type for the form values based on the schema
type WhatsAppFormValues = z.infer<typeof whatsAppSchema>;

const WhatsAppSettings = () => {
  const [isLoading, setIsLoading] = React.useState(false);

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
    },
    mode: "onChange",
  });

  const { formState } = form;

  // Function to handle form submission
  const onSubmit = async (values: WhatsAppFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("WhatsApp settings saved:", values);
      toast.success("WhatsApp settings saved successfully!");
    } catch (error) {
      console.error("Error saving WhatsApp settings:", error);
      toast.error("Failed to save WhatsApp settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sending a test message
  const onSendTestMessage = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Test message sent successfully!");
    } catch (error) {
      console.error("Error sending test message:", error);
      toast.error("Failed to send test message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Integration</CardTitle>
        <CardDescription>
          Configure WhatsApp integration for automated notifications and
          communication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200 text-blue-800">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Important Note</h4>
              <p className="text-sm mt-1">
                To enable WhatsApp integration, you need a valid WhatsApp
                Business account and API token. Ensure that the phone number ID
                and business account ID are correctly configured.
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
                      Enter your WhatsApp API token.
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
                      Enter your WhatsApp Phone Number ID.
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <div className="flex gap-2">
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

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => onSendTestMessage()}
                    disabled={isLoading || !formState.isValid}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Test Message
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Form>
    </CardContent>
  </Card>
);

export default WhatsAppSettings;
