
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

interface ReminderRuleFormProps {
  initialValues?: Partial<ReminderRule>;
  onSubmit: (data: Partial<ReminderRule>) => void;
  onCancel: () => void;
}

// Define a proper schema for the form
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  triggerType: z.enum(['membership_expiry', 'birthday', 'class_reminder', 'payment_due', 'attendance_missed', 'membership_renewal', 'goal_achieved', 'follow_up']),
  triggerValue: z.number().optional(),
  notificationChannel: z.enum(['email', 'sms', 'whatsapp', 'app', 'push']),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
  sendVia: z.array(z.string()).min(1, { message: "Select at least one channel" }),
  targetRoles: z.array(z.string()).min(1, { message: "Select at least one user role" }),
  isActive: z.boolean().default(true),
});

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [advancedMode, setAdvancedMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      triggerType: initialValues?.triggerType || 'membership_expiry',
      triggerValue: initialValues?.triggerValue || 7,
      notificationChannel: initialValues?.notificationChannel || 'email',
      message: initialValues?.message || '',
      sendVia: initialValues?.sendVia || ['email'],
      targetRoles: initialValues?.targetRoles || ['member'],
      isActive: initialValues?.isActive !== undefined ? initialValues.isActive : true,
    },
  });

  const triggerLabels: Record<ReminderTriggerType, string> = {
    'membership_expiry': 'Membership Expiry',
    'birthday': 'Member Birthday',
    'class_reminder': 'Class Reminder',
    'payment_due': 'Payment Due',
    'attendance_missed': 'Attendance Missed',
    'membership_renewal': 'Membership Renewal',
    'goal_achieved': 'Goal Achieved',
    'follow_up': 'Follow-up'
  };

  const channelLabels: Record<NotificationChannel, string> = {
    'email': 'Email',
    'sms': 'SMS',
    'whatsapp': 'WhatsApp',
    'app': 'In-App',
    'push': 'Push Notification'
  };

  const selectedTriggerType = form.watch('triggerType');
  const showTriggerValue = ['membership_expiry', 'payment_due', 'class_reminder'].includes(selectedTriggerType);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      conditions: initialValues?.conditions || {}
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialValues ? 'Edit Reminder Rule' : 'Create New Reminder Rule'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for this reminder rule" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description to help identify this rule"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trigger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(triggerLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showTriggerValue && (
              <FormField
                control={form.control}
                name="triggerValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedTriggerType === 'membership_expiry' && 'Days Before Expiry'}
                      {selectedTriggerType === 'payment_due' && 'Days Before Due Date'}
                      {selectedTriggerType === 'class_reminder' && 'Hours Before Class'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the message to be sent"
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can use variables like {'{member_name}'}, {'{date}'}, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationChannel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Notification Channel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(channelLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
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
                  <div className="mb-4">
                    <FormLabel className="text-base">Send Via</FormLabel>
                    <FormDescription>
                      Select notification channels to use
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(channelLabels).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name="sendVia"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={key}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(key)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, key]
                                      : field.value?.filter((value) => value !== key);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {label}
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
              name="targetRoles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Target Roles</FormLabel>
                    <FormDescription>
                      Select user roles to receive this notification
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['admin', 'manager', 'trainer', 'staff', 'member'].map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="targetRoles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, role]
                                      : field.value?.filter((value) => value !== role);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer capitalize">
                                {role}
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div>
                    <FormLabel>Active</FormLabel>
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

            <CardFooter className="flex justify-between px-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialValues ? 'Update Rule' : 'Create Rule'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReminderRuleForm;
