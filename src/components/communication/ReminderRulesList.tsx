
import React from 'react';
import { ReminderRule } from '@/types/notification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ReminderRulesListProps {
  onEdit: (rule: ReminderRule) => void;
}

const ReminderRulesList: React.FC<ReminderRulesListProps> = ({ onEdit }) => {
  // Mock data for reminder rules
  const mockRules: ReminderRule[] = [
    {
      id: '1',
      name: 'Membership Expiry Reminder',
      triggerType: 'membership_expiry',
      triggerValue: 7,
      message: 'Your membership will expire in 7 days. Please renew to continue enjoying your benefits.',
      channels: ['email', 'sms'],
      isActive: true,
      targetRoles: ['member'],
    },
    {
      id: '2',
      name: 'Birthday Greeting',
      triggerType: 'birthday',
      triggerValue: 0,
      message: 'Happy Birthday! As a special gift, enjoy a 10% discount on your next renewal.',
      channels: ['email', 'whatsapp'],
      isActive: true,
      targetRoles: ['member'],
    },
    {
      id: '3',
      name: 'Missed Classes Alert',
      triggerType: 'missed_classes',
      triggerValue: 3,
      message: 'We noticed you\'ve missed 3 consecutive classes. Is everything okay?',
      channels: ['in-app', 'sms'],
      isActive: false,
      targetRoles: ['member'],
    },
  ];

  return (
    <div className="space-y-4">
      {mockRules.map((rule) => (
        <Card key={rule.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{rule.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
                <Switch checked={rule.isActive} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Trigger:</strong> {rule.triggerType.replace('_', ' ')} {rule.triggerValue} days</p>
                <p><strong>Message:</strong> {rule.message}</p>
              </div>
              <div>
                <p><strong>Channels:</strong> {rule.channels.join(', ')}</p>
                <p><strong>Targets:</strong> {rule.targetRoles.join(', ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReminderRulesList;
