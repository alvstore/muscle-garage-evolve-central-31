
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { useReminderRules } from '@/hooks/use-reminder-rules';

interface ReminderRulesListProps {
  onEdit?: (rule: any) => void;
}

const ReminderRulesList: React.FC<ReminderRulesListProps> = ({ onEdit }) => {
  const { reminderRules, isLoading, fetchReminderRules, toggleRuleStatus, deleteReminderRule } = useReminderRules();

  useEffect(() => {
    fetchReminderRules();
  }, [fetchReminderRules]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading reminder rules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder Rules</CardTitle>
      </CardHeader>
      
      <CardContent>
        {reminderRules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Target Roles</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {reminderRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.triggerType.replace('_', ' ')}</Badge>
                    {rule.triggerValue && (
                      <span className="ml-2 text-xs">
                        ({rule.triggerValue} days)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.sendVia.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.targetRoles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRuleStatus(rule.id, rule.isActive)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1" onClick={() => onEdit && onEdit(rule)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => deleteReminderRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4">No reminder rules found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderRulesList;
