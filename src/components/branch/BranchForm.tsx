
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  manager: z.string().optional(),
  isActive: z.boolean().default(true),
  maxCapacity: z.string().optional(),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
});

interface BranchFormProps {
  branch?: Branch | null;
  onComplete: () => void;
}

const BranchForm = ({ branch, onComplete }: BranchFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!branch;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name || "",
      address: branch?.address || "",
      phone: branch?.phone || "",
      email: branch?.email || "",
      manager: branch?.manager || "",
      isActive: branch?.isActive ?? true,
      maxCapacity: branch?.maxCapacity?.toString() || "",
      openingHours: branch?.openingHours || "",
      closingHours: branch?.closingHours || "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Simulate API call
      console.log("Submitting branch:", values);
      
      // In a real app, this would be an API call to save the branch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedBranch = {
        ...values,
        id: branch?.id || `branch${Date.now()}`,
        createdAt: branch?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        maxCapacity: values.maxCapacity ? parseInt(values.maxCapacity) : undefined,
      };
      
      return savedBranch;
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Branch updated successfully" : "Branch created successfully");
      form.reset();
      onComplete();
    },
    onError: () => {
      toast.error("There was a problem saving the branch");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    submitMutation.mutate(values);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Branch" : "Add New Branch"}</CardTitle>
      </CardHeader>
      <CardContent>
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
                name="isActive"
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
            </div>
            
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
                    <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></span>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </span>
                ) : isEditMode ? "Update Branch" : "Create Branch"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BranchForm;
