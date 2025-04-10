
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ReminderRulesList from '@/components/communication/ReminderRulesList';
import ReminderRuleForm from '@/components/communication/ReminderRuleForm';
import { ReminderRule } from '@/types/notification';

const ReminderPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<ReminderRule | undefined>(undefined);

  const handleEdit = (rule: ReminderRule) => {
    setEditingRule(rule);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingRule(undefined);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reminder Rules</h1>
          <Button onClick={() => setIsFormVisible(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Rule
          </Button>
        </div>

        {isFormVisible ? (
          <ReminderRuleForm
            onComplete={handleCloseForm}
            editRule={editingRule}
          />
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Rules</TabsTrigger>
              <TabsTrigger value="active">Active Rules</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ReminderRulesList filter="all" onEdit={handleEdit} />
            </TabsContent>
            <TabsContent value="active">
              <ReminderRulesList filter="active" onEdit={handleEdit} />
            </TabsContent>
            <TabsContent value="inactive">
              <ReminderRulesList filter="inactive" onEdit={handleEdit} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Container>
  );
};

export default ReminderPage;
