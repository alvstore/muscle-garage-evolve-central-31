
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FollowUpSchedule from '@/components/crm/FollowUpSchedule';
import FollowUpHistoryComponent from '@/components/crm/FollowUpHistory';
import FollowUpTemplateForm from '@/components/crm/FollowUpTemplateForm';
import { FollowUpTemplate } from '@/types/crm';

const FollowUpPage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [editingTemplate, setEditingTemplate] = useState<FollowUpTemplate | undefined>(undefined);
  
  const handleEditTemplate = (template: FollowUpTemplate) => {
    setEditingTemplate(template);
    setActiveTab('templates');
  };
  
  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setActiveTab('templates');
  };
  
  const handleTemplateComplete = () => {
    setActiveTab('schedule');
    setEditingTemplate(undefined);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Follow-up Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="schedule">Schedule Follow-ups</TabsTrigger>
            <TabsTrigger value="history">Follow-up History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="mt-6">
            <FollowUpSchedule />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <FollowUpHistoryComponent />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <FollowUpTemplateForm 
              template={editingTemplate} 
              onComplete={handleTemplateComplete} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FollowUpPage;
