
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReminderRulesList from "@/components/communication/ReminderRulesList";
import ReminderRuleForm from "@/components/communication/ReminderRuleForm";
import { ReminderRule } from "@/types/notification";

const ReminderPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editRule, setEditRule] = useState<ReminderRule | null>(null);

  const handleEdit = (rule: ReminderRule) => {
    setEditRule(rule);
    setActiveTab("create");
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Automated Reminders</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">All Reminder Rules</TabsTrigger>
            <TabsTrigger value="create">Create Rule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <ReminderRulesList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <ReminderRuleForm 
              editRule={editRule} 
              onComplete={() => {
                setActiveTab("list");
                setEditRule(null);
              }} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ReminderPage;
