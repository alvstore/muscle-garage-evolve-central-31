
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Branch } from "@/types/settings/branch";
import { useBranch } from "@/hooks/settings/use-branches";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  manager_id: z.string().optional(),
  is_active: z.boolean().default(true),
  branch_code: z.string().optional(),
  // Additional fields from the database schema
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional().default('India'),
  // Extended fields (if needed)
  max_capacity: z.string().optional(),
  opening_hours: z.string().optional(),
  closing_hours: z.string().optional(),
  region: z.string().optional(),
  tax_rate: z.string().optional(),
  timezone: z.string().optional(),
});

interface BranchFormProps {
  branch?: Branch | null;
  onComplete: () => void;
}

const BranchForm = ({ branch, onComplete }: BranchFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!branch;
  const { createBranch, updateBranch } = useBranch();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name || "",
      address: branch?.address || "",
      phone: branch?.phone || "",
      email: branch?.email || "",
      manager_id: branch?.manager_id || "",
      is_active: branch?.is_active ?? true,
      branch_code: branch?.branch_code || "",
      city: branch?.city || "Ahmedabad",
      state: branch?.state || "",
      country: branch?.country || "India",
      // Extended fields
      max_capacity: branch?.max_capacity?.toString() || "50",
      opening_hours: branch?.opening_hours || "09:00",
      closing_hours: branch?.closing_hours || "22:00",
      region: branch?.region || "",
      tax_rate: branch?.tax_rate ? (Number(branch.tax_rate) * 100).toString() : "18",
      timezone: branch?.timezone || "Asia/Kolkata",
    },
  });
  
  // Helper function to safely cast field values
  const getFieldValue = (value: unknown, defaultValue: string = ""): string => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };
  
  // Helper to get field value for form inputs
  const getInputValue = (field: any): string => {
    if (field.value === undefined || field.value === null) return '';
    return String(field.value);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    setIsSubmitting(true);
    
    try {
      // Validate required fields first
      if (!values.name?.trim()) {
        const errorMsg = 'Branch name is required';
        console.error(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      if (!values.address?.trim()) {
        const errorMsg = 'Branch address is required';
        console.error(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Debug tax rate value
      console.log('Raw tax_rate from form:', values.tax_rate);
      const taxRateValue = parseFloat(values.tax_rate || '0') || 0;
      console.log('Parsed tax rate (before conversion):', taxRateValue);
      const convertedTaxRate = Math.min(1, Math.max(0, taxRateValue / 100));
      console.log('Converted tax rate (after conversion):', convertedTaxRate);
      
      // Prepare branch data with all required fields
      const branchData: Partial<Branch> = {
        name: values.name.trim(),
        address: values.address.trim(),
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        manager_id: values.manager_id?.trim() || null,
        is_active: values.is_active,
        branch_code: values.branch_code?.trim() || null,
        city: values.city?.trim() || null,
        state: values.state?.trim() || null,
        country: values.country?.trim() || 'India',
        created_at: branch?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Extended fields
        max_capacity: values.max_capacity ? parseInt(values.max_capacity) : 50,
        opening_hours: values.opening_hours?.trim() || '09:00',
        closing_hours: values.closing_hours?.trim() || '22:00',
        region: values.region?.trim() || null,
        tax_rate: convertedTaxRate,
        timezone: values.timezone?.trim() || 'Asia/Kolkata'
      };
      
      console.log('Prepared branch data for submission:', branchData);
      
      let result;
      
      try {
        if (isEditMode && branch) {
          console.log('Updating branch with ID:', branch.id);
          result = await updateBranch(branch.id, branchData);
        } else {
          console.log('Creating new branch');
          result = await createBranch(branchData);
        }
        
        if (!result) {
          throw new Error('No result returned from the branch operation');
        }
        
        console.log('Branch operation successful, result:', result);
        
        // Reset form on success
        form.reset({
          name: '',
          address: '',
          city: '',
          state: '',
          country: 'India',
          email: '',
          phone: '',
          is_active: true,
          branch_code: '',
          max_capacity: '',
          opening_hours: '',
          closing_hours: '',
          region: '',
          tax_rate: '18', // Default to 18% as a common tax rate
          timezone: ''
        });
        
        onComplete();
        toast.success(`Branch ${isEditMode ? 'updated' : 'created'} successfully`);
        
      } catch (error: any) {
        console.error('Error in branch operation:', {
          error,
          message: error.message,
          stack: error.stack,
          ...(error.response && { response: error.response.data })
        });
        
        const errorMessage = error.message || `Failed to ${isEditMode ? 'update' : 'create'} branch`;
        console.error(errorMessage);
        toast.error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Unexpected error in form submission:', {
        error,
        message: error.message,
        stack: error.stack
      });
      toast.error('An unexpected error occurred. Please check the console for more details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter branch name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="branch_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., BR-001"
                      {...field}
                      value={getInputValue(field)}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique code for this branch
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Toggle to activate or deactivate this branch
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter branch address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ahmedabad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Gujarat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. West India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Asia/Kolkata" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="09:00"
                      {...field}
                      value={getInputValue(field) || '09:00'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="closing_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Hours</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="18:00" {...field} value={getInputValue(field) || '18:00'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manager_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Manager's user ID" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the user ID of the branch manager
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="max_capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      {...field}
                      value={getInputValue(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="tax_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 18.00"
                    {...field}
                    value={getFieldValue(field.value, '')}
                  />
                </FormControl>
                <FormDescription>
                  Used for calculating taxes on membership fees and product sales
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onComplete}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </span>
              ) : isEditMode ? "Update Branch" : "Create Branch"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BranchForm;
