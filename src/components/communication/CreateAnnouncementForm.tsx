
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAnnouncements } from "@/hooks/use-announcements";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';

const announcementFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  priority: z.enum(["low", "medium", "high"], { required_error: "You need to select a priority" }),
  targetRoles: z.array(z.string()).min(1, { message: "You must select at least one target group" }),
  expiresAt: z.date().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export function CreateAnnouncementForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["member"]);
  const { createAnnouncement } = useAnnouncements({});
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  // Get default values for the form
  const defaultValues: Partial<AnnouncementFormValues> = {
    title: "",
    content: "",
    priority: "medium",
    targetRoles: ["member"],
  };

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues,
  });

  // Function to check if a role is selected
  const isRoleSelected = (role: string) => {
    return selectedRoles.includes(role);
  };

  // Function to toggle a role
  const toggleRole = (role: string) => {
    if (isRoleSelected(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
      form.setValue(
        "targetRoles",
        form.getValues().targetRoles.filter((r) => r !== role)
      );
    } else {
      setSelectedRoles([...selectedRoles, role]);
      form.setValue("targetRoles", [...form.getValues().targetRoles, role]);
    }
  };

  // Submit the announcement
  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      if (!user) return;
      
      const result = await createAnnouncement({
        title: data.title,
        content: data.content,
        authorId: user.id,
        authorName: user.full_name || user.email || 'Unknown User',
        priority: data.priority,
        targetRoles: data.targetRoles,
        forBranchIds: currentBranch ? [currentBranch.id] : [],
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined
      });
      
      if (result && onSuccess) {
        form.reset(defaultValues);
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement Title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a clear and concise title for your announcement.
                  </FormDescription>
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
                      placeholder="Announcement Content"
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide the details of your announcement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Low</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">Medium</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">High</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRoles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Target Audience</FormLabel>
                    <FormDescription>
                      Select who should see this announcement.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={isRoleSelected("member") ? "default" : "outline"}
                      onClick={() => toggleRole("member")}
                      className="justify-start"
                    >
                      Members
                    </Button>
                    <Button
                      type="button"
                      variant={isRoleSelected("trainer") ? "default" : "outline"}
                      onClick={() => toggleRole("trainer")}
                      className="justify-start"
                    >
                      Trainers
                    </Button>
                    <Button
                      type="button"
                      variant={isRoleSelected("staff") ? "default" : "outline"}
                      onClick={() => toggleRole("staff")}
                      className="justify-start"
                    >
                      Staff
                    </Button>
                    <Button
                      type="button"
                      variant={isRoleSelected("admin") ? "default" : "outline"}
                      onClick={() => toggleRole("admin")}
                      className="justify-start"
                    >
                      Admins
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[240px] justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>No expiry date</span>
                          )}
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
                    Set a date when this announcement should expire.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Announcement</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
