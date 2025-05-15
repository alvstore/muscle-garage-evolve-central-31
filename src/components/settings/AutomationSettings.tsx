
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useDisclosure } from "@/hooks/use-disclosure";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AutomationRule } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { getAutomationRules, saveAutomationRule, deleteAutomationRule } from '@/services/settingsService';
import { useBranch } from '@/hooks/use-branch';

const AutomationSettings = () => {
  const { currentBranch } = useBranch();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRule, setCurrentRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    trigger_type: 'attendance',
    trigger_value: 0,
    trigger_condition: {},
    actions: {},
    is_active: true
  });

  const ruleDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  
  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAutomationRules(currentBranch?.id);
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching automation rules:', error);
      toast.error('Failed to load automation rules');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentBranch?.id) {
      fetchRules();
    }
  }, [currentBranch?.id]);
  
  const handleCreateRule = () => {
    setCurrentRule({
      name: '',
      description: '',
      trigger_type: 'attendance',
      trigger_value: 0,
      trigger_condition: {},
      actions: {},
      is_active: true,
      branch_id: currentBranch?.id
    });
    ruleDialog.onOpen();
  };
  
  const handleEditRule = (rule: AutomationRule) => {
    setCurrentRule(rule);
    ruleDialog.onOpen();
  };
  
  const handleDeleteClick = (rule: AutomationRule) => {
    setCurrentRule(rule);
    deleteDialog.onOpen();
  };
  
  const handleDeleteConfirm = async () => {
    if (!currentRule.id) return;
    
    try {
      const { success, error } = await deleteAutomationRule(currentRule.id);
      if (!success) throw error;
      toast.success('Automation rule deleted successfully');
      fetchRules();
      deleteDialog.onClose();
    } catch (error) {
      console.error('Error deleting automation rule:', error);
      toast.error('Failed to delete automation rule');
    }
  };
  
  const handleSaveRule = async () => {
    try {
      if (!currentRule.name) {
        toast.error('Rule name is required');
        return;
      }
      
      const { success, error } = await saveAutomationRule({
        ...currentRule,
        branch_id: currentBranch?.id
      });
      
      if (!success) throw error;
      
      toast.success(`Automation rule ${currentRule.id ? 'updated' : 'created'} successfully`);
      ruleDialog.onClose();
      fetchRules();
    } catch (error) {
      console.error('Error saving automation rule:', error);
      toast.error('Failed to save automation rule');
    }
  };
  
  const handleToggleActive = async (rule: AutomationRule, active: boolean) => {
    try {
      const { success, error } = await saveAutomationRule({
        ...rule,
        is_active: active
      });
      
      if (!success) throw error;
      
      // Update local state
      setRules(rules.map(r => r.id === rule.id ? { ...r, is_active: active } : r));
      toast.success(`Rule ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling rule status:', error);
      toast.error('Failed to update rule status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Automation Rules</h2>
        <Button onClick={handleCreateRule}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Rule
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading automation rules...</p>
        </div>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No automation rules found</p>
            <Button onClick={handleCreateRule} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create your first rule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={!rule.is_active ? "opacity-60" : ""}>
              <CardHeader className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {rule.name}
                      {!rule.is_active && (
                        <Badge variant="outline" className="ml-2 text-muted-foreground">Inactive</Badge>
                      )}
                    </CardTitle>
                    {rule.description && (
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Actions <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(rule, !rule.is_active)}>
                          <Check className="mr-2 h-4 w-4" />
                          {rule.is_active ? 'Deactivate' : 'Activate'} Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(rule)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete Rule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Trigger</h3>
                    <p className="text-sm">
                      {getTriggerDescription(rule.trigger_type, rule.trigger_value, rule.trigger_condition)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Actions</h3>
                    <p className="text-sm">{getActionDescription(rule.actions)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Rule Edit/Create Dialog */}
      <Dialog open={ruleDialog.isOpen} onOpenChange={ruleDialog.onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentRule.id ? 'Edit Automation Rule' : 'Create Automation Rule'}</DialogTitle>
            <DialogDescription>
              {currentRule.id
                ? 'Update your automation rule details below.'
                : 'Configure a new automation rule to simplify your workflow.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                placeholder="E.g., Send welcome email to new members"
                value={currentRule.name || ''}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, name: e.target.value })
                }
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what this rule does"
                value={currentRule.description || ''}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, description: e.target.value })
                }
              />
            </div>
            
            <Separator className="my-2" />
            
            {/* Trigger configuration */}
            <div className="grid gap-2">
              <Label>Trigger</Label>
              {/* Add trigger type selection and configuration here */}
            </div>
            
            <Separator className="my-2" />
            
            {/* Actions configuration */}
            <div className="grid gap-2">
              <Label>Actions</Label>
              {/* Add action configuration here */}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={ruleDialog.onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveRule}>
              {currentRule.id ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Automation Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentRule.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={deleteDialog.onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper functions to generate human-readable descriptions
// Simplified for now - expand based on your trigger and action types
function getTriggerDescription(
  triggerType: string = '',
  triggerValue?: number,
  triggerCondition?: Record<string, any>
): string {
  switch (triggerType) {
    case 'attendance':
      return `When a member checks in`;
    case 'membership_expiry':
      return `When membership is about to expire in ${triggerValue || 7} days`;
    case 'inactive':
      return `When member has been inactive for ${triggerValue || 14} days`;
    default:
      return 'Custom trigger';
  }
}

function getActionDescription(actions?: Record<string, any>): string {
  if (!actions) return 'No actions configured';
  
  if (actions.send_notification) {
    return `Send a notification to the member`;
  }
  
  if (actions.send_email) {
    return `Send an email to the member`;
  }
  
  if (actions.assign_task) {
    return `Create a task for staff`;
  }
  
  return 'Multiple actions configured';
}

export default AutomationSettings;
