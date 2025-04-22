
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

interface ReminderRuleFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (rule: ReminderRule) => void;
  onUpdate: (rule: ReminderRule) => void;
  selectedRule?: ReminderRule;
}

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ open, setOpen, onSave, onUpdate, selectedRule }) => {
  const [isSaving, setIsSaving] = useState(false);

  const triggerTypeOptions: Record<ReminderTriggerType, string> = {
    membership_expiry: 'Membership Expiry',
    missed_classes: 'Missed Classes',
    birthday: 'Birthday',
    payment_due: 'Payment Due',
    missed_attendance: 'Missed Attendance',
    inactive_member: 'Inactive Member'
  };

  const channelOptions: Record<NotificationChannel, string> = {
    'in-app': 'In-App Notification',
    email: 'Email',
    sms: 'SMS',
    whatsapp: 'WhatsApp'
  };

  const [formData, setFormData] = useState<ReminderRule>({
    id: selectedRule?.id || uuidv4(),
    name: selectedRule?.name || '',
    description: selectedRule?.description || '',
    triggerType: selectedRule?.triggerType || 'membership_expiry',
    triggerValue: selectedRule?.triggerValue || 7,
    message: selectedRule?.message || '',
    sendVia: selectedRule?.sendVia || ['in-app'],
    channels: selectedRule?.channels || ['in-app'],
    targetRoles: selectedRule?.targetRoles || ['member'],
    isActive: selectedRule?.isActive ?? true
  });

  useEffect(() => {
    if (selectedRule) {
      setFormData({
        id: selectedRule.id,
        name: selectedRule.name,
        description: selectedRule.description || '',
        triggerType: selectedRule.triggerType,
        triggerValue: selectedRule.triggerValue,
        message: selectedRule.message,
        sendVia: selectedRule.sendVia || ['in-app'],
        channels: selectedRule.channels,
        targetRoles: selectedRule.targetRoles || ['member'],
        isActive: selectedRule.isActive
      });
    } else {
      // Reset to default values when creating a new rule
      setFormData({
        id: uuidv4(),
        name: '',
        description: '',
        triggerType: 'membership_expiry',
        triggerValue: 7,
        message: '',
        sendVia: ['in-app'],
        channels: ['in-app'],
        targetRoles: ['member'],
        isActive: true
      });
    }
  }, [selectedRule]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!formData.name || !formData.message) {
        toast.error('Please fill in all required fields.');
        return;
      }

      if (selectedRule) {
        // Update existing rule
        onUpdate(formData);
        toast.success('Reminder rule updated successfully!');
      } else {
        // Save new rule
        onSave(formData);
        toast.success('Reminder rule created successfully!');
      }
      setOpen(false);
    } catch (error: any) {
      console.error('Error saving reminder rule:', error);
      toast.error(error?.message || 'Failed to save reminder rule.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to handle multi-select channels
  const handleChannelsChange = (value: string) => {
    // Parse the string value to NotificationChannel array
    const channels = value.split(',') as NotificationChannel[];
    setFormData({ ...formData, channels });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedRule ? 'Edit Reminder Rule' : 'Create Reminder Rule'}</DialogTitle>
          <DialogDescription>
            {selectedRule
              ? 'Update the settings for your reminder rule.'
              : 'Create a new automated reminder rule.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Name</Label>
              <Input
                id="ruleName"
                placeholder="Rule Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruleTrigger">Trigger</Label>
              <Select value={formData.triggerType} onValueChange={(value) => setFormData({ ...formData, triggerType: value as ReminderTriggerType })}>
                <SelectTrigger id="ruleTrigger">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(triggerTypeOptions).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleValue">Trigger Value (Days)</Label>
              <Input
                id="ruleValue"
                type="number"
                placeholder="Days"
                value={formData.triggerValue?.toString()}
                onChange={(e) => setFormData({ ...formData, triggerValue: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruleChannels">Channels</Label>
              <Select 
                value={formData.channels.join(',')} 
                onValueChange={handleChannelsChange}
              >
                <SelectTrigger id="ruleChannels">
                  <SelectValue placeholder="Select channels" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(channelOptions).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruleMessage">Message</Label>
            <Textarea
              id="ruleMessage"
              placeholder="Reminder Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruleDescription">Description</Label>
            <Textarea
              id="ruleDescription"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2 flex items-center">
              <Label htmlFor="ruleActive">Active</Label>
              <Switch 
                id="ruleActive" 
                checked={formData.isActive} 
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderRuleForm;
