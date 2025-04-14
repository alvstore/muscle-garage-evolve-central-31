
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

export interface ReminderRuleFormProps {
  onComplete: () => void;
  editRule?: ReminderRule;
}

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ onComplete, editRule }) => {
  const [formData, setFormData] = useState<ReminderRule>(
    editRule || {
      id: '',
      name: '',
      description: '',
      triggerType: 'membership_expiry' as ReminderTriggerType,
      triggerValue: 3,
      message: '',
      sendVia: [] as NotificationChannel[],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Compatibility fields
      type: 'membership-renewal',
      triggerDays: 3,
      channels: [] as NotificationChannel[],
      targetRoles: [] as string[],
      enabled: true
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted with data:', formData);
    // Here you would typically send the data to your backend
    onComplete();
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriggerTypeChange = (value: ReminderTriggerType) => {
    setFormData((prev) => ({ ...prev, triggerType: value, type: mapTriggerTypeToType(value) }));
  };

  const mapTriggerTypeToType = (triggerType: ReminderTriggerType): string => {
    const typeMap: Record<ReminderTriggerType, string> = {
      membership_expiry: 'membership-renewal',
      missed_attendance: 'missed-attendance',
      birthday: 'birthday',
      inactive_member: 'inactive-member',
      special_event: 'special-event'
    };
    return typeMap[triggerType];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editRule ? 'Edit Reminder Rule' : 'Create New Reminder Rule'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter a name for this reminder rule"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of this reminder's purpose"
                required
              />
            </div>

            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <Select 
                value={formData.triggerType} 
                onValueChange={handleTriggerTypeChange}
              >
                <SelectTrigger id="triggerType">
                  <SelectValue placeholder="Select when to trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership_expiry">Membership Expiry</SelectItem>
                  <SelectItem value="missed_attendance">Attendance Reminder</SelectItem>
                  <SelectItem value="birthday">Birthday Wishes</SelectItem>
                  <SelectItem value="inactive_member">Inactive Member</SelectItem>
                  <SelectItem value="special_event">Special Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="triggerValue">Days In Advance</Label>
              <Input
                id="triggerValue"
                type="number"
                min="0"
                value={formData.triggerValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  handleChange('triggerValue', value);
                  handleChange('triggerDays', value); // For compatibility
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message Template</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Enter the message to be sent. Use {name} for the member's name."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendEmail" 
                    checked={formData.sendVia.includes('email')}
                    onCheckedChange={(checked) => {
                      const newSendVia = checked 
                        ? [...formData.sendVia, 'email' as NotificationChannel] 
                        : formData.sendVia.filter(channel => channel !== 'email');
                      handleChange('sendVia', newSendVia);
                      handleChange('channels', newSendVia); // For compatibility
                    }}
                  />
                  <Label htmlFor="sendEmail" className="cursor-pointer">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendSMS" 
                    checked={formData.sendVia.includes('sms')}
                    onCheckedChange={(checked) => {
                      const newSendVia = checked 
                        ? [...formData.sendVia, 'sms' as NotificationChannel] 
                        : formData.sendVia.filter(channel => channel !== 'sms');
                      handleChange('sendVia', newSendVia);
                      handleChange('channels', newSendVia); // For compatibility
                    }}
                  />
                  <Label htmlFor="sendSMS" className="cursor-pointer">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendInApp" 
                    checked={formData.sendVia.includes('in-app')}
                    onCheckedChange={(checked) => {
                      const newSendVia = checked 
                        ? [...formData.sendVia, 'in-app' as NotificationChannel] 
                        : formData.sendVia.filter(channel => channel !== 'in-app');
                      handleChange('sendVia', newSendVia);
                      handleChange('channels', newSendVia); // For compatibility
                    }}
                  />
                  <Label htmlFor="sendInApp" className="cursor-pointer">In-App Notification</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendWhatsapp" 
                    checked={formData.sendVia.includes('whatsapp')}
                    onCheckedChange={(checked) => {
                      const newSendVia = checked 
                        ? [...formData.sendVia, 'whatsapp' as NotificationChannel] 
                        : formData.sendVia.filter(channel => channel !== 'whatsapp');
                      handleChange('sendVia', newSendVia);
                      handleChange('channels', newSendVia); // For compatibility
                    }}
                  />
                  <Label htmlFor="sendWhatsapp" className="cursor-pointer">WhatsApp</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="targetAdmins" 
                    checked={formData.targetRoles?.includes('admin')}
                    onCheckedChange={(checked) => {
                      const newTargetRoles = checked 
                        ? [...(formData.targetRoles || []), 'admin'] 
                        : (formData.targetRoles || []).filter(role => role !== 'admin');
                      handleChange('targetRoles', newTargetRoles);
                    }}
                  />
                  <Label htmlFor="targetAdmins" className="cursor-pointer">Admins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="targetStaff" 
                    checked={formData.targetRoles?.includes('staff')}
                    onCheckedChange={(checked) => {
                      const newTargetRoles = checked 
                        ? [...(formData.targetRoles || []), 'staff'] 
                        : (formData.targetRoles || []).filter(role => role !== 'staff');
                      handleChange('targetRoles', newTargetRoles);
                    }}
                  />
                  <Label htmlFor="targetStaff" className="cursor-pointer">Staff</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="targetTrainers" 
                    checked={formData.targetRoles?.includes('trainer')}
                    onCheckedChange={(checked) => {
                      const newTargetRoles = checked 
                        ? [...(formData.targetRoles || []), 'trainer'] 
                        : (formData.targetRoles || []).filter(role => role !== 'trainer');
                      handleChange('targetRoles', newTargetRoles);
                    }}
                  />
                  <Label htmlFor="targetTrainers" className="cursor-pointer">Trainers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="targetMembers" 
                    checked={formData.targetRoles?.includes('member')}
                    onCheckedChange={(checked) => {
                      const newTargetRoles = checked 
                        ? [...(formData.targetRoles || []), 'member'] 
                        : (formData.targetRoles || []).filter(role => role !== 'member');
                      handleChange('targetRoles', newTargetRoles);
                    }}
                  />
                  <Label htmlFor="targetMembers" className="cursor-pointer">Members</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={formData.active}
                onCheckedChange={(checked) => {
                  handleChange('active', checked);
                  handleChange('enabled', checked); // For compatibility
                }}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onComplete}>Cancel</Button>
          <Button type="submit">
            {editRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReminderRuleForm;
