
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useBranch } from "@/hooks/use-branch";
import { 
  Select, SelectContent, 
  SelectItem, SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import settingsService from "@/services/settingsService";
import { AutomationRule } from "@/types/crm";

const AutomationSettings = () => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (currentBranch?.id) {
      loadRules();
    }
  }, [currentBranch?.id]);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const rules = await settingsService.getAutomationRules(currentBranch?.id);
      setAutomationRules(rules);
    } catch (error) {
      console.error("Failed to load automation rules:", error);
      toast.error("Failed to load automation rules");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRule = () => {
    setEditingRule({
      id: "",
      name: "New Rule",
      description: "",
      trigger_type: "membership_expiry",
      trigger_condition: { days: 7 },
      actions: [{ type: "notification", channel: "email", template_id: "" }],
      is_active: true,
    });
  };

  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule({ ...rule });
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const success = await settingsService.deleteAutomationRule(ruleId);
      if (success) {
        setAutomationRules((prev) => prev.filter((rule) => rule.id !== ruleId));
        toast.success("Automation rule deleted");
      } else {
        throw new Error("Failed to delete rule");
      }
    } catch (error) {
      console.error("Failed to delete rule:", error);
      toast.error("Failed to delete rule");
    }
  };

  const handleSaveRule = async () => {
    if (!editingRule) return;
    
    setIsSaving(true);
    try {
      // Make sure rule has all required properties
      const ruleToSave: AutomationRule = {
        trigger_condition: editingRule.trigger_condition,
        actions: editingRule.actions,
        id: editingRule.id || "",
        name: editingRule.name,
        is_active: editingRule.is_active !== undefined ? editingRule.is_active : true,
        description: editingRule.description,
        trigger_type: editingRule.trigger_type,
        branch_id: currentBranch?.id
      };
      
      const savedRule = await settingsService.saveAutomationRule(ruleToSave);
      
      if (savedRule) {
        if (editingRule.id) {
          // Update existing rule
          setAutomationRules(prev =>
            prev.map(rule => rule.id === savedRule.id ? savedRule : rule)
          );
        } else {
          // Add new rule
          setAutomationRules(prev => [...prev, savedRule]);
        }
        setEditingRule(null);
        toast.success("Automation rule saved successfully");
      } else {
        throw new Error("Failed to save rule");
      }
    } catch (error) {
      console.error("Failed to save rule:", error);
      toast.error("Failed to save automation rule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const updateEditingRule = (field: string, value: any) => {
    if (!editingRule) return;
    setEditingRule(prev => ({
      ...prev!,
      [field]: value,
    }));
  };

  const getTriggerDescription = (rule: AutomationRule): string => {
    switch (rule.trigger_type) {
      case "membership_expiry":
        return `${rule.trigger_condition?.days || 0} days before membership expires`;
      case "birthday":
        return `${rule.trigger_condition?.days || 0} days before member birthday`;
      case "inactivity":
        return `After ${rule.trigger_condition?.days || 0} days of inactivity`;
      case "new_member":
        return "When a new member joins";
      default:
        return "Unknown trigger";
    }
  };

  const getActionDescription = (rule: AutomationRule): string => {
    const actionTypes = rule.actions.map(action => {
      switch (action.type) {
        case "notification":
          return `Send ${action.channel} notification`;
        case "task":
          return "Create task for staff";
        default:
          return "Unknown action";
      }
    });

    return actionTypes.join(", ");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (editingRule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {editingRule.id ? "Edit Automation Rule" : "Create Automation Rule"}
          </CardTitle>
          <CardDescription>
            Configure when and how this automation should run
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={editingRule.name}
              onChange={(e) => updateEditingRule("name", e.target.value)}
              placeholder="Enter rule name"
            />
          </div>

          <div>
            <Label htmlFor="rule-description">Description (Optional)</Label>
            <Textarea
              id="rule-description"
              value={editingRule.description || ""}
              onChange={(e) => updateEditingRule("description", e.target.value)}
              placeholder="Describe what this rule does"
            />
          </div>

          <div>
            <Label htmlFor="trigger-type">Trigger</Label>
            <Select
              value={editingRule.trigger_type}
              onValueChange={(value) =>
                updateEditingRule("trigger_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="membership_expiry">
                  Membership Expiry
                </SelectItem>
                <SelectItem value="birthday">Member Birthday</SelectItem>
                <SelectItem value="inactivity">Member Inactivity</SelectItem>
                <SelectItem value="new_member">New Member Joined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(editingRule.trigger_type === "membership_expiry" ||
            editingRule.trigger_type === "birthday" ||
            editingRule.trigger_type === "inactivity") && (
            <div>
              <Label htmlFor="days-before">
                {editingRule.trigger_type === "inactivity"
                  ? "Days of inactivity"
                  : "Days before"}
              </Label>
              <Input
                id="days-before"
                type="number"
                value={editingRule.trigger_condition?.days || 0}
                onChange={(e) =>
                  updateEditingRule("trigger_condition", {
                    ...editingRule.trigger_condition,
                    days: parseInt(e.target.value),
                  })
                }
              />
            </div>
          )}

          <div className="space-y-4">
            <Label>Actions</Label>

            {editingRule.actions.map((action, index) => (
              <div key={index} className="border p-4 rounded-md space-y-3">
                <div>
                  <Label>Action Type</Label>
                  <Select
                    value={action.type}
                    onValueChange={(value) => {
                      const newActions = [...editingRule.actions];
                      newActions[index].type = value;
                      updateEditingRule("actions", newActions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">
                        Send Notification
                      </SelectItem>
                      <SelectItem value="task">
                        Create Task for Staff
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {action.type === "notification" && (
                  <>
                    <div>
                      <Label>Channel</Label>
                      <Select
                        value={action.channel || "email"}
                        onValueChange={(value) => {
                          const newActions = [...editingRule.actions];
                          newActions[index].channel = value;
                          updateEditingRule("actions", newActions);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="in_app">
                            In-app Notification
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Template selection would go here in a real implementation */}
                  </>
                )}

                {action.type === "task" && (
                  <>
                    <div>
                      <Label>Task Title</Label>
                      <Input
                        value={action.title || ""}
                        onChange={(e) => {
                          const newActions = [...editingRule.actions];
                          newActions[index].title = e.target.value;
                          updateEditingRule("actions", newActions);
                        }}
                        placeholder="Task title"
                      />
                    </div>
                    <div>
                      <Label>Assign To</Label>
                      <Select
                        value={action.assignRole || "manager"}
                        onValueChange={(value) => {
                          const newActions = [...editingRule.actions];
                          newActions[index].assignRole = value;
                          updateEditingRule("actions", newActions);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Branch Manager</SelectItem>
                          <SelectItem value="trainer">
                            Member's Trainer
                          </SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    const newActions = editingRule.actions.filter(
                      (_, i) => i !== index
                    );
                    updateEditingRule("actions", newActions);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Action
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => {
                updateEditingRule("actions", [
                  ...editingRule.actions,
                  {
                    type: "notification",
                    channel: "email",
                    template_id: "",
                  },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="is-active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this automation rule
              </p>
            </div>
            <Switch
              id="is-active"
              checked={editingRule.is_active}
              onCheckedChange={(checked) =>
                updateEditingRule("is_active", checked)
              }
            />
          </div>
        </CardContent>
        <div className="flex justify-end p-6 pt-0 gap-2">
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button onClick={handleSaveRule} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Rule"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure automated actions based on triggers
          </CardDescription>
        </div>
        <Button onClick={handleCreateRule}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </CardHeader>
      <CardContent>
        {automationRules.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              No automation rules configured yet
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={handleCreateRule}
            >
              Create your first automation rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-md p-4 ${
                  rule.is_active ? "" : "bg-muted/30 text-muted-foreground"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    {rule.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {!rule.is_active && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mr-2">
                        Disabled
                      </span>
                    )}
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-xs uppercase text-muted-foreground font-medium">
                      Trigger
                    </p>
                    <p className="text-sm mt-1">
                      {getTriggerDescription(rule)}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-xs uppercase text-muted-foreground font-medium">
                      Actions
                    </p>
                    <p className="text-sm mt-1">{getActionDescription(rule)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomationSettings;
