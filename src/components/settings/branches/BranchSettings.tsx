
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branches";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  branchName: z.string().min(2, "Branch name must be at least 2 characters."),
  branchAddress: z.string().min(5, "Please enter a valid address."),
  branchPhone: z.string().min(6, "Please enter a valid phone number."),
  branchEmail: z.string().email("Please enter a valid email address."),
  branchCity: z.string().min(2, "City must be at least 2 characters."),
  branchState: z.string().min(2, "State must be at least 2 characters."),
  branchCountry: z.string().min(2, "Country must be at least 2 characters."),
});

export default function BranchSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: currentBranch?.name || "",
      branchAddress: "",
      branchPhone: "",
      branchEmail: "",
      branchCity: "",
      branchState: "",
      branchCountry: "India",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Branch settings:", values);
      toast.success("Branch settings saved successfully");
    } catch (error) {
      console.error("Error saving branch settings:", error);
      toast.error("Failed to save branch settings");
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
          name="branchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch name" {...field} />
              </FormControl>
              <FormDescription>
                The name of this branch location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="branchAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormDescription>
                Physical address of this branch
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="branchCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="branchState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="branchCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="branchPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  Contact phone for this branch
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="branchEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="branch@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Contact email for this branch
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Branch Settings"
          )}
        </Button>
      </form>
    </Form>
  );
}
