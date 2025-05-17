
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useBranch } from "@/hooks/settings/use-branches";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  gymName: z.string().min(2, "Gym name must be at least 2 characters."),
  contactEmail: z.string().email("Please enter a valid email address."),
  contactPhone: z.string().min(6, "Please enter a valid phone number."),
  businessHoursStart: z.string(),
  businessHoursEnd: z.string(),
  timezone: z.string(),
  currency: z.string(),
  taxRate: z.number().min(0).max(100),
});

const timeOptions = [
  { value: "05:00", label: "5:00 AM" },
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "23:00", label: "11:00 PM" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "CAD", label: "CAD ($)" },
];

const timezoneOptions = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "EST (Eastern Standard Time)" },
  { value: "America/Chicago", label: "CST (Central Standard Time)" },
  { value: "America/Denver", label: "MST (Mountain Standard Time)" },
  { value: "America/Los_Angeles", label: "PST (Pacific Standard Time)" },
  { value: "Europe/London", label: "GMT (Greenwich Mean Time)" },
  { value: "Europe/Paris", label: "CET (Central European Time)" },
  { value: "Asia/Tokyo", label: "JST (Japan Standard Time)" },
  { value: "Asia/Kolkata", label: "IST (Indian Standard Time)" },
  { value: "Australia/Sydney", label: "AEST (Australian Eastern Standard Time)" },
];

export default function GeneralSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymName: "",
      contactEmail: "",
      contactPhone: "",
      businessHoursStart: "09:00",
      businessHoursEnd: "21:00",
      timezone: "UTC",
      currency: "INR",
      taxRate: 18,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentBranch?.id) return;
      
      setIsLoading(true);
      try {
        // Attempt to get company settings
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .single();
        
        if (error) {
          console.error("Error fetching settings:", error);
          return;
        }
        
        if (data) {
          setSettings(data);
          form.reset({
            gymName: data.gym_name || "",
            contactEmail: data.contact_email || "",
            contactPhone: data.contact_phone || "",
            businessHoursStart: data.business_hours_start || "09:00",
            businessHoursEnd: data.business_hours_end || "21:00",
            timezone: data.timezone || "UTC",
            currency: data.currency || "INR",
            taxRate: data.tax_rate || 18,
          });
        }
      } catch (err) {
        console.error("Error in fetchSettings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentBranch?.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }

    setIsLoading(true);
    try {
      let query;
      
      if (settings?.id) {
        // Update existing settings
        query = supabase
          .from('company_settings')
          .update({
            gym_name: values.gymName,
            contact_email: values.contactEmail,
            contact_phone: values.contactPhone,
            business_hours_start: values.businessHoursStart,
            business_hours_end: values.businessHoursEnd,
            timezone: values.timezone,
            currency: values.currency,
            tax_rate: values.taxRate,
            updated_at: new Date(),
          })
          .eq('id', settings.id);
      } else {
        // Insert new settings
        query = supabase
          .from('company_settings')
          .insert([
            {
              gym_name: values.gymName,
              contact_email: values.contactEmail,
              contact_phone: values.contactPhone,
              business_hours_start: values.businessHoursStart,
              business_hours_end: values.businessHoursEnd,
              timezone: values.timezone,
              currency: values.currency,
              tax_rate: values.taxRate,
            },
          ]);
      }

      const { error } = await query;
      
      if (error) {
        console.error('Error saving settings:', error);
        toast.error("Failed to save settings");
        return;
      }
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!currentBranch?.id) {
    return (
      <div className="text-center p-4">
        Please select a branch to view settings
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="gymName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter gym name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will appear on all your documents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Primary email address for communications
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
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  Primary phone number for communications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="businessHoursStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Hours Start</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  When your gym opens each day
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessHoursEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Hours End</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  When your gym closes each day
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timezoneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your local timezone for scheduling
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Currency used for all transactions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="taxRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Rate (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="18" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Default tax rate applied to invoices
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
      </form>
    </Form>
  );
}
