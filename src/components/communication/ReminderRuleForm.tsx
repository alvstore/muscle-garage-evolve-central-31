import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WHATSAPP = 'whatsapp'
}

export enum MotivationalCategory {
  GENERAL = 'general',
  FITNESS = 'fitness',
  NUTRITION = 'nutrition',
  WELLNESS = 'wellness',
  SUCCESS = 'success'
}

export interface ReminderRule {
  id?: string;
  name: string;
  description?: string;
  event_type: string;
  days_before: number;
  is_active: boolean;
  channels: NotificationChannel[];
  message_template?: string;
  subject_template?: string;
  include_motivational_quote?: boolean;
  motivational_category?: MotivationalCategory;
}

interface ReminderRuleFormProps {
  rule?: ReminderRule;
  onSave: (rule: ReminderRule) => Promise<void>;
  onCancel: () => void;
}

const eventTypes = [
  { value: 'membership_expiry', label: 'Membership Expiry' },
  { value: 'class_reminder', label: 'Class Reminder' },
  { value: 'payment_due', label: 'Payment Due' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'inactivity', label: 'Member Inactivity' },
];

const availableVariables = [
  { key: 'name', description: 'Member name' },
  { key: 'date', description: 'Current date' },
  { key: 'membership_end', description: 'Membership end date' },
  { key: 'class_date', description: 'Class date and time' },
  { key: 'amount_due', description: 'Amount due on invoice' },
  { key: 'due_date', description: 'Invoice due date' }
];

