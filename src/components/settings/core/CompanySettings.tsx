
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCompanySettings } from "@/hooks/core/use-company-settings";

// Define the form schema with Zod
const companySettingsSchema = z.object({
  gym_name: z.string().min(2, { message: "Gym name must be at least 2 characters." }),
  contact_email: z.string().email({ message: "Invalid email address." }),
  contact_phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  business_hours_start: z.string(),
  business_hours_end: z.string(),
  currency: z.string(),
  currency_symbol: z.string(),
  tax_rate: z.coerce.number().min(0).max(100),
});

type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;

const CompanySettings = () => {
  const { data: settings, isLoading, isSaving, updateData } = useCompanySettings();

  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: settings,
  });

  // Update form when settings change
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  async function onSubmit(data: CompanySettingsFormValues) {
    await updateData(data);
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Settings</CardTitle>
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
                name="gym_name"
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
                name="contact_email"
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
                name="contact_phone"
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
                  name="business_hours_start"
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
                  name="business_hours_end"
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
                name="currency_symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Symbol</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Symbol used for displaying currency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax_rate"
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
                onClick={() => form.reset(settings)}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
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

export default CompanySettings;
