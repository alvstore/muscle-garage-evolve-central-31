
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ReminderRule, NotificationChannel } from '@/types';

interface ReminderRuleFormProps {
  rule?: ReminderRule;
  onSave: (rule: Partial<ReminderRule>) => Promise<void>;
  onCancel: () => void;
}

const triggerTypes = [
  { label: 'Membership Expiry', value: 'membership_expiry' },
  { label: 'Birthday', value: 'birthday' },
  { label: 'Missed Classes', value: 'missed_classes' },
  { label: 'Low Attendance', value: 'low_attendance' },
  { label: 'Payment Due', value: 'payment_due' },
  { label: 'Payment Overdue', value: 'payment_overdue' },
  { label: 'New Member Welcome', value: 'new_member' },
];

const targetRoles = [
  { label: 'Members', value: 'member' },
  { label: 'Staff', value: 'staff' },
  { label: 'Trainers', value: 'trainer' },
  { label: 'Admins', value: 'admin' },
];

const notificationChannels = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'App', value: 'app' },
  { label: 'WhatsApp', value: 'whatsapp' },
];

export default function ReminderRuleForm({ rule, onSave, onCancel }: ReminderRuleFormProps) {
  const [formData, setFormData] = useState<Partial<ReminderRule>>({
    title: '',
    description: '',
    trigger_type: 'membership_expiry',
    trigger_value: 7, // Default days before
    is_active: true,
    message: '',
    target_roles: ['member'],
    send_via: ['email'],
    conditions: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    }
  }, [rule]);

  const handleInputChange = (field: keyof ReminderRule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleTargetRole = (role: string) => {
    const currentRoles = [...(formData.target_roles || [])];
    const roleIndex = currentRoles.indexOf(role);
    
    if (roleIndex === -1) {
      currentRoles.push(role);
    } else {
      currentRoles.splice(roleIndex, 1);
    }
    
    handleInputChange('target_roles', currentRoles);
  };

  const handleToggleChannel = (channel: string) => {
    const currentChannels = [...(formData.send_via || [])];
    const channelIndex = currentChannels.indexOf(channel);
    
    if (channelIndex === -1) {
      currentChannels.push(channel);
    } else {
      currentChannels.splice(channelIndex, 1);
    }
    
    handleInputChange('send_via', currentChannels);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(`Reminder rule ${rule ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving reminder rule:', error);
      toast.error(`Failed to ${rule ? 'update' : 'create'} reminder rule`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rule ? 'Edit Reminder Rule' : 'Create New Reminder Rule'}</CardTitle>
        <CardDescription>
          Configure notification rules to automatically remind users about important events
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Rule Name</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive name for this rule"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this rule's purpose"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trigger_type">Trigger Event</Label>
              <Select
                value={formData.trigger_type}
                onValueChange={(value) => handleInputChange('trigger_type', value)}
              >
                <SelectTrigger id="trigger_type">
                  <SelectValue placeholder="Select trigger event" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trigger_value">
                {formData.trigger_type === 'membership_expiry' || 
                 formData.trigger_type === 'birthday' || 
                 formData.trigger_type === 'payment_due'
                  ? 'Days Before' 
                  : formData.trigger_type === 'missed_classes' || formData.trigger_type === 'low_attendance'
                    ? 'Threshold Count'
                    : 'Value'}
              </Label>
              <Input
                id="trigger_value"
                type="number"
                min={1}
                value={formData.trigger_value || ''}
                onChange={(e) => handleInputChange('trigger_value', parseInt(e.target.value, 10) || 0)}
                required
              />
              <p className="text-sm text-gray-500">
                {formData.trigger_type === 'membership_expiry' 
                  ? 'Number of days before membership expiry to send the reminder'
                  : formData.trigger_type === 'birthday'
                    ? 'Number of days before birthday to send the reminder'
                    : formData.trigger_type === 'missed_classes'
                      ? 'Number of consecutive classes missed to trigger the notification'
                      : formData.trigger_type === 'low_attendance'
                        ? 'Minimum attendance percentage threshold to trigger the notification'
                        : formData.trigger_type === 'payment_due'
                          ? 'Days before payment is due to send the reminder'
                          : formData.trigger_type === 'payment_overdue'
                            ? 'Days after payment is due to send the reminder'
                            : 'Configuration value for this trigger'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Target Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {targetRoles.map((role) => (
                  <div key={role.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.value}`}
                      checked={(formData.target_roles || []).includes(role.value)}
                      onCheckedChange={() => handleToggleTargetRole(role.value)}
                    />
                    <Label htmlFor={`role-${role.value}`} className="cursor-pointer">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Send Via</Label>
              <div className="grid grid-cols-2 gap-2">
                {notificationChannels.map((channel) => (
                  <div key={channel.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${channel.value}`}
                      checked={(formData.send_via || []).includes(channel.value)}
                      onCheckedChange={() => handleToggleChannel(channel.value)}
                    />
                    <Label htmlFor={`channel-${channel.value}`} className="cursor-pointer">
                      {channel.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.send_via && formData.send_via.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="notification_channel">Primary Notification Channel</Label>
                <Select
                  value={formData.notification_channel || (formData.send_via.length > 0 ? formData.send_via[0] : '')}
                  onValueChange={(value) => handleInputChange('notification_channel', value as NotificationChannel)}
                >
                  <SelectTrigger id="notification_channel">
                    <SelectValue placeholder="Select primary channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.send_via.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {notificationChannels.find(c => c.value === channel)?.label || channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="message">Message Template</Label>
              <Textarea
                id="message"
                placeholder="Enter the message content with optional variables like {{name}} or {{date}}"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500">
                Available variables: {{name}}, {{date}}, {{membership_end}}, {{class_date}}, {{amount_due}}, {{due_date}}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-gray-500 ml-2">
                Toggle on to enable this reminder rule
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : rule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