const ReminderRuleForm: React.FC<ReminderRuleFormProps> = ({ rule, onSave, onCancel }) => {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [eventType, setEventType] = useState(rule?.event_type || 'membership_expiry');
  const [daysBefore, setDaysBefore] = useState(rule?.days_before?.toString() || '7');
  const [isActive, setIsActive] = useState(rule?.is_active ?? true);
  const [channels, setChannels] = useState<NotificationChannel[]>(rule?.channels || [NotificationChannel.EMAIL]);
  const [messageTemplate, setMessageTemplate] = useState(rule?.message_template || '');
  const [subjectTemplate, setSubjectTemplate] = useState(rule?.subject_template || '');
  const [includeMotivationalQuote, setIncludeMotivationalQuote] = useState(rule?.include_motivational_quote ?? false);
  const [motivationalCategory, setMotivationalCategory] = useState<MotivationalCategory>(
    rule?.motivational_category || MotivationalCategory.GENERAL
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set default subject based on event type
    if (!rule && !subjectTemplate) {
      switch (eventType) {
        case 'membership_expiry':
          setSubjectTemplate('Your membership is expiring soon');
          break;
        case 'class_reminder':
          setSubjectTemplate('Reminder: Your upcoming class');
          break;
        case 'payment_due':
          setSubjectTemplate('Payment reminder');
          break;
        case 'birthday':
          setSubjectTemplate('Happy Birthday from {gym_name}!');
          break;
        case 'inactivity':
          setSubjectTemplate('We miss you at {gym_name}');
          break;
      }
    }
  }, [eventType, rule, subjectTemplate]);

  const handleChannelSelection = (channel: string, isSelected: boolean) => {
    const notificationChannel = channel as NotificationChannel;
    
    if (isSelected) {
      setChannels([...channels, notificationChannel]);
    } else {
      setChannels(channels.filter(c => c !== notificationChannel));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a rule name');
      return;
    }
    
    if (channels.length === 0) {
      toast.error('Please select at least one notification channel');
      return;
    }
    
    if (!messageTemplate.trim()) {
      toast.error('Please enter a message template');
      return;
    }
    
    if (channels.includes(NotificationChannel.EMAIL) && !subjectTemplate.trim()) {
      toast.error('Please enter a subject template for email notifications');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const ruleData: ReminderRule = {
        id: rule?.id,
        name,
        description,
        event_type: eventType,
        days_before: parseInt(daysBefore, 10),
        is_active: isActive,
        channels,
        message_template: messageTemplate,
        subject_template: subjectTemplate,
        include_motivational_quote: includeMotivationalQuote,
        motivational_category: includeMotivationalQuote ? motivationalCategory : undefined
      };
      
      await onSave(ruleData);
      toast.success(`Reminder rule ${rule ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving reminder rule:', error);
      toast.error(`Failed to ${rule ? 'update' : 'create'} reminder rule`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{rule ? 'Edit Reminder Rule' : 'Create Reminder Rule'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Membership Expiry Reminder" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of this reminder rule" 
              rows={2} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days-before">Days Before Event</Label>
              <Input 
                id="days-before" 
                type="number" 
                min="0" 
                max="365" 
                value={daysBefore} 
                onChange={(e) => setDaysBefore(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notification Channels</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="channel-email" 
                  checked={channels.includes(NotificationChannel.EMAIL)} 
                  onCheckedChange={(checked) => handleChannelSelection(NotificationChannel.EMAIL, !!checked)} 
                />
                <Label htmlFor="channel-email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="channel-sms" 
                  checked={channels.includes(NotificationChannel.SMS)} 
                  onCheckedChange={(checked) => handleChannelSelection(NotificationChannel.SMS, !!checked)} 
                />
                <Label htmlFor="channel-sms">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="channel-push" 
                  checked={channels.includes(NotificationChannel.PUSH)} 
                  onCheckedChange={(checked) => handleChannelSelection(NotificationChannel.PUSH, !!checked)} 
                />
                <Label htmlFor="channel-push">Push Notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="channel-whatsapp" 
                  checked={channels.includes(NotificationChannel.WHATSAPP)} 
                  onCheckedChange={(checked) => handleChannelSelection(NotificationChannel.WHATSAPP, !!checked)} 
                />
                <Label htmlFor="channel-whatsapp">WhatsApp</Label>
              </div>
            </div>
          </div>
          
          {channels.includes(NotificationChannel.EMAIL) && (
            <div className="space-y-2">
              <Label htmlFor="subject-template">Email Subject Template</Label>
              <Input 
                id="subject-template" 
                value={subjectTemplate} 
                onChange={(e) => setSubjectTemplate(e.target.value)} 
                placeholder="e.g., Your membership expires in {days} days" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message-template">Message Template</Label>
            <Textarea 
              id="message-template" 
              value={messageTemplate} 
              onChange={(e) => setMessageTemplate(e.target.value)} 
              placeholder="e.g., Hello {name}, your membership will expire on {membership_end}. Please renew to continue enjoying our services." 
              rows={4} 
            />
            <p className="text-sm text-muted-foreground">Available variables:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableVariables.map((variable) => (
                <div 
                  key={variable.key} 
                  className="flex items-center gap-1 text-xs bg-secondary/30 p-1 px-2 rounded"
                >
                  <code>{`{${variable.key}}`}</code>
                  <span className="text-muted-foreground">- {variable.description}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="include-quote" 
                checked={includeMotivationalQuote} 
                onCheckedChange={setIncludeMotivationalQuote} 
              />
              <Label htmlFor="include-quote">Include Motivational Quote</Label>
            </div>
            
            {includeMotivationalQuote && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="quote-category">Quote Category</Label>
                <Select value={motivationalCategory} onValueChange={(value) => setMotivationalCategory(value as MotivationalCategory)}>
                  <SelectTrigger id="quote-category">
                    <SelectValue placeholder="Select quote category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MotivationalCategory.GENERAL}>General</SelectItem>
                    <SelectItem value={MotivationalCategory.FITNESS}>Fitness</SelectItem>
                    <SelectItem value={MotivationalCategory.NUTRITION}>Nutrition</SelectItem>
                    <SelectItem value={MotivationalCategory.WELLNESS}>Wellness</SelectItem>
                    <SelectItem value={MotivationalCategory.SUCCESS}>Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is-active" 
              checked={isActive} 
              onCheckedChange={setIsActive} 
            />
            <Label htmlFor="is-active">Active</Label>
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
};

export default ReminderRuleForm;
