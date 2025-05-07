
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAutomationRules, AutomationRule } from "@/hooks/use-automation-rules";
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Form schema for automation rule
const automationRuleSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  trigger_type: z.string().min(1, "Please select a trigger type"),
  is_active: z.boolean().default(true),
  // We'll handle these complex objects separately
  // trigger_condition: z.record(z.any()),
  // actions: z.array(z.record(z.any()))
});

type AutomationRuleFormValues = z.infer<typeof automationRuleSchema>;

const AutomationSettings: React.FC = () => {
  const { rules, isLoading, saveRule, deleteRule, toggleRuleStatus } = useAutomationRules();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<AutomationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const form = useForm<AutomationRuleFormValues>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger_type: "",
      is_active: true
    }
  });
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen && currentRule) {
      form.reset({
        name: currentRule.name,
        description: currentRule.description || "",
        trigger_type: currentRule.trigger_type,
        is_active: currentRule.is_active
      });
    } else if (isDialogOpen) {
      form.reset({
        name: "",
        description: "",
        trigger_type: "",
        is_active: true
      });
    }
  }, [isDialogOpen, currentRule, form]);

  const handleCreateRule = () => {
    setCurrentRule(null);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setCurrentRule(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRule = async () => {
    if (ruleToDelete) {
      const success = await deleteRule(ruleToDelete);
      if (success) {
        toast.success("Rule deleted successfully");
      }
      setIsDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const onSubmit = async (data: AutomationRuleFormValues) => {
    // Default values for trigger condition and actions
    const defaultTriggerCondition = {
      type: data.trigger_type,
      value: 1
    };

    const defaultAction = {
      type: "notification",
      message: `This is a system notification triggered by ${data.name}`,
      channels: ["email"]
    };

    const ruleData: AutomationRule = {
      ...data,
      trigger_condition: currentRule?.trigger_condition || defaultTriggerCondition,
      actions: currentRule?.actions || [defaultAction],
      id: currentRule?.id
    };

    const success = await saveRule(ruleData);
    if (success) {
      setIsDialogOpen(false);
      toast.success(currentRule ? "Rule updated successfully" : "Rule created successfully");
    }
  };

  const handleToggleStatus = async (ruleId: string, isActive: boolean) => {
    const success = await toggleRuleStatus(ruleId, isActive);
    if (success) {
      toast.success(`Rule ${isActive ? 'enabled' : 'disabled'} successfully`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>Configure rules that trigger automated actions</CardDescription>
          </div>
          <Button onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" /> Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading rules...</span>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center p-6 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-medium">No automation rules found</h3>
              <p className="text-muted-foreground my-2">
                Create your first automation rule to start automating repetitive tasks.
              </p>
              <Button onClick={handleCreateRule} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Create Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className="p-4 border rounded-lg hover:bg-accent/5 transition-colors flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center">
                      {rule.name}
                      {!rule.is_active && (
                        <Badge variant="outline" className="ml-2 text-muted-foreground">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.description || "No description provided"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {rule.trigger_type}
                      </Badge>
                      <span>{rule.actions?.length || 0} actions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) => handleToggleStatus(rule.id!, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRule(rule.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentRule ? "Edit" : "Create"} Automation Rule</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g., Send welcome email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe what this rule does"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trigger_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select when this rule should trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="membership_expiry">Membership Expiry</SelectItem>
                        <SelectItem value="new_member">New Member Registration</SelectItem>
                        <SelectItem value="birthday">Member Birthday</SelectItem>
                        <SelectItem value="missed_classes">Missed Classes</SelectItem>
                        <SelectItem value="inactive_member">Inactive Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Rule Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentRule ? "Update" : "Create"} Rule
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this automation rule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AutomationSettings;
