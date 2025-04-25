
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Edit, MailIcon, MessagesSquare, PhoneCall, Trash2, Users } from 'lucide-react';
import { ReminderRule } from '@/types/notification';

interface ReminderRulesListProps {
  rules: ReminderRule[];
  isLoading: boolean;
  onEdit: (rule: ReminderRule) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const ReminderRulesList: React.FC<ReminderRulesListProps> = ({
  rules,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading reminder rules...</div>;
  }

  if (!rules || rules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Clock className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No reminder rules created yet</p>
          <p className="text-muted-foreground">Create your first rule to start automating reminders</p>
        </CardContent>
      </Card>
    );
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <MailIcon className="h-4 w-4" />;
      case 'sms':
        return <PhoneCall className="h-4 w-4" />;
      case 'in-app':
        return <MessagesSquare className="h-4 w-4" />;
      case 'whatsapp':
        return <MessagesSquare className="h-4 w-4" />;
      default:
        return <MessagesSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{rule.name || rule.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                </div>
                <Switch 
                  checked={rule.active || rule.isActive || false}
                  onCheckedChange={() => onToggleActive(rule.id, rule.active || rule.isActive || false)}
                />
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {rule.triggerType.replace(/_/g, ' ')} ({rule.triggerValue})
                </Badge>
                
                <Badge variant="outline" className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {rule.targetRoles.join(', ') || 'All roles'}
                </Badge>
                
                <div className="flex gap-1">
                  {(rule.sendVia || rule.channels || []).map(channel => (
                    <Badge key={channel} className="bg-gray-100 text-gray-800">
                      {getChannelIcon(channel)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(rule)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderRulesList;
