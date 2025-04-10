import { useState, useEffect } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { NotificationChannel, ReminderRule } from "@/types/notification";
import { UserRole } from "@/types";

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  type: z.enum(["membership-expiry", "attendance", "birthday", "renewal"]),
  triggerDays: z.number().min(0).max(30),
  templateId: z.string(),
  channels: z.array(z.string()).min(1, "Select at least one channel"),
  targetRoles: z.array(z.string()).min(1, "Select at least one role"),
  active: z.boolean().default(true),
});

interface ReminderRuleFormProps {
  editRule?: ReminderRule | null;
  onComplete: () => void;
}

const notificationChannels: { value: NotificationChannel; label: string }[] = [
  { value: "in-app", label: "In-App Notification" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const userRoles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrators" },
  { value: "staff", label: "Staff Members" },
  { value: "trainer", label: "Trainers" },
  { value: "member", label: "Members" },
];

const mockTemplates = [
  { id: "template1", name: "Membership Expiry Notice" },
  { id: "template2", name: "Birthday Wish Template" },
  { id: "template3", name: "Attendance Follow-up" },
  { id: "template4", name: "Membership Renewal Reminder" },
];

const ReminderRuleForm = ({ editRule, onComplete }: ReminderRuleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "membership-expiry",
      triggerDays: 7,
      templateId: "",
      channels: ["in-app"],
      targetRoles: ["member"],
      active: true,
    },
  });

  const reminderType = form.watch("type");

  useEffect(() => {
    if (editRule) {
      form.reset({
        name: editRule.name,
        type: editRule.type,
        triggerDays: editRule.triggerDays,
        templateId: editRule.template,
        channels: editRule.channels as string[],
        targetRoles: editRule.targetRoles as string[],
        active: editRule.active,
      });
    }
  }, [editRule, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting reminder rule:", values);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        editRule 
          ? "Reminder rule updated successfully" 
          : "Reminder rule created successfully"
      );
      
      form.reset();
      onComplete();
    } catch (error) {
      console.error("Error submitting reminder rule:", error);
      toast.error("There was a problem saving the reminder rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editRule ? "Edit Reminder Rule" : "Create New Reminder Rule"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter rule name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give this rule a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="membership-expiry">Membership Expiry</SelectItem>
                        <SelectItem value="renewal">Membership Renewal</SelectItem>
                        <SelectItem value="attendance">Missed Attendance</SelectItem>
                        <SelectItem value="birthday">Birthday Wishes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The event that will trigger this reminder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="triggerDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {reminderType === "birthday" 
                        ? "Days from birthday" 
                        : reminderType === "attendance" 
                        ? "Days after absence" 
                        : "Days before event"}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          min={0}
                          max={30}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                        <div className="flex justify-between">
                          <span>{field.value} days</span>
                          <Input 
                            type="number" 
                            className="w-20" 
                            min={0}
                            max={30}
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {reminderType === "birthday" 
                        ? "0 means on the birthday, negative values for days before" 
                        : reminderType === "attendance" 
                        ? "Days of absence before sending the reminder" 
                        : "How many days before the event to send this reminder"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Template</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The notification template to use for this reminder
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="channels"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Notification Channels</FormLabel>
                      <FormDescription>
                        Select how to deliver this reminder
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
              
              <FormField
                control={form.control}
                name="targetRoles"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Target Audience</FormLabel>
                      <FormDescription>
                        Select who should receive this reminder
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
            </div>
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this reminder rule
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
                ) : editRule ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReminderRuleForm;
