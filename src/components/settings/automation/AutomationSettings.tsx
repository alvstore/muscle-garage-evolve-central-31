import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAutomations } from '@/hooks/use-automations';
import { useBranch } from '@/hooks/use-branches';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AutomationRule {
  id?: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: any;
  actions: any;
  is_active: boolean;
  branch_id?: string;
}

const AutomationSettings = () => {
  const { currentBranch } = useBranch();
  const { getAutomationRules, saveAutomationRule, deleteAutomationRule, isLoading: isLoadingAutomations } = useAutomations();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const fetchRules = async () => {
    if (!currentBranch?.id) return;
    
    const rules = await getAutomationRules(currentBranch.id);
    setAutomationRules(rules);
  };

  useEffect(() => {
    fetchRules();
  }, [currentBranch?.id]);

  const handleCreateRule = () => {
    setIsCreating(true);
    setEditingRule(null);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setIsEditing(true);
    setEditingRule(rule);
  };

  const handleDeleteRule = async (id: string) => {
    if (!id) return;
    
    const result = await deleteAutomationRule(id);
    if (result) {
      await fetchRules();
      toast.success('Automation rule deleted successfully');
    } else {
      toast.error('Failed to delete automation rule');
    }
  };

  const handleSaveRule = async (rule: AutomationRule) => {
    if (!currentBranch?.id) {
      toast.error('No branch selected');
      return;
    }
    
    const ruleToSave: AutomationRule = {
      ...rule,
      branch_id: currentBranch.id
    };
    
    const result = await saveAutomationRule(ruleToSave);
    if (result) {
      setIsCreating(false);
      setIsEditing(false);
      await fetchRules();
      toast.success('Automation rule saved successfully');
    } else {
      toast.error('Failed to save automation rule');
    }
  };

  const handleToggleRule = async (rule: AutomationRule) => {
    if (!rule.id) return;
    
    const updatedRule: AutomationRule = {
      ...rule,
      is_active: !rule.is_active
    };
    
    const result = await saveAutomationRule(updatedRule);
    if (result) {
      await fetchRules();
      toast.success(`Automation rule ${updatedRule.is_active ? 'enabled' : 'disabled'}`);
    } else {
      toast.error('Failed to update automation rule');
    }
  };

  if (isLoadingAutomations) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Configure automation rules for your gym</CardDescription>
        </div>
        <Button onClick={handleCreateRule}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {automationRules.length > 0 ? (
            <div className="divide-y">
              {automationRules.map((rule) => (
                <div key={rule.id} className="py-4">
                  <p>Rule placeholder</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No automation rules found. Create your first rule to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationSettings;
