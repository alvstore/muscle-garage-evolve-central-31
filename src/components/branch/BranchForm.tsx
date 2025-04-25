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
import { Branch } from "@/types/branch";
import { useBranch } from "@/hooks/use-branch";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  manager: z.string().optional(),
  is_active: z.boolean().default(true),
  maxCapacity: z.string().optional(),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  // Added fields for enhanced multi-branch support
  region: z.string().optional(),
  branchCode: z.string().optional(),
  taxRate: z.string().optional(),
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
      manager: branch?.manager || "",
      is_active: branch?.is_active ?? true,
      maxCapacity: branch?.maxCapacity?.toString() || "",
      openingHours: branch?.openingHours || "",
      closingHours: branch?.closingHours || "",
      // Initialize new fields
      region: branch?.region || "",
      branchCode: branch?.branchCode || "",
      taxRate: branch?.taxRate?.toString() || "",
      timezone: branch?.timezone || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const branchData = {
        name: values.name,
        address: values.address,
        phone: values.phone || '',
        email: values.email || '',
        manager: values.manager || '',
        managerId: branch?.managerId || '',
        is_active: values.is_active,
        maxCapacity: values.maxCapacity ? parseInt(values.maxCapacity) : 0,
        openingHours: values.openingHours || '',
        closingHours: values.closingHours || '',
        region: values.region,
        branchCode: values.branchCode,
        taxRate: values.taxRate ? parseFloat(values.taxRate) : undefined,
        timezone: values.timezone
      };
      
      let success = false;
      
      if (isEditMode && branch) {
        const result = await updateBranch(branch.id, branchData);
        success = !!result;
      } else {
        const result = await createBranch(branchData);
        success = !!result;
      }
      
      if (success) {
        form.reset();
        onComplete();
        toast.success(`Branch ${isEditMode ? 'updated' : 'created'} successfully`);
      }
    } catch (error) {
      console.error("Error submitting branch form:", error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} branch`);
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
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. NYC001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique code for this branch location
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
                  <FormLabel className="text-base">Branch Status</FormLabel>
                  <FormDescription>
                    Inactive branches won't be available for selection
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Northeast" {...field} />
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
              name="openingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 06:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="closingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 22:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Manager</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manager name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter maximum capacity" type="number" {...field} />
                  </FormControl>
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
                  <Input placeholder="e.g. 8.5" type="number" step="0.01" {...field} />
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
