
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/services/api";

// Define the form schema with Zod
const generalSettingsSchema = z.object({
  gymName: z.string().min(2, { message: "Gym name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  contactPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  businessHoursStart: z.string(),
  businessHoursEnd: z.string(),
  timezone: z.string(),
  currency: z.string(),
  taxRate: z.coerce.number().min(0).max(100),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const GeneralSettings = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Default values for the form
  const defaultValues: Partial<GeneralSettingsFormValues> = {
    gymName: "Muscle Garage",
    contactEmail: "contact@muscle-garage.com",
    contactPhone: "1234567890",
    businessHoursStart: "06:00",
    businessHoursEnd: "22:00",
    timezone: "Asia/Kolkata",
    currency: "INR",
    taxRate: 18,
  };

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
  });

  async function onSubmit(data: GeneralSettingsFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("General settings saved:", data);
      toast.success("General settings saved successfully!");
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
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Basic configuration for your gym management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gymName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gym Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Muscle Garage" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on receipts, invoices, and emails
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@muscle-garage.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Primary contact email for your gym
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 1234567890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Primary contact phone for your gym
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessHoursStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessHoursEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0/+1)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5/-4)</SelectItem>
                        <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Used for scheduling and reports
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                        <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Used for payments and invoices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Default GST/Tax rate for invoices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default GeneralSettings;
