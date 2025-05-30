import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Lead, LeadSource, LeadStatus, FunnelStage } from "@/types/crm/crm";

// Define the validation schema
const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  source: z.enum(["website", "referral", "walk_in", "cold_call", "social_media", "event", "advertisement", "other"] as const),
  status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost", "inactive"] as const),
  funnel_stage: z.enum(["cold", "warm", "hot"] as const),
  assigned_to: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  follow_up_date: z.date().optional(),
  interests: z.array(z.string()).optional(),
});

interface LeadFormProps {
  lead?: Lead | null;
  onComplete: () => void;
}

const LeadForm = ({ lead, onComplete }: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Array<{ id: string, name: string }>>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const { currentBranch } = useBranch();
  
  const [interests, setInterests] = useState([
    "weight loss",
    "muscle gain",
    "personal training",
    "group classes",
    "nutrition consulting",
    "yoga",
    "premium membership",
  ]);
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Initialize form with default values or lead data if editing
  const form = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      source: (lead?.source || "website") as "website" | "referral" | "walk_in" | "cold_call" | "social_media" | "event" | "advertisement" | "other",
      status: (lead?.status || "new") as "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "inactive",
      funnel_stage: (lead?.funnel_stage || "cold") as "cold" | "warm" | "hot",
      assigned_to: lead?.assigned_to || "",
      notes: lead?.notes || "",
      follow_up_date: lead?.follow_up_date ? new Date(lead.follow_up_date) : undefined,
      interests: lead?.interests || [],
    },
  });

  // Fetch staff members when component mounts or branch changes
  useEffect(() => {
    const fetchStaffMembers = async () => {
      if (!currentBranch?.id) return;
      
      setIsLoadingStaff(true);
      try {
        // Fetch staff members (trainers, admins, managers) from the selected branch
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('role', ['admin', 'manager', 'trainer', 'staff'])
          .eq('branch_id', currentBranch.id)
          .eq('is_active', true)
          .order('full_name');
        
        if (error) throw error;
        
        // Format the data for the dropdown
        const formattedStaff = data.map(staff => ({
          id: staff.id,
          name: staff.full_name
        }));
        
        setStaffMembers(formattedStaff);
      } catch (error) {
        console.error('Error fetching staff members:', error);
      } finally {
        setIsLoadingStaff(false);
      }
    };
    
    fetchStaffMembers();
  }, [currentBranch?.id]);
  
  // Update selected interests when form values change
  useEffect(() => {
    if (lead?.interests) {
      setSelectedInterests(lead.interests);
    }
  }, [lead]);

  const onSubmit = async (data: z.infer<typeof leadFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Submitting lead:", { ...data, interests: selectedInterests });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API latency
      
      if (lead) {
        toast.success("Lead updated successfully");
      } else {
        toast.success("New lead created successfully");
      }
      
      onComplete();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lead ? "Edit Lead" : "Add New Lead"}</CardTitle>
        <CardDescription>
          {lead 
            ? "Update the lead information and status" 
            : "Enter the details of the new lead"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
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
                      <Input placeholder="Email address" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave blank if not available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave blank if not available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the lead source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="walk_in">Walk-in</SelectItem>
                        <SelectItem value="cold_call">Cold Call</SelectItem>
                        <SelectItem value="social_media">Social Media</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="advertisement">Advertisement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="funnel_stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funnel Stage *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select funnel stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cold">Cold</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="hot">Hot</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isLoadingStaff}>
                          <SelectValue placeholder={isLoadingStaff ? "Loading staff..." : "Assign to staff member"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staffMembers.length > 0 ? (
                          staffMembers.map(staff => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-staff" disabled>
                            {isLoadingStaff ? "Loading..." : "No staff members available"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Follow-up</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When to follow up with this lead
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map(interest => (
                  <Button
                    key={interest}
                    type="button"
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleInterest(interest)}
                    className="transition-all"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              <FormDescription>
                Select all areas the lead is interested in
              </FormDescription>
            </FormItem>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this lead" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onComplete}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {lead ? "Update Lead" : "Save Lead"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LeadForm;
