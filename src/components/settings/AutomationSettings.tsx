
import React, { useState } from "react";
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
import { Loader2, Clock, AlertCircle, UserPlus, RotateCw, CreditCard, Mail, FileText } from "lucide-react";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card as CardElement } from "@/components/ui/card";

// Define the form schema with Zod
const automationSchema = z.object({
  membershipRules: z.object({
    expiryReminderEnabled: z.boolean().default(true),
    expiryReminderDays: z.coerce.number().int().min(1).max(30),
    autoRenewalFollowupEnabled: z.boolean().default(true),
    autoRenewalFollowupDays: z.coerce.number().int().min(1).max(30),
    createInvoiceOnAssignment: z.boolean().default(true),
    sendWelcomeEmail: z.boolean().default(true),
    sendInvoiceEmail: z.boolean().default(true)
  }),
  paymentRules: z.object({
    createMemberOnPayment: z.boolean().default(true),
    assignMembershipOnPayment: z.boolean().default(true)
  }),
  leadRules: z.object({
    autoAssignmentEnabled: z.boolean().default(false),
    assignmentStrategy: z.enum(["round-robin", "random", "load-balanced"]),
    followupRemindersEnabled: z.boolean().default(true),
  }),
  schedulingFrequency: z.enum(["hourly", "daily", "weekly"]),
});

type AutomationFormValues = z.infer<typeof automationSchema>;

const AutomationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("membership");

  // Default values for the form
  const defaultValues: AutomationFormValues = {
    membershipRules: {
      expiryReminderEnabled: true,
      expiryReminderDays: 7,
      autoRenewalFollowupEnabled: true,
      autoRenewalFollowupDays: 3,
      createInvoiceOnAssignment: true,
      sendWelcomeEmail: true,
      sendInvoiceEmail: true
    },
    paymentRules: {
      createMemberOnPayment: true,
      assignMembershipOnPayment: true
    },
    leadRules: {
      autoAssignmentEnabled: false,
      assignmentStrategy: "round-robin",
      followupRemindersEnabled: true,
    },
    schedulingFrequency: "daily",
  };

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema),
    defaultValues,
  });

  // Watch for changes to toggle-dependent fields
  const expiryReminderEnabled = form.watch("membershipRules.expiryReminderEnabled");
  const autoRenewalFollowupEnabled = form.watch("membershipRules.autoRenewalFollowupEnabled");
  const autoAssignmentEnabled = form.watch("leadRules.autoAssignmentEnabled");
  const sendWelcomeEmail = form.watch("membershipRules.sendWelcomeEmail");
  const sendInvoiceEmail = form.watch("membershipRules.sendInvoiceEmail");
  const createInvoiceOnAssignment = form.watch("membershipRules.createInvoiceOnAssignment");
  const createMemberOnPayment = form.watch("paymentRules.createMemberOnPayment");
  const assignMembershipOnPayment = form.watch("paymentRules.assignMembershipOnPayment");

  async function onSubmit(data: AutomationFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Automation settings saved:", data);
      toast.success("Automation settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>
              Configure automated actions and reminders
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1 border-amber-500 text-amber-500 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="membership" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="membership">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Membership
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="lead">
                  <Mail className="h-4 w-4 mr-2" />
                  Lead
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="membership" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Membership Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure automated actions for membership management
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="membershipRules.expiryReminderEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Expiry Reminders</FormLabel>
                            <FormDescription>
                              Send automated reminders before membership expiry
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
                    
                    {expiryReminderEnabled && (
                      <FormField
                        control={form.control}
                        name="membershipRules.expiryReminderDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Before Expiry</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  min={1}
                                  max={30}
                                  className="w-20"
                                  {...field}
                                />
                                <span className="text-sm text-muted-foreground">days</span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              How many days before expiry to send reminders
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="membershipRules.autoRenewalFollowupEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Renewal Follow-ups</FormLabel>
                            <FormDescription>
                              Automatically follow up with members after membership expiry
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
                    
                    {autoRenewalFollowupEnabled && (
                      <FormField
                        control={form.control}
                        name="membershipRules.autoRenewalFollowupDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days After Expiry</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  min={1}
                                  max={30}
                                  className="w-20"
                                  {...field}
                                />
                                <span className="text-sm text-muted-foreground">days</span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              How many days after expiry to send follow-up reminders
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="membershipRules.createInvoiceOnAssignment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Create Invoice Automatically</FormLabel>
                            <FormDescription>
                              Generate an invoice when a membership is assigned
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
                      name="membershipRules.sendWelcomeEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Send Welcome Email</FormLabel>
                            <FormDescription>
                              Send welcome email with account details when membership is assigned
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
                      name="membershipRules.sendInvoiceEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Send Invoice Email</FormLabel>
                            <FormDescription>
                              Send email with invoice when a membership is assigned
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
              
              <TabsContent value="payment" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Processing Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure automated actions for payment processing
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="paymentRules.createMemberOnPayment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Create Member Account</FormLabel>
                            <FormDescription>
                              Automatically create member account when payment is received
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
                      name="paymentRules.assignMembershipOnPayment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Assign Membership</FormLabel>
                            <FormDescription>
                              Automatically assign membership when payment is received
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
                  
                  {/* Payment Webhook Status Card */}
                  <CardElement className="mt-6 bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">Payment Webhooks</h4>
                          <p className="text-sm text-muted-foreground">
                            Payment gateway webhooks are configured and active. Payments will be automatically processed.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Razorpay Active
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Stripe Ready
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CardElement>
                </div>
              </TabsContent>
              
              <TabsContent value="lead" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lead Management Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure automated lead assignment and follow-up rules
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="leadRules.autoAssignmentEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Assignment</FormLabel>
                            <FormDescription>
                              Automatically assign new leads to staff members
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
                    
                    {autoAssignmentEnabled && (
                      <FormField
                        control={form.control}
                        name="leadRules.assignmentStrategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignment Strategy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a strategy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="round-robin">Round Robin</SelectItem>
                                <SelectItem value="random">Random</SelectItem>
                                <SelectItem value="load-balanced">Load Balanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How to distribute leads among staff members
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="leadRules.followupRemindersEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Follow-up Reminders</FormLabel>
                            <FormDescription>
                              Remind staff to follow up with leads that haven't been contacted
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
            </Tabs>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Configure how often automation tasks run
              </p>
              
              <FormField
                control={form.control}
                name="schedulingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Execution Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hourly">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Hourly</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="daily">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Daily</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="weekly">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Weekly</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often to run the automated tasks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.success("Automation tasks triggered manually")}
                >
                  <RotateCw className="h-4 w-4" />
                  Run Tasks Now
                </Button>
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

export default AutomationSettings;
