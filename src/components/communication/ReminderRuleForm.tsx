
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useReminderRules } from '@/hooks/use-reminder-rules';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

export interface ReminderRuleFormProps {
  editRule?: ReminderRule;
  onComplete?: () => void;
}

const schema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  triggerType: z.string(),
  triggerValue: z.string().transform(Number).optional(),
  notificationChannel: z.string(),
  sendVia: z.array(z.string()).min(1, { message: 'At least one notification channel must be selected' }),
  targetRoles: z.array(z.string()).min(1, { message: 'At least one target role must be selected' }),
  message: z.string().optional(),
  isActive: z.boolean().default(true),
});

const triggerTypes = [
  { value: 'membership_expiry', label: 'Membership Expiry', needsValue: true },
  { value: 'birthday', label: 'Birthday', needsValue: true },
  { value: 'class_reminder', label: 'Class Reminder', needsValue: true },
  { value: 'payment_due', label: 'Payment Due', needsValue: true },
  { value: 'attendance_missed', label: 'Attendance Missed', needsValue: true },
  { value: 'membership_renewal', label: 'Membership Renewal', needsValue: true },
  { value: 'goal_achieved', label: 'Goal Achieved', needsValue: false },
  { value: 'follow_up', label: 'Follow Up', needsValue: true },
];

const notificationChannels = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'app', label: 'In-App' },
  { value: 'push', label: 'Push Notification' },
];

const targetRoles = [
  { value: 'member', label: 'Member' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
];

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ editRule, onComplete }) => {
  const { createReminderRule, updateReminderRule } = useReminderRules();
  const { toast } = useToast();
  const [needsValue, setNeedsValue] = useState(editRule ? 
    triggerTypes.find(t => t.value === editRule.triggerType)?.needsValue ?? false : 
    true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editRule?.title || '',
      description: editRule?.description || '',
      triggerType: editRule?.triggerType || 'membership_expiry',
      triggerValue: editRule?.triggerValue?.toString() || '7',
      notificationChannel: editRule?.notificationChannel || 'email',
      sendVia: editRule?.sendVia || ['email'],
      targetRoles: editRule?.targetRoles || ['member'],
      message: editRule?.message || '',
      isActive: editRule?.isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const ruleData = {
        title: values.title,
        description: values.description,
        triggerType: values.triggerType as ReminderTriggerType,
        triggerValue: values.triggerValue,
        notificationChannel: values.notificationChannel as NotificationChannel,
        sendVia: values.sendVia,
        targetRoles: values.targetRoles,
        message: values.message,
        isActive: values.isActive,
        conditions: {}
      };

      let success = false;

      if (editRule) {
        success = await updateReminderRule(editRule.id, ruleData);
        if (success) {
          toast({
            title: "Rule Updated",
            description: "The reminder rule has been updated successfully.",
          });
        }
      } else {
        success = await createReminderRule(ruleData);
        if (success) {
          toast({
            title: "Rule Created",
            description: "New reminder rule has been created successfully.",
          });
          form.reset();
        }
      }

      if (success && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving reminder rule:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the reminder rule.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter rule title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe what this rule does" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="triggerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedType = triggerTypes.find(t => t.value === value);
                    setNeedsValue(selectedType?.needsValue ?? false);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {triggerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {needsValue && (
            <FormField
              control={form.control}
              name="triggerValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Before/After</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of days before/after the event to send the reminder
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="notificationChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Notification Channel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification channel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {notificationChannels.map((channel) => (
                    <SelectItem key={channel.value} value={channel.value}>
                      {channel.label}
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
          name="sendVia"
          render={() => (
            <FormItem>
              <FormLabel>Send Via</FormLabel>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {notificationChannels.map((channel) => (
                  <FormField
                    key={channel.value}
                    control={form.control}
                    name="sendVia"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(channel.value)}
                            onCheckedChange={(checked) => {
                              const updatedList = checked
                                ? [...field.value, channel.value]
                                : field.value.filter((val) => val !== channel.value);
                              field.onChange(updatedList);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {channel.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetRoles"
          render={() => (
            <FormItem>
              <FormLabel>Target Roles</FormLabel>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {targetRoles.map((role) => (
                  <FormField
                    key={role.value}
                    control={form.control}
                    name="targetRoles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.value)}
                            onCheckedChange={(checked) => {
                              const updatedList = checked
                                ? [...field.value, role.value]
                                : field.value.filter((val) => val !== role.value);
                              field.onChange(updatedList);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {role.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the message to send"
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                You can use {"{"}variables{"}"} like {"{"}name{"}"}, {"{"}date{"}"}, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Activate this rule
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {editRule ? 'Update Rule' : 'Create Rule'}
        </Button>
      </form>
    </Form>
  );
};

export default ReminderRuleForm;
