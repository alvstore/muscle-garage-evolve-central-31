
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useAutomationRules, AutomationRule } from "@/hooks/use-automation-rules";
import { toast } from "sonner";

interface AutomationSettingsProps {
  branchId?: string | null;
}

const AutomationSettings: React.FC<AutomationSettingsProps> = ({ branchId = null }) => {
  const [activeTab, setActiveTab] = useState<string>("memberRules");
  const { rules, isLoading, isSaving, saveRule, deleteRule, toggleRuleStatus } = useAutomationRules(branchId);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const membershipRules = rules.filter(rule => rule.trigger_type.startsWith('membership'));
  const leadRules = rules.filter(rule => rule.trigger_type.startsWith('lead'));
  const attendanceRules = rules.filter(rule => rule.trigger_type.startsWith('attendance'));
  const paymentRules = rules.filter(rule => rule.trigger_type.startsWith('payment'));

  const triggerOptions = {
    memberRules: [
      { value: 'membership_created', label: 'When membership is created' },
      { value: 'membership_expires', label: 'When membership expires' },
      { value: 'membership_renewed', label: 'When membership is renewed' }
    ],
    leadRules: [
      { value: 'lead_created', label: 'When lead is created' },
      { value: 'lead_stage_changed', label: 'When lead stage changes' }
    ],
    attendanceRules: [
      { value: 'attendance_recorded', label: 'When attendance is recorded' },
      { value: 'missed_attendance', label: 'When member misses classes' }
    ],
    paymentRules: [
      { value: 'payment_completed', label: 'When payment is completed' },
      { value: 'payment_failed', label: 'When payment fails' },
      { value: 'invoice_created', label: 'When invoice is created' }
    ]
  };

  const actionOptions = [
    { value: 'send_email', label: 'Send Email' },
    { value: 'send_sms', label: 'Send SMS' },
    { value: 'send_whatsapp', label: 'Send WhatsApp' },
    { value: 'create_notification', label: 'Create Notification' },
    { value: 'create_invoice', label: 'Create Invoice' },
    { value: 'update_member', label: 'Update Member Status' }
  ];

  const addNewRule = () => {
    const newRule: AutomationRule = {
      name: '',
      trigger_type: '',
      trigger_condition: {},
      actions: [{ type: 'send_email', config: {} }],
      is_active: true,
      target_roles: [],
      send_via: []
    };
    setEditingRule(newRule);
    setIsEditing(true);
  };

  const editRule = (rule: AutomationRule) => {
    setEditingRule({ ...rule });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingRule(null);
    setIsEditing(false);
  };

  const handleSaveRule = async () => {
    if (!editingRule?.name) {
      toast.error("Rule name is required");
      return;
    }

    if (!editingRule.trigger_type) {
      toast.error("Trigger type is required");
      return;
    }

    const success = await saveRule(editingRule);
    if (success) {
      setIsEditing(false);
      setEditingRule(null);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      await deleteRule(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleRuleStatus(id, !currentStatus);
  };

  const updateEditingRuleTrigger = (triggerType: string) => {
    if (!editingRule) return;

    const newCondition = {};
    setEditingRule({
      ...editingRule,
      trigger_type: triggerType,
      trigger_condition: newCondition
    });
  };

  const addAction = () => {
    if (!editingRule) return;
    const newActions = [...editingRule.actions, { type: 'send_email', config: {} }];
    setEditingRule({ ...editingRule, actions: newActions });
  };

  const updateAction = (index: number, field: string, value: any) => {
    if (!editingRule) return;
    const newActions = [...editingRule.actions];
    if (field === 'type') {
      newActions[index] = { type: value, config: {} };
    } else {
      newActions[index].config[field] = value;
    }
    setEditingRule({ ...editingRule, actions: newActions });
  };

  const removeAction = (index: number) => {
    if (!editingRule) return;
    const newActions = [...editingRule.actions];
    newActions.splice(index, 1);
    setEditingRule({ ...editingRule, actions: newActions });
  };

  const renderRulesList = (rulesList: AutomationRule[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (rulesList.length === 0) {
      return (
        <div className="text-center p-6 text-muted-foreground">
          No rules found. Create your first rule to automate your workflow.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {rulesList.map((rule) => (
          <Card key={rule.id} className={!rule.is_active ? "opacity-70" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{rule.name}</h3>
                  <p className="text-sm text-muted-foreground">{rule.description || "No description"}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {rule.trigger_type.replace(/_/g, ' ')}
                    </span>
                    <span className="mx-2">→</span>
                    <span>
                      {rule.actions.map(a => a.type.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={rule.is_active}
                    onCheckedChange={() => handleToggleStatus(rule.id!, rule.is_active)}
                    disabled={isSaving}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => editRule(rule)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteRule(rule.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure automation rules to automate your business processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      value={editingRule?.name || ''}
                      onChange={(e) => setEditingRule({ ...editingRule!, name: e.target.value })}
                      placeholder="E.g., Send welcome email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruleStatus">Status</Label>
                    <div className="flex items-center space-x-2 h-10">
                      <Switch
                        checked={editingRule?.is_active || false}
                        onCheckedChange={(checked) => 
                          setEditingRule({ ...editingRule!, is_active: checked })
                        }
                        id="ruleStatus"
                      />
                      <Label htmlFor="ruleStatus">
                        {editingRule?.is_active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ruleDescription">Description (Optional)</Label>
                  <Textarea
                    id="ruleDescription"
                    value={editingRule?.description || ''}
                    onChange={(e) => 
                      setEditingRule({ ...editingRule!, description: e.target.value })
                    }
                    placeholder="Describe what this rule does"
                  />
                </div>

                <div>
                  <Label htmlFor="triggerType">Trigger</Label>
                  <Select
                    value={editingRule?.trigger_type || ''}
                    onValueChange={updateEditingRuleTrigger}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select when this rule should run" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" disabled>Select a trigger</SelectItem>
                      {triggerOptions[activeTab as keyof typeof triggerOptions]?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Actions</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addAction}
                      type="button"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Action
                    </Button>
                  </div>

                  {editingRule?.actions.map((action, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Action {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Action Type</Label>
                          <Select
                            value={action.type}
                            onValueChange={(value) => updateAction(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an action type" />
                            </SelectTrigger>
                            <SelectContent>
                              {actionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {action.type === 'send_email' && (
                          <>
                            <div>
                              <Label>Email Template</Label>
                              <Select
                                value={action.config.templateId || ''}
                                onValueChange={(value) => 
                                  updateAction(index, 'templateId', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select email template" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="welcome">Welcome Email</SelectItem>
                                  <SelectItem value="renewal">Membership Renewal</SelectItem>
                                  <SelectItem value="invoice">Invoice Email</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {action.type === 'send_sms' && (
                          <>
                            <div>
                              <Label>SMS Template</Label>
                              <Select
                                value={action.config.templateId || ''}
                                onValueChange={(value) => 
                                  updateAction(index, 'templateId', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select SMS template" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="welcome">Welcome Message</SelectItem>
                                  <SelectItem value="reminder">Payment Reminder</SelectItem>
                                  <SelectItem value="expiry">Membership Expiry</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {action.type === 'create_invoice' && (
                          <>
                            <div>
                              <Label>Invoice Description</Label>
                              <Input
                                value={action.config.description || ''}
                                onChange={(e) => 
                                  updateAction(index, 'description', e.target.value)
                                }
                                placeholder="e.g., Membership Fee"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveRule}
                  disabled={isSaving}
                >
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
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Tabs 
                  defaultValue="memberRules" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="memberRules">Membership</TabsTrigger>
                    <TabsTrigger value="leadRules">Lead</TabsTrigger>
                    <TabsTrigger value="attendanceRules">Attendance</TabsTrigger>
                    <TabsTrigger value="paymentRules">Payment</TabsTrigger>
                  </TabsList>

                  <div className="flex justify-end mb-4">
                    <Button onClick={addNewRule}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Rule
                    </Button>
                  </div>

                  <TabsContent value="memberRules">
                    {renderRulesList(membershipRules)}
                  </TabsContent>
                  <TabsContent value="leadRules">
                    {renderRulesList(leadRules)}
                  </TabsContent>
                  <TabsContent value="attendanceRules">
                    {renderRulesList(attendanceRules)}
                  </TabsContent>
                  <TabsContent value="paymentRules">
                    {renderRulesList(paymentRules)}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationSettings;
