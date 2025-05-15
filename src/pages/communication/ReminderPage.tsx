
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useReminderRules } from '@/hooks/use-reminder-rules';
import ReminderRulesList from '@/components/communication/ReminderRulesList';
import ReminderRuleForm from '@/components/communication/ReminderRuleForm';
import { ReminderRule } from '@/types/notification';
import { Plus } from 'lucide-react';

export default function ReminderPage() {
  const { rules, isLoading, fetchRules, deleteRule, toggleRuleStatus } = useReminderRules();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editRule, setEditRule] = useState<ReminderRule | null>(null);

  const handleEditRule = (rule: ReminderRule) => {
    setEditRule(rule);
    setIsDialogOpen(true);
  };

  const handleFormComplete = () => {
    setIsDialogOpen(false);
    setEditRule(null);
    fetchRules();
  };

  const handleDeleteRule = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this reminder rule?');
    if (confirmed) {
      await deleteRule(id);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleRuleStatus(id, isActive);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Automated Reminders</h1>
            <p className="text-muted-foreground">
              Set up rules for automatic reminders to members
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditRule(null)}>
                <Plus className="mr-2 h-4 w-4" /> Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <ReminderRuleForm 
                editRule={editRule}
                onComplete={handleFormComplete}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ReminderRulesList
          rules={rules}
          isLoading={isLoading}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggleActive={handleToggleActive}
        />
      </div>
    </Container>
  );
}
