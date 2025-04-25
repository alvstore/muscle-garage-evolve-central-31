
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ReminderRulesList from "@/components/communication/ReminderRulesList";
import ReminderRuleForm from "@/components/communication/ReminderRuleForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderRule } from "@/types/notification";

const ReminderPage = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [openRuleDialog, setOpenRuleDialog] = useState(false);
  const [editRule, setEditRule] = useState<ReminderRule | null>(null);

  const handleCreateNew = () => {
    setEditRule(null);
    setOpenRuleDialog(true);
  };

  const handleEditRule = (rule: ReminderRule) => {
    setEditRule(rule);
    setOpenRuleDialog(true);
  };

  const handleRuleComplete = () => {
    setOpenRuleDialog(false);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reminder Rules</h1>
            <p className="text-muted-foreground">
              Configure automated reminders for members and staff
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="ml-auto"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Reminder Rule
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Rules List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <ReminderRulesList onEdit={handleEditRule} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center py-10 text-muted-foreground">
                Reminders analytics will be available soon.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center py-10 text-muted-foreground">
                Reminder notification logs will be available soon.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={openRuleDialog} onOpenChange={setOpenRuleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editRule ? 'Edit Reminder Rule' : 'Create New Reminder Rule'}</DialogTitle>
          </DialogHeader>
          <ReminderRuleForm 
            editRule={editRule} 
            onComplete={handleRuleComplete} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ReminderPage;
