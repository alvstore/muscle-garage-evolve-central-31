
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useReminderRules } from '@/hooks/use-reminder-rules';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ReminderRule } from '@/types/notification';
import { useToast } from '@/components/ui/use-toast';

interface ReminderRulesListProps {
  onEdit?: (rule: ReminderRule) => void;
  onAdd?: () => void;
}

const ReminderRulesList = ({ onEdit, onAdd }: ReminderRulesListProps) => {
  const { reminderRules, isLoading, updateReminderRule, deleteReminderRule } = useReminderRules();
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (reminderRules) {
      setRules(reminderRules);
    }
  }, [reminderRules]);

  const toggleRuleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateReminderRule(id, { isActive: !currentStatus });
      toast({
        title: "Status updated",
        description: `Rule ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await deleteReminderRule(id);
      toast({
        title: "Rule deleted",
        description: "Reminder rule deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting rule",
        description: "Failed to delete reminder rule",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reminder Rules</CardTitle>
          <CardDescription>Configure automated reminders for various events</CardDescription>
        </div>
        <Button onClick={onAdd} size="sm" className="mt-0">
          <Plus className="mr-1 h-4 w-4" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Loading reminder rules...
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No reminder rules found. Click the button above to create one.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.title}</p>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="capitalize font-medium">{rule.triggerType.replace(/_/g, ' ')}</span>
                      {rule.triggerValue && (
                        <span className="text-sm text-gray-500">
                          Value: {rule.triggerValue}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.sendVia.map((channel, idx) => (
                        <Badge key={idx} variant="outline">
                          {channel}
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit && onEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete reminder rule</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this reminder rule? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRule(rule.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReminderRulesList;
