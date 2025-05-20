import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Announcement } from '@/types/communication/notification';
import { UserRole } from '@/types/auth/user';
import { useBranch } from "@/hooks/settings/use-branches";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth/use-auth";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  targetRoles: z.array(z.string()).min(1, "Select at least one role"),
  channels: z.array(z.string()).min(1, "Select at least one channel"),
  priority: z.enum(["low", "medium", "high"]).default("low"),
  expiresAt: z.date().optional(),
  sendNow: z.boolean().default(true),
  scheduledDate: z.date().optional(),
  showPreview: z.boolean().default(false),
});

interface AnnouncementFormProps {
  editAnnouncement?: Announcement | null;
  onComplete: () => void;
}

const priorities = [
  { value: "low", label: "Low Priority", description: "Regular announcements" },
  { value: "medium", label: "Medium Priority", description: "Important updates" },
  { value: "high", label: "High Priority", description: "Urgent announcements" },
] as const;

const userRoles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrators" },
  { value: "staff", label: "Staff Members" },
  { value: "trainer", label: "Trainers" },
  { value: "member", label: "Members" },
];

const notificationChannels: { value: string; label: string }[] = [
  { value: "in-app", label: "In-App Notification" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const AnnouncementForm = ({ editAnnouncement, onComplete }: AnnouncementFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      targetRoles: [],
      channels: ["in-app"],
      priority: "low",
      sendNow: true,
      scheduledDate: addDays(new Date(), 1),
      showPreview: false,
    },
  });

  const sendNow = form.watch("sendNow");

  useEffect(() => {
    if (editAnnouncement) {
      form.reset({
        title: editAnnouncement.title,
        content: editAnnouncement.content,
        targetRoles: editAnnouncement.target_roles as string[],
        channels: editAnnouncement.channels as string[] || ["in-app"],
        sendNow: true,
        expiresAt: editAnnouncement.expires_at ? new Date(editAnnouncement.expires_at) : undefined,
      });
    }
  }, [editAnnouncement, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to create announcements");
      }

      // Convert form data to match database schema
      const announcementData = {
        title: values.title,
        content: values.content,
        priority: values.priority,
        author_id: user.id,
        author_name: user.email?.split('@')[0] || 'Unknown',
        target_roles: values.targetRoles,
        channels: values.channels,
        expires_at: values.expiresAt?.toISOString(),
        branch_id: currentBranch?.id,
      };

      if (!currentBranch?.id) {
        throw new Error("Please select a branch first");
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcementData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success(
        editAnnouncement 
          ? "🔄 Announcement updated successfully" 
          : "✨ New announcement " + (values.sendNow ? "published" : "scheduled")
      );
      
      form.reset();
      onComplete();
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error("⚠️ Failed to " + (editAnnouncement ? "update" : "create") + " announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editAnnouncement ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the announcement message" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can use <code>@name</code> to personalize the message for each recipient.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <span>{priority.label}</span>
                            <span className="text-muted-foreground text-sm">- {priority.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showPreview"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Preview</FormLabel>
                    <FormDescription>
                      Preview how the announcement will look to recipients
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("showPreview") && (
              <Card className="p-6 bg-muted/50">
                <CardHeader className="p-0 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{form.watch("title") || "[Title]"}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Posted by {"[Current User]"} • {format(new Date(), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant={form.watch("priority") === "high" ? "destructive" : 
                             form.watch("priority") === "medium" ? "warning" : "default"}
                    >
                      {form.watch("priority")} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="whitespace-pre-wrap">{form.watch("content") || "[Content]"}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="targetRoles"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Target Audience</FormLabel>
                      <FormDescription>
                        Select who should receive this announcement
                      </FormDescription>
                    </div>
                    {userRoles.map((role) => (
                      <FormField
                        key={role.value}
                        control={form.control}
                        name="targetRoles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.value}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="channels"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Notification Channels</FormLabel>
                      <FormDescription>
                        Select how to deliver this announcement
                      </FormDescription>
                    </div>
                    {notificationChannels.map((channel) => (
                      <FormField
                        key={channel.value}
                        control={form.control}
                        name="channels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={channel.value}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, channel.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== channel.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {channel.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date (Optional)</FormLabel>
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
                            <span>Never expires</span>
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Button
                          variant="ghost"
                          onClick={() => field.onChange(undefined)}
                          size="sm"
                          className="w-full"
                        >
                          Clear (No Expiration)
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    If set, the announcement will be automatically removed after this date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sendNow"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send immediately</FormLabel>
                    <FormDescription>
                      Uncheck to schedule for a later date
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {!sendNow && (
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Date</FormLabel>
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
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The announcement will be sent at the scheduled date and time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
                    Saving...
                  </span>
                ) : editAnnouncement ? "Update Announcement" : "Create Announcement"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementForm;
