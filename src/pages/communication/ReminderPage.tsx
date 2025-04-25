
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReminderRulesList from '@/components/communication/ReminderRulesList';
import ReminderRuleForm from '@/components/communication/ReminderRuleForm';
import { useReminderRules } from '@/hooks/use-reminder-rules';
import { ReminderRule } from '@/types/notification';

interface ReminderRuleFormProps {
  initialValues?: Partial<ReminderRule>;
  onSubmit: (data: Partial<ReminderRule>) => void;
  onCancel: () => void;
}

const ReminderPage = () => {
  const { reminderRules, isLoading, createReminderRule, updateReminderRule, fetchReminderRules } = useReminderRules();
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  
  const handleAddRule = () => {
    setEditingRule(null);
    setShowForm(true);
  };
  
  const handleEditRule = (rule: ReminderRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };
  
  const handleSubmitRule = async (ruleData: Partial<ReminderRule>) => {
    try {
      if (editingRule) {
        await updateReminderRule(editingRule.id, ruleData);
      } else {
        await createReminderRule(ruleData as Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setShowForm(false);
      setEditingRule(null);
      fetchReminderRules();
    } catch (error) {
      console.error('Error saving reminder rule:', error);
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reminder Rules</h1>
          {!showForm && (
            <Button onClick={handleAddRule}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          )}
        </div>
        
        {showForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingRule ? 'Edit Reminder Rule' : 'Create Reminder Rule'}</CardTitle>
              <CardDescription>
                Configure when and how reminders are sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReminderRuleForm 
                initialValues={editingRule || undefined} 
                onSubmit={handleSubmitRule} 
                onCancel={handleCancelForm}
              />
            </CardContent>
          </Card>
        ) : (
          <ReminderRulesList 
            onEdit={handleEditRule} 
            onAdd={handleAddRule} 
          />
        )}
      </div>
    </Container>
  );
};

export default ReminderPage;
