
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Announcement } from "@/types/notification";
import { useAuth } from "@/hooks/use-auth";
import { announcementService } from "@/services/communicationService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  targetRoles: z.array(z.string()).min(1, "At least one target role must be selected"),
  channels: z.array(z.enum(["email", "sms", "whatsapp", "in-app"])).min(1, "At least one channel must be selected"),
  expiresAt: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
  { id: "member", label: "Members" },
  { id: "trainer", label: "Trainers" },
  { id: "staff", label: "Staff" },
  { id: "admin", label: "Administrators" },
];

const channelOptions = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "in-app", label: "In-App Notification" },
];

interface CreateAnnouncementFormProps {
  onSuccess?: () => void;
}

export const CreateAnnouncementForm = ({ onSuccess }: CreateAnnouncementFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "medium",
      targetRoles: ["member"],
      channels: ["in-app"],
      expiresAt: undefined,
    },
  });

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast.error("You must be logged in to create announcements");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const announcementData: Omit<Announcement, "id" | "createdAt"> = {
        title: data.title,
        content: data.content,
        priority: data.priority,
        targetRoles: data.targetRoles,
        channels: data.channels,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
        authorId: user.id,
        authorName: user.name || user.email || "Admin",
        branchId: user.branchId || undefined, // Using branchId instead of branch_id
      };
      
      const result = await announcementService.createAnnouncement(announcementData);
      
      if (result) {
        toast.success("Announcement created successfully");
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/communication/announcements");
        }
      } else {
        toast.error("Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("An error occurred while creating the announcement");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Announcement</CardTitle>
        <CardDescription>
          Create an announcement to communicate with gym members and staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title" {...field} />
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter announcement content here..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <DatePicker 
                      date={expiryDate} 
                      setDate={(date) => {
                        setExpiryDate(date);
                        field.onChange(date);
                      }}
                      placeholder="Select expiry date"
                    />
                    <FormDescription>
                      If set, the announcement will be automatically archived after this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="targetRoles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Target Audience</FormLabel>
                    <FormDescription>
                      Select who should receive this announcement
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roleOptions.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="targetRoles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="channels"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Notification Channels</FormLabel>
                    <FormDescription>
                      Select how this announcement should be delivered
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {channelOptions.map((channel) => (
                      <FormField
                        key={channel.id}
                        control={form.control}
                        name="channels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={channel.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel.id as any)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, channel.id as any])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== channel.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {channel.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/communication/announcements")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Announcement"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAnnouncementForm;
