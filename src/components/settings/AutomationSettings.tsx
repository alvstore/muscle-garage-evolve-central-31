
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAutomationRules } from '@/hooks/use-automation-rules';
import { AutomationRule } from '@/types/crm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AutomationSettings = () => {
  const {
    automationRules,
    isLoading,
    error,
    toggleAutomationRule,
    deleteAutomationRule
  } = useAutomationRules();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  
  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };
  
  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsDialogOpen(true);
  };
  
  const handleToggleRule = async (id: string, currentStatus: boolean) => {
    await toggleAutomationRule(id, !currentStatus);
  };
  
  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      await deleteAutomationRule(id);
    }
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRule(null);
  };
  
  const renderTriggerDescription = (rule: AutomationRule) => {
    switch (rule.trigger_type) {
      case 'lead_created':
        return 'When a new lead is created';
      case 'lead_status_changed':
        return `When lead status changes to "${rule.trigger_condition.status}"`;
      case 'membership_expiry':
        return `${rule.trigger_condition.days} days before membership expires`;
      case 'birthday':
        return 'On member birthday';
      case 'attendance_marked':
        return 'When a member checks in';
      case 'missed_class':
        return 'When a member misses a booked class';
      default:
        return rule.trigger_type;
    }
  };
  
  const renderActionDescription = (rule: AutomationRule) => {
    const actionCount = rule.actions.length;
    if (actionCount === 0) return 'No actions';
    
    const firstAction = rule.actions[0];
    let actionDescription = '';
    
    switch (firstAction.type) {
      case 'send_email':
        actionDescription = 'Send email';
        break;
      case 'send_sms':
        actionDescription = 'Send SMS';
        break;
      case 'create_task':
        actionDescription = 'Create task';
        break;
      case 'update_lead':
        actionDescription = 'Update lead status';
        break;
      default:
        actionDescription = firstAction.type;
    }
    
    return actionCount > 1 ? `${actionDescription} + ${actionCount - 1} more` : actionDescription;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Configure automated actions based on triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">Loading automation rules...</div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Configure automated actions based on triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Configure automated actions based on triggers</CardDescription>
        </div>
        <Button onClick={handleCreateRule}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </CardHeader>
      <CardContent>
        {automationRules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No automation rules found. Create your first rule to automate tasks.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{renderTriggerDescription(rule)}</TableCell>
                    <TableCell>{renderActionDescription(rule)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={() => handleToggleRule(rule.id, rule.is_active)}
                        />
                        <Badge variant={rule.is_active ? "default" : "outline"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedRule ? 'Edit Automation Rule' : 'Create Automation Rule'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Automation rule form will go here</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button>Save Rule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AutomationSettings;
