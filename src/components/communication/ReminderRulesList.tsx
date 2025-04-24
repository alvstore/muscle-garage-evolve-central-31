
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BellRing, Calendar, Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ReminderRule } from '@/types/notification';
import { supabase } from '@/services/supabaseClient';

interface ReminderRulesListProps {
  onAddRule: () => void;
  onEditRule: (rule: ReminderRule) => void;
}

const ReminderRulesList = ({ onAddRule, onEditRule }: ReminderRulesListProps) => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReminderRules();
  }, []);

  const fetchReminderRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const mappedRules: ReminderRule[] = data.map(rule => ({
        id: rule.id,
        title: rule.title,
        description: rule.description,
        triggerType: rule.trigger_type as any,
        notificationChannel: rule.notification_channel,
        conditions: rule.conditions,
        isActive: rule.is_active,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
        name: rule.title,
        triggerValue: rule.trigger_value,
        message: rule.message,
        sendVia: rule.send_via,
        targetRoles: rule.target_roles,
        active: rule.is_active,
        enabled: rule.is_active,
        channels: rule.send_via
      }));
      
      setRules(mappedRules);
    } catch (error) {
      console.error('Error fetching reminder rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, newState: boolean) => {
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .update({ is_active: newState })
        .eq('id', id);
        
      if (error) throw error;
      
      setRules(prevRules =>
        prevRules.map(rule =>
          rule.id === id ? { ...rule, active: newState, isActive: newState, enabled: newState } : rule
        )
      );
    } catch (error) {
      console.error('Error updating reminder rule:', error);
    }
  };

  const filteredRules = rules.filter(rule => {
    if (filter === 'all') return true;
    if (filter === 'active') return rule.active;
    if (filter === 'inactive') return !rule.active;
    return true;
  });
  
  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'membership-expiry':
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'class-reminder':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'birthday':
        return <Gift className="h-4 w-4 text-pink-500" />;
      default:
        return <BellRing className="h-4 w-4 text-purple-500" />;
    }
  };
  
  const getTriggerDescription = (rule: ReminderRule) => {
    const triggerType = rule.triggerType;
    const triggerValue = rule.triggerValue;
    
    switch (triggerType) {
      case 'membership-expiry':
        return `${triggerValue} days before expiry`;
      case 'class-reminder':
        return `${triggerValue} hours before class`;
      case 'birthday':
        return `${triggerValue} days before birthday`;
      default:
        return `${triggerValue} days before ${triggerType}`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reminder Rules</CardTitle>
        <div className="space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Rules</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={onAddRule}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-56">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center space-y-2">
            <BellRing className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium text-lg">No reminder rules found</h3>
            <p className="text-muted-foreground">Create your first reminder rule to start sending notifications</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="font-medium">{rule.title}</div>
                    {rule.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {rule.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTriggerIcon(rule.triggerType)}
                      <span>{getTriggerDescription(rule)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.targetRoles?.map((role) => (
                        <Badge key={role} variant="outline" className="capitalize">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.sendVia?.map((channel) => (
                        <Badge key={channel} variant="secondary" className="capitalize">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {rule.active ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-500" />
                      )}
                      <Switch
                        checked={rule.active}
                        onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => onEditRule(rule)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderRulesList;
