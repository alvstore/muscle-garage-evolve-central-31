
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

interface ReminderRuleFormProps {
  initialData?: Partial<ReminderRule>;
  onSave: (data: ReminderRule) => void;
  onCancel: () => void;
}

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ initialData, onSave, onCancel }) => {
  const form = useForm<Partial<ReminderRule>>({
    defaultValues: initialData || {
      id: '',
      title: '',
      description: '',
      triggerType: 'membership-expiry' as ReminderTriggerType,
      triggerValue: 7,
      message: '',
      sendVia: ['email'],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      enabled: true,
      targetRoles: ['member'],
      conditions: {},
      notificationChannel: 'email'
    }
  });

  const triggerTypeLabels: Record<ReminderTriggerType, string> = {
    'membership-expiry': 'Membership Expiry',
    'class-reminder': 'Class Reminder',
    'birthday': 'Birthday',
    'custom': 'Custom'
  };

  const handleSubmit = (data: Partial<ReminderRule>) => {
    onSave(data as ReminderRule);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit' : 'Create'} Reminder Rule</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Membership Renewal Reminder" />
                  </FormControl>
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
                    <Textarea {...field} placeholder="Describe the purpose of this reminder rule" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="triggerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trigger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(triggerTypeLabels) as ReminderTriggerType[]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {triggerTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="triggerValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Before</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} max={90} />
                  </FormControl>
                  <FormDescription>
                    How many days before the event should the notification be sent
                  </FormDescription>
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
                    <Textarea {...field} placeholder="Enter the message template" />
                  </FormControl>
                  <FormDescription>
                    You can use {"{name}"}, {"{date}"}, and {"{days}"} as placeholders
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Channels</h3>
              
              <FormField
                control={form.control}
                name="sendVia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('email')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'email'] 
                            : currentValues.filter(v => v !== 'email');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Email</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sendVia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('sms')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'sms'] 
                            : currentValues.filter(v => v !== 'sms');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">SMS</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sendVia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('whatsapp')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'whatsapp'] 
                            : currentValues.filter(v => v !== 'whatsapp');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">WhatsApp</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sendVia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('in-app')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'in-app'] 
                            : currentValues.filter(v => v !== 'in-app');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">In-App Notification</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Target Recipients</h3>
              
              <FormField
                control={form.control}
                name="targetRoles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('member')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'member'] 
                            : currentValues.filter(v => v !== 'member');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Members</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetRoles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('trainer')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'trainer'] 
                            : currentValues.filter(v => v !== 'trainer');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Trainers</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetRoles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('staff')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'staff'] 
                            : currentValues.filter(v => v !== 'staff');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Staff</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetRoles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value?.includes('admin')}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          const newValues = checked 
                            ? [...currentValues, 'admin'] 
                            : currentValues.filter(v => v !== 'admin');
                          field.onChange(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Administrators</FormLabel>
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
                      When enabled, this reminder will be sent automatically
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
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Save Rule</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReminderRuleForm;
