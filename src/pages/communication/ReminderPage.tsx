
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ReminderRulesList from "@/components/communication/ReminderRulesList";
import ReminderRuleForm from "@/components/communication/ReminderRuleForm";
import { ReminderRule } from "@/types/notification";

const ReminderPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [editingRule, setEditingRule] = useState<ReminderRule | undefined>(undefined);
  
  const handleCreateRule = () => {
    setEditingRule(undefined);
    setShowForm(true);
  };
  
  const handleEditRule = (rule: ReminderRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };
  
  const handleCompleteForm = () => {
    toast.success(editingRule 
      ? "Reminder rule updated successfully" 
      : "New reminder rule created successfully"
    );
    setShowForm(false);
    setEditingRule(undefined);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reminder Rules</h1>
        <Button 
          onClick={handleCreateRule}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Set up automated reminders for membership renewals, missed attendances, birthdays, and other events.
      </p>
      
      {showForm ? (
        <ReminderRuleForm
          onComplete={handleCompleteForm}
          editRule={editingRule}
        />
      ) : (
        <Tabs 
          defaultValue={currentTab} 
          onValueChange={setCurrentTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All Rules</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ReminderRulesList onEdit={handleEditRule} />
          </TabsContent>
          
          <TabsContent value="membership">
            <ReminderRulesList onEdit={handleEditRule} />
          </TabsContent>
          
          <TabsContent value="attendance">
            <ReminderRulesList onEdit={handleEditRule} />
          </TabsContent>
          
          <TabsContent value="other">
            <ReminderRulesList onEdit={handleEditRule} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ReminderPage;
